const DISCORD_USER_ID = "334980960351158276";
const LANYARD_API = "https://api.lanyard.rest/v1/users/";
const DISCORD_RPC_API = "https://discord.com/api/v10/applications";
const DISCORD_CDN = "https://cdn.discordapp.com/app-icons";
const ICON_SIZE = 512;
const REQUEST_TIMEOUT_MS = 4500;
const ICON_RESOLVE_TIMEOUT_MS = 2000; // tight budget — icon lookup is best-effort

// ── Server-side icon hash cache ───────────────────────────────────────────
// App icons almost never change. Cache resolved CDN URLs for 24h so repeated
// calls within the same warm function instance skip the Discord RPC round-trip.
// Key: applicationId → value: { url, cachedAt }
const _iconCache = new Map();
const ICON_CACHE_TTL_MS = 86400_000; // 24 hours

/**
 * Discord activity types (from Discord Gateway docs):
 * 0 = Playing (Game)
 * 1 = Streaming
 * 2 = Listening (Spotify, etc.)
 * 3 = Watching
 * 4 = Custom Status
 * 5 = Competing
 */
const ACTIVITY_TYPE_LABELS = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  4: "Custom Status",
  5: "Competing in"
};

const safeText = (value) =>
  typeof value === "string" ? value.trim().replace(/[<>\"'&]/g, "") : "";

/**
 * Sanitize any string value to prevent XSS when outputting to clients.
 * Allows only safe characters: letters, numbers, spaces, and basic punctuation.
 */
const sanitizeOutput = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return String(value);
  return value.replace(/[<>&"'`]/g, "").substring(0, 1000);
};

// ── Resolve app icon to a direct CDN URL (with in-process cache) ──────────
// Replaces the /api/app-icon proxy redirect with a server-side lookup so the
// client receives a final cdn.discordapp.com URL and only needs one hop.
const resolveIconUrl = async (applicationId) => {
  if (!applicationId) return "";

  // Return cached URL if still fresh
  const cached = _iconCache.get(applicationId);
  if (cached && (Date.now() - cached.cachedAt) < ICON_CACHE_TTL_MS) {
    return cached.url;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ICON_RESOLVE_TIMEOUT_MS);

  try {
    const response = await fetch(`${DISCORD_RPC_API}/${applicationId}/rpc`, {
      method: "GET",
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`Discord RPC ${response.status}`);

    const data = await response.json();
    const iconHash = data && typeof data.icon === "string" ? data.icon.trim() : "";
    const url = iconHash
      ? `${DISCORD_CDN}/${applicationId}/${iconHash}.png?size=${ICON_SIZE}`
      : `https://dcdn.dstn.to/app-icons/${applicationId}`;

    _iconCache.set(applicationId, { url, cachedAt: Date.now() });
    return url;
  } catch (_err) {
    // On failure fall back to dcdn (same as app-icon.js error path)
    const fallback = `https://dcdn.dstn.to/app-icons/${applicationId}`;
    _iconCache.set(applicationId, { url: fallback, cachedAt: Date.now() });
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
};

const resolveAssetUrl = (applicationId, assetKey) => {
  if (!assetKey) return "";
  if (assetKey.startsWith("mp:external/")) {
    const path = assetKey.replace("mp:external/", "");
    return `https://media.discordapp.net/external/${path}`;
  }
  if (assetKey.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${assetKey.replace("spotify:", "")}`;
  }
  if (/^\d+$/.test(assetKey) && applicationId) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetKey}.png?size=512`;
  }
  return "";
};

const normalizeActivity = async (activity) => {
  const type = typeof activity.type === "number" ? activity.type : 0;
  const label = ACTIVITY_TYPE_LABELS[type] || "Playing";
  const applicationId = safeText(activity.application_id);

  let largeImage = resolveAssetUrl(
    applicationId,
    safeText(activity.assets && activity.assets.large_image)
  );

  // Fallback: resolve the icon hash server-side so the client gets a direct
  // CDN URL instead of going through the /api/app-icon redirect proxy.
  if (!largeImage && applicationId) {
    largeImage = await resolveIconUrl(applicationId);
  }

  const smallImage = resolveAssetUrl(
    applicationId,
    safeText(activity.assets && activity.assets.small_image)
  );

  return {
    type,
    label,
    name: sanitizeOutput(activity.name),
    details: sanitizeOutput(activity.details),
    state: sanitizeOutput(activity.state),
    largeImage,
    smallImage,
    largeText: sanitizeOutput(activity.assets && activity.assets.large_text),
    smallText: sanitizeOutput(activity.assets && activity.assets.small_text),
    applicationId: sanitizeOutput(applicationId),
    timestamps: activity.timestamps || null,
    createdAt: activity.created_at || null
  };
};

const buildEtag = (activities) => {
  const base = JSON.stringify(activities.map((a) => [a.name, a.details, a.state, a.type]));
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return `W/"${Math.abs(hash)}"`;
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${LANYARD_API}${DISCORD_USER_ID}`, {
      method: "GET",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Lanyard request failed (${response.status})`);
    }

    const json = await response.json();

    if (!json.success || !json.data) {
      throw new Error("Lanyard returned unsuccessful response");
    }

    const data = json.data;
    const allActivities = Array.isArray(data.activities) ? data.activities : [];

    // Filter out: Spotify/Listening (type 2) and Custom Status (type 4)
    // normalizeActivity is now async (resolves icon URLs server-side), so
    // run all normalisations in parallel — icon lookups have their own 2s
    // timeout and won't block the response beyond REQUEST_TIMEOUT_MS.
    const activities = await Promise.all(
      allActivities
        .filter((a) => a.type !== 2 && a.type !== 4)
        .map(normalizeActivity)
    );

    const payload = {
      status: "ok",
      discordStatus: safeText(data.discord_status),
      activities,
      activityCount: activities.length,
      updatedAt: new Date().toISOString()
    };

    const etag = buildEtag(activities);

    res.setHeader("Cache-Control", "public, max-age=10, stale-while-revalidate=30");
    res.setHeader("ETag", etag);

    if (req.headers["if-none-match"] === etag) {
      res.status(304).end();
      return;
    }

    res.status(200).json(payload);
  } catch (_error) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      status: "error",
      discordStatus: "offline",
      activities: [],
      activityCount: 0,
      updatedAt: new Date().toISOString()
    });
  } finally {
    clearTimeout(timeout);
  }
};
