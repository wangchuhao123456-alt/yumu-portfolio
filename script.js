(function () {
  var overlay = document.querySelector(".intro-overlay");
  var isHomePage = /(?:^|\/)index\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith("/");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cardVideos = Array.prototype.slice.call(document.querySelectorAll(".js-card-video"));

  document.body.classList.add("js-ready");

  if (!overlay || !isHomePage) {
    initScrollReveal();
    initCardVideos();
    return;
  }

  if (reduceMotion) {
    overlay.remove();
    initScrollReveal();
    initCardVideos();
    return;
  }

  document.body.classList.add("is-intro-active");

  window.setTimeout(function () {
    document.body.classList.add("is-intro-fadeout");
  }, 1500);

  window.setTimeout(function () {
    document.body.classList.remove("is-intro-active", "is-intro-fadeout");
    overlay.remove();
    initScrollReveal();
    initCardVideos();
  }, 2250);

  function initCardVideos() {
    if (!cardVideos.length) {
      return;
    }

    var activationEvents = ["touchstart", "click", "scroll"];
    var hasActivated = false;

    cardVideos.forEach(function (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");

      attemptPlay(video);

      video.addEventListener("loadeddata", function () {
        attemptPlay(video);
      });

      video.addEventListener("click", function () {
        if (video.paused) {
          attemptPlay(video, true);
          return;
        }

        video.pause();
        enableManualPlayback(video);
      });
    });

    document.addEventListener("WeixinJSBridgeReady", function () {
      playAll(true);
    });

    activationEvents.forEach(function (eventName) {
      window.addEventListener(
        eventName,
        function () {
          if (hasActivated) {
            return;
          }

          hasActivated = true;
          playAll(true);
        },
        { once: true, passive: true }
      );
    });

    function playAll(fromUserGesture) {
      cardVideos.forEach(function (video) {
        attemptPlay(video, fromUserGesture);
      });
    }

    function attemptPlay(video, fromUserGesture) {
      var playResult = video.play();

      if (!playResult || typeof playResult.then !== "function") {
        return;
      }

      playResult
        .then(function () {
          video.removeAttribute("controls");
          video.classList.remove("is-interactive");
        })
        .catch(function () {
          if (fromUserGesture) {
            enableManualPlayback(video);
          }
        });
    }

    function enableManualPlayback(video) {
      video.setAttribute("controls", "controls");
      video.classList.add("is-interactive");
    }
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-soft");

    if (!targets.length) {
      return;
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    targets.forEach(function (node) {
      if (node.classList.contains("is-visible")) {
        return;
      }

      observer.observe(node);
    });
  }
})();
