(function () {
  "use strict";

  var script = document.currentScript;
  var endpoint = script && script.dataset.endpoint;
  var lastPath = null;

  if (!endpoint) return;

  function sendPageView() {
    var pagePath = window.location.pathname;
    if (pagePath === lastPath) return;
    lastPath = pagePath;

    var payload = JSON.stringify({ path: pagePath });
    var body = new Blob([payload], { type: "text/plain;charset=UTF-8" });
    var queued = false;

    try {
      queued = navigator.sendBeacon && navigator.sendBeacon(endpoint, body);
    } catch (error) {
      queued = false;
    }

    if (!queued) {
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        credentials: "omit",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: payload
      }).catch(function () {});
    }
  }

  sendPageView();
  document.addEventListener("pjax:complete", sendPageView);
})();
