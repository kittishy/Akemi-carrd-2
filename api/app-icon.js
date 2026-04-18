const REQUEST_TIMEOUT_MS = 4500;
const DISCORD_RPC_API = "https://discord.com/api/v10/applications";
const DISCORD_CDN = "https://cdn.discordapp.com/app-icons";
const ICON_SIZE = 512;

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const appId = (req.query.id || "").trim();

  if (!appId || !/^\d+$/.test(appId)) {
    res.status(400).json({ error: "Missing or invalid application id" });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${DISCORD_RPC_API}/${appId}/rpc`, {
      method: "GET",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Discord API returned ${response.status}`);
    }

    const data = await response.json();
    const iconHash = data && typeof data.icon === "string" ? data.icon.trim() : "";

    if (!iconHash) {
      // No icon available — redirect to dcdn.dstn.to as fallback
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      res.writeHead(302, { Location: `https://dcdn.dstn.to/app-icons/${appId}` });
      res.end();
      return;
    }

    const hdUrl = `${DISCORD_CDN}/${appId}/${iconHash}.png?size=${ICON_SIZE}`;

    // Cache aggressively — app icons rarely change
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.writeHead(302, { Location: hdUrl });
    res.end();
  } catch (_error) {
    // On error, fall back to dcdn.dstn.to
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.writeHead(302, { Location: `https://dcdn.dstn.to/app-icons/${appId}` });
    res.end();
  } finally {
    clearTimeout(timeout);
  }
};
