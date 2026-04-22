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

    var isWeChat = /MicroMessenger/i.test(window.navigator.userAgent);

    cardVideos.forEach(function (video) {
      var frame = video.closest(".media-frame");
      var posterButton = frame ? frame.querySelector(".js-video-poster") : null;

      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");

      if (!isWeChat) {
        attemptPlay(video);
      }

      video.addEventListener("loadeddata", function () {
        if (!isWeChat) {
          attemptPlay(video);
        }
      });

      if (posterButton) {
        posterButton.addEventListener("click", function () {
          attemptPlay(video, true);
        });
      }

      video.addEventListener("pause", function () {
        if (!frame || video.ended) {
          return;
        }

        frame.classList.remove("is-playing");
      });
    });

    if (isWeChat) {
      document.addEventListener("WeixinJSBridgeReady", function () {
        cardVideos.forEach(function (video) {
          attemptPlay(video);
        });
      });
    }

    function attemptPlay(video, fromUserGesture) {
      var frame = video.closest(".media-frame");
      var playResult = video.play();

      if (!playResult || typeof playResult.then !== "function") {
        if (frame) {
          frame.classList.add("is-playing");
        }
        return;
      }

      playResult
        .then(function () {
          if (frame) {
            frame.classList.add("is-playing");
          }
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
      var frame = video.closest(".media-frame");
      video.setAttribute("controls", "controls");
      video.classList.add("is-interactive");
      if (frame) {
        frame.classList.add("is-playing");
      }
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
