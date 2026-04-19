// Theme toggle
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");
  });
}

// Global protocol check for common local testing issues
if (window.location.protocol === "file:") {
  console.warn(
    "[Akemi Debug] Site is running via 'file://' protocol. Dynamic features like Last.fm and Lanyard may be blocked by CORS. Please use a local server (e.g. npm run dev or npx serve) for full functionality."
  );
}

/* ================================================================
   LAST.FM NOW PLAYING SYSTEM
   ================================================================ */
(function () {
  const rootEl = document.getElementById("container06");
  const artEl = document.getElementById("now-playing-art");
  const trackEl = document.getElementById("now-playing-track");
  const artistEl = document.getElementById("now-playing-artist");
  const linkEl = document.getElementById("now-playing-link");

  if (!rootEl || !trackEl || !artistEl || !linkEl || !artEl) return;

  const POLL_PLAYING = 5000;
  const POLL_IDLE = 30000;
  const POLL_HIDDEN = 300000;
  const POLL_ERROR_BASE = 30000;
  const POLL_ERROR_MAX = 300000;
  const STALE_KEEP_PLAYING_MS = 120000;
  const DEFAULT_ART = "./assets/Haimiya-senpai wa Kowakute Kawaii.jpg";
  const endpoint = "/api/now-playing";

  artEl.onerror = function () {
    if (!this.src.endsWith(DEFAULT_ART) && !this.src.includes(DEFAULT_ART)) {
      this.onerror = null;
      this.src = DEFAULT_ART;
    } else {
      this.onerror = null;
    }
  };

  let mode = "spotify";
  let timer = null;
  let etag = "";
  let inFlightController = null;
  let errorCount = 0;
  let lastPlayingAt = 0;
  let lastTrackKey = "";
  let lastTrackImage = "";
  let lastTrackUrl = "";

  const withJitter = (ms) => {
    const jitter = Math.round(ms * 0.1 * Math.random());
    return ms + jitter;
  };

  const schedule = (ms) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(runUpdate, withJitter(ms));
  };

  const setMode = (nextMode) => {
    if (mode === nextMode) return;
    mode = nextMode;
    rootEl.classList.toggle("is-now-playing", nextMode === "now-playing");

    if (nextMode === "spotify") {
      const iframe = document.getElementById("spotify-player");
      if (
        iframe &&
        iframe.dataset.src &&
        (!iframe.src || iframe.src === "about:blank")
      ) {
        iframe.src = iframe.dataset.src;
      }
    }
  };

  const cardEl = document.getElementById("now-playing-card");

  const clearLoading = () => {
    if (cardEl && cardEl.classList.contains("is-loading")) {
      cardEl.classList.remove("is-loading");
      cardEl.removeAttribute("aria-busy");
    }
  };

  const setText = (el, value) => {
    const span = el.querySelector(".now-playing-text");
    if (span) span.textContent = value;
    else el.textContent = value;
  };

  const writeTrack = (payload) => {
    const nextTrack = payload && payload.track ? payload.track : null;
    if (!nextTrack) return;

    const nextTrackKey = [nextTrack.artist, nextTrack.name, nextTrack.album]
      .filter(Boolean)
      .join("::");
    const nextTrackUrl = nextTrack.lastfmUrl || "https://www.last.fm";
    const nextTrackImage = nextTrack.imageUrl || DEFAULT_ART;

    if (
      nextTrackKey === lastTrackKey &&
      nextTrackUrl === lastTrackUrl &&
      nextTrackImage === lastTrackImage
    ) {
      clearLoading();
      return;
    }

    lastTrackKey = nextTrackKey;
    lastTrackUrl = lastTrackUrl;
    lastTrackImage = nextTrackImage;

    setText(trackEl, nextTrack.name || "Unknown track");
    setText(artistEl, nextTrack.artist || "Unknown artist");
    linkEl.href = nextTrackUrl;
    artEl.src = nextTrackImage;
    clearLoading();
  };

  const fetchNowPlaying = async () => {
    if (inFlightController) inFlightController.abort();
    inFlightController = new AbortController();
    const timeoutId = window.setTimeout(
      () => inFlightController.abort(),
      4500
    );

    try {
      const headers = {};
      if (etag) headers["If-None-Match"] = etag;

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        headers,
        signal: inFlightController.signal,
      });

      if (response.status === 304) return { notModified: true };
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("[Akemi Music] Endpoint /api/now-playing not found. Ensure you are running on a server (Vercel/Vite).");
        } else if (response.status === 500) {
          console.error("[Akemi Music] Last.fm API Key or Username missing in environment variables.");
        }
        throw new Error(`Failed request (${response.status})`);
      }

      const responseEtag = response.headers.get("ETag");
      if (responseEtag) etag = responseEtag;

      return await response.json();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("[Akemi Music] Fetch error:", err.message);
      }
      throw err;
    } finally {
      window.clearTimeout(timeoutId);
      inFlightController = null;
    }
  };

  const handleOffline = () => {
    if (
      mode === "now-playing" &&
      Date.now() - lastPlayingAt <= STALE_KEEP_PLAYING_MS
    ) {
      schedule(POLL_HIDDEN);
      return;
    }
    setMode("spotify");
    schedule(POLL_HIDDEN);
  };

  const runUpdate = async () => {
    if (document.hidden) {
      schedule(POLL_HIDDEN);
      return;
    }
    if (!navigator.onLine) {
      handleOffline();
      return;
    }

    try {
      const payload = await fetchNowPlaying();
      if (payload && payload.notModified) {
        schedule(mode === "now-playing" ? POLL_PLAYING : POLL_IDLE);
        return;
      }

      errorCount = 0;
      if (payload && payload.status === "playing") {
        writeTrack(payload);
        lastPlayingAt = Date.now();
        setMode("now-playing");
        schedule(POLL_PLAYING);
        return;
      }

      setMode("spotify");
      schedule(POLL_IDLE);
    } catch (_error) {
      errorCount += 1;
      const errorPoll = Math.min(
        POLL_ERROR_BASE * Math.pow(2, errorCount - 1),
        POLL_ERROR_MAX
      );
      if (
        mode === "now-playing" &&
        Date.now() - lastPlayingAt <= STALE_KEEP_PLAYING_MS
      ) {
        schedule(errorPoll);
        return;
      }
      setMode("spotify");
      schedule(errorPoll);
    }
  };

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (inFlightController) {
        inFlightController.abort();
        inFlightController = null;
      }
    } else {
      runUpdate();
    }
  });

  window.addEventListener("online", function () {
    if (!document.hidden) runUpdate();
  });
  window.addEventListener("offline", handleOffline);

  runUpdate();

  // Initial fallback load for Spotify
  window.setTimeout(function () {
    const iframe = document.getElementById("spotify-player");
    if (
      iframe &&
      iframe.dataset.src &&
      (!iframe.src || iframe.src === "about:blank")
    ) {
      iframe.src = iframe.dataset.src;
    }
  }, 3000);
})();

/* ================================================================
   LANYARD DISCORD ACTIVITIES — WebSocket with REST fallback
   ================================================================ */
(function () {
  return; // Temporarily disabled by user
  var DISCORD_USER_ID = "334980960351158276";
  var WS_URL = "wss://api.lanyard.rest/socket";
  var REST_URL = "https://api.lanyard.rest/v1/users/" + DISCORD_USER_ID;

  var DEFAULT_ART =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="3"/><circle cx="8.5" cy="12" r="1.5"/><circle cx="15.5" cy="12" r="1.5"/><path d="M6 9v0M11 9v0"/></svg>'
    );

  var container = document.getElementById("lanyard-activities");
  if (!container) return;

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var ELAPSED_TICK_MS = reduceMotion ? 10000 : 1000;

  var ACTIVITY_LABELS = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    4: "Custom Status",
    5: "Competing in",
  };

  var ws = null;
  var heartbeatInterval = null;
  var reconnectDelay = 1000;
  var maxReconnect = 30000;
  var elapsedTimers = [];
  var lastActivitiesKey = "";

  function safeText(val) {
    return typeof val === "string" ? val.trim() : "";
  }

  function resolveAssetUrl(appId, key) {
    if (!key) return "";
    if (key.indexOf("mp:external/") === 0) {
      return (
        "https://media.discordapp.net/external/" +
        key.replace("mp:external/", "")
      );
    }
    if (key.indexOf("spotify:") === 0) {
      return "https://i.scdn.co/image/" + key.replace("spotify:", "");
    }
    if (/^\d+$/.test(key) && appId) {
      return (
        "https://cdn.discordapp.com/app-assets/" +
        appId +
        "/" +
        key +
        ".png?size=512"
      );
    }
    return "";
  }

  function formatElapsed(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    var pad = function (n) {
      return n < 10 ? "0" + n : "" + n;
    };
    if (hours > 0)
      return (
        pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + " elapsed"
      );
    return pad(minutes) + ":" + pad(seconds) + " elapsed";
  }

  function clearElapsedTimers() {
    for (var i = 0; i < elapsedTimers.length; i++) {
      clearInterval(elapsedTimers[i]);
    }
    elapsedTimers = [];
  }

  function buildActivityCard(activity) {
    var type = typeof activity.type === "number" ? activity.type : 0;
    var label = ACTIVITY_LABELS[type] || "Playing";
    var appId = safeText(activity.application_id);
    var name = safeText(activity.name);
    var details = safeText(activity.details);
    var state = safeText(activity.state);
    var largeImage = resolveAssetUrl(
      appId,
      activity.assets && safeText(activity.assets.large_image)
    );

    if (!largeImage && appId) {
      largeImage = "/api/app-icon?id=" + appId;
    }

    var smallImage = resolveAssetUrl(
      appId,
      activity.assets && safeText(activity.assets.small_image)
    );
    var largeText = activity.assets ? safeText(activity.assets.large_text) : "";
    var smallText = activity.assets ? safeText(activity.assets.small_text) : "";
    var startTimestamp =
      activity.timestamps && activity.timestamps.start
        ? activity.timestamps.start
        : null;

    var card = document.createElement("article");
    card.className = "activity-card";
    card.setAttribute("aria-label", label + " " + name);

    var artWrapper = document.createElement("div");
    artWrapper.className = "activity-art-wrapper";

    var img = document.createElement("img");
    img.className = "activity-art";
    img.src = largeImage || DEFAULT_ART;
    img.alt = largeText || name;
    img.width = 52;
    img.height = 52;
    img.loading = "lazy";
    img.decoding = "async";
    img.fetchPriority = "low";
    img.onerror = function () {
      if (this.src !== DEFAULT_ART && !this.src.endsWith(DEFAULT_ART)) {
        this.onerror = null;
        this.src = DEFAULT_ART;
      }
    };
    artWrapper.appendChild(img);

    if (smallImage) {
      var smallImg = document.createElement("img");
      smallImg.className = "activity-art-small";
      smallImg.src = smallImage;
      smallImg.alt = smallText || "";
      smallImg.width = 20;
      smallImg.height = 20;
      smallImg.loading = "lazy";
      smallImg.decoding = "async";
      smallImg.fetchPriority = "low";
      smallImg.onerror = function () {
        this.style.display = "none";
      };
      artWrapper.appendChild(smallImg);
    }

    card.appendChild(artWrapper);

    var info = document.createElement("div");
    var labelEl = document.createElement("p");
    labelEl.className = "activity-label";
    var pulse = document.createElement("span");
    pulse.className = "activity-pulse";
    pulse.setAttribute("aria-hidden", "true");
    labelEl.appendChild(pulse);
    labelEl.appendChild(document.createTextNode(label));
    info.appendChild(labelEl);

    var nameEl = document.createElement("p");
    nameEl.className = "activity-name";
    nameEl.textContent = name || "Unknown";
    info.appendChild(nameEl);

    if (details) {
      var detailsEl = document.createElement("p");
      detailsEl.className = "activity-details";
      detailsEl.textContent = details;
      info.appendChild(detailsEl);
    }

    if (state) {
      var stateEl = document.createElement("p");
      stateEl.className = "activity-state";
      stateEl.textContent = state;
      info.appendChild(stateEl);
    }

    if (startTimestamp) {
      var elapsedEl = document.createElement("p");
      elapsedEl.className = "activity-elapsed";
      var updateElapsed = function () {
        var now = Date.now();
        var diff = now - startTimestamp;
        if (diff < 0) diff = 0;
        elapsedEl.textContent = formatElapsed(diff);
      };
      updateElapsed();
      var timerId = setInterval(updateElapsed, ELAPSED_TICK_MS);
      elapsedTimers.push(timerId);
      info.appendChild(elapsedEl);
    }

    card.appendChild(info);
    return card;
  }

  function renderActivities(activities) {
    var filtered = [];
    for (var i = 0; i < activities.length; i++) {
      if (activities[i].type !== 2 && activities[i].type !== 4) {
        filtered.push(activities[i]);
      }
    }

    var key = JSON.stringify(
      filtered.map(function (a) {
        return [a.name, a.details, a.state, a.type, a.application_id];
      })
    );
    if (key === lastActivitiesKey) return;
    lastActivitiesKey = key;

    clearElapsedTimers();
    container.innerHTML = "";

    for (var j = 0; j < filtered.length; j++) {
      container.appendChild(buildActivityCard(filtered[j]));
    }
  }

  function connectWS() {
    if (ws) {
      try {
        ws.close();
      } catch (e) {}
    }
    ws = new WebSocket(WS_URL);
    ws.onopen = function () {
      console.log("[Akemi Lanyard] WebSocket connected.");
      reconnectDelay = 1000;
    };
    ws.onmessage = function (event) {
      var msg;
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        return;
      }
      if (msg.op === 1) {
        var interval =
          msg.d && msg.d.heartbeat_interval ? msg.d.heartbeat_interval : 30000;
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        heartbeatInterval = setInterval(function () {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 3 }));
          }
        }, interval);
        ws.send(
          JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } })
        );
      }
      if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
        var activities =
          msg.d && Array.isArray(msg.d.activities) ? msg.d.activities : [];
        renderActivities(activities);
      }
    };
    ws.onclose = function (e) {
      console.warn("[Akemi Lanyard] WebSocket closed:", e.reason || "Unknown reason");
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      setTimeout(function () {
        reconnectDelay = Math.min(reconnectDelay * 2, maxReconnect);
        connectWS();
      }, reconnectDelay);
    };
    ws.onerror = function(err) {
      console.error("[Akemi Lanyard] WebSocket error observed.");
    };
  }

  function fetchREST() {
    fetch(REST_URL)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        if (json.success && json.data && Array.isArray(json.data.activities)) {
          renderActivities(json.data.activities);
        }
      })
      .catch(function (err) {
        console.warn("[Akemi Lanyard] REST fallback failed:", err.message);
      });
  }

  fetchREST();
  connectWS();
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) connectWS();
  });
  window.addEventListener("online", function () {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      fetchREST();
      connectWS();
    }
  });
})();
