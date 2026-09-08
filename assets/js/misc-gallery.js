(function () {
  "use strict";

  var deferredImages = Array.prototype.slice.call(
    document.querySelectorAll(".photo-wall img[data-src]")
  );

  if (!deferredImages.length) return;

  function loadImage(image) {
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  }

  if (!("IntersectionObserver" in window)) {
    deferredImages.forEach(loadImage);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      loadImage(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "400px 0px",
  });

  deferredImages.forEach(function (image) {
    observer.observe(image);
  });
}());
