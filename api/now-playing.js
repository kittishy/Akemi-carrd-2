const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const API_METHOD = "user.getrecenttracks";
const REQUEST_TIMEOUT_MS = 4500;

// ── Server-side short-lived cache ──────────────────────────────────────────
// Vercel reuses warm function instances. Keep a very small in-memory cache so
// bursts of requests do not hammer Last.fm, but always revalidate quickly
// enough for the client poller to observe track changes near real-time.
let _serverCache = null;   // { payload, etag, fetchedAt }
const SERVER_CACHE_TTL_MS = 4000;

const getEnv = (name, fallback = "") => {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : fallback;
};

const safeText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

/**
 * Sanitize any string value to prevent XSS when outputting to clients.
 */
const sanitizeOutput = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return String(value);
  return value.replace(/[<>&"'`]/g, "").substring(0, 1000);
};

// Known Last.fm placeholder image hashes — these are served when no real art exists.
// Treat them as absent so callers fall back to DEFAULT_ART.
const LASTFM_PLACEHOLDER_HASHES = new Set([
  "2a96cbd8b46e442fc41c2b86b821562f"
]);

const isLastfmPlaceholder = (url) => {
  if (!url) return false;
  return Array.from(LASTFM_PLACEHOLDER_HASHES).some((hash) => url.includes(hash));
};

const extractImageUrl = (track) => {
  if (!track || !Array.isArray(track.image)) {
    return "";
  }

  const preferred = ["extralarge", "large", "medium", "small"];
  for (const size of preferred) {
    const image = track.image.find((entry) => entry && entry.size === size && safeText(entry["#text"]));
    if (image) {
      const url = safeText(image["#text"]);
      if (url && !isLastfmPlaceholder(url)) {
        return url;
      }
    }
  }

  const first = track.image.find((entry) => {
    const url = entry && safeText(entry["#text"]);
    return url && !isLastfmPlaceholder(url);
  });
  return first ? safeText(first["#text"]) : "";
};

const normalizePayload = (track) => {
  const nowPlaying = safeText(track && track["@attr"] && track["@attr"].nowplaying).toLowerCase() === "true";
  if (!nowPlaying) {
    return {
      status: "idle",
      track: null,
      source: "lastfm",
      updatedAt: new Date().toISOString(),
      isStale: false
    };
  }

  const artistName = safeText(track && track.artist && track.artist["#text"]);
  const trackName = safeText(track && track.name);
  const albumName = safeText(track && track.album && track.album["#text"]);
  const trackUrl = safeText(track && track.url);
  const imageUrl = extractImageUrl(track);

  return {
    status: "playing",
    track: {
      name: sanitizeOutput(trackName),
      artist: sanitizeOutput(artistName),
      album: sanitizeOutput(albumName),
      imageUrl,
      lastfmUrl: trackUrl
    },
    source: "lastfm",
    updatedAt: new Date().toISOString(),
    isStale: false
  };
};

const buildEtag = (payload) => {
  const base = JSON.stringify({
    status: payload.status,
    track: payload.track
  });

  let hash = 0;
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }

  return `W/"${Math.abs(hash)}"`;
};

// ── Upstream fetch (isolated so it can be called async in background) ────
const fetchFromLastFm = async (apiKey, username) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const search = new URLSearchParams({
      method: API_METHOD,
      user: username,
      api_key: apiKey,
      format: "json",
      limit: "1"
    });

    const response = await fetch(`${LASTFM_BASE_URL}?${search.toString()}`, {
      method: "GET",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Last.fm request failed (${response.status})`);
    }

    const data = await response.json();
    const track = data && data.recenttracks && Array.isArray(data.recenttracks.track)
      ? data.recenttracks.track[0]
      : null;
    const payload = normalizePayload(track);
    const etag = buildEtag(payload);

    return { payload, etag, fetchedAt: Date.now() };
  } finally {
    clearTimeout(timeout);
  }
};

const getCachedNowPlaying = async (apiKey, username) => {
  const now = Date.now();

  if (_serverCache && (now - _serverCache.fetchedAt) < SERVER_CACHE_TTL_MS) {
    return _serverCache;
  }

  try {
    const result = await fetchFromLastFm(apiKey, username);
    _serverCache = result;
    return result;
  } catch (error) {
    if (_serverCache) {
      return {
        ..._serverCache,
        payload: {
          ..._serverCache.payload,
          isStale: true,
          updatedAt: new Date().toISOString()
        }
      };
    }

    throw error;
  }
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ status: "error", message: "Method not allowed" });
    return;
  }

  const apiKey = getEnv("LAST_FM_API_KEY");
  const username = getEnv("LAST_FM_USERNAME", "gxth_akemi");

  if (!apiKey || !username) {
    res.status(500).json({ status: "error", message: "Missing Last.fm configuration" });
    return;
  }

  try {
    const { payload, etag } = await getCachedNowPlaying(apiKey, username);

    res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
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
      track: null,
      source: "lastfm",
      updatedAt: new Date().toISOString(),
      isStale: true
    });
  }
};
