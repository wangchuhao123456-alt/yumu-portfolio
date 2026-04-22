(function () {
  var overlay = document.querySelector(".intro-overlay");
  var isHomePage = /(?:^|\/)index\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith("/");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("js-ready");

  if (!overlay || !isHomePage) {
    initScrollReveal();
    return;
  }

  if (reduceMotion) {
    overlay.remove();
    initScrollReveal();
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
  }, 2250);

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
