(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var masthead = document.querySelector(".masthead");
  var menuButton = nav && nav.firstElementChild && nav.firstElementChild.tagName === "BUTTON"
    ? nav.firstElementChild
    : null;
  var visibleLinks = nav ? nav.querySelector(".visible-links") : null;
  var hiddenLinks = nav ? nav.querySelector(".hidden-links") : null;
  var breakpoints = [];

  function isVisible(element) {
    return Boolean(element && element.getClientRects().length);
  }

  function updateNavigation() {
    if (!nav || !menuButton || !visibleLinks || !hiddenLinks) return;

    var availableWidth = menuButton.classList.contains("hidden")
      ? nav.clientWidth
      : nav.clientWidth - menuButton.offsetWidth - 30;

    while (visibleLinks.scrollWidth > availableWidth) {
      var movableLinks = visibleLinks.querySelectorAll("li:not(.persist)");
      var lastMovableLink = movableLinks[movableLinks.length - 1];
      if (!lastMovableLink) break;

      breakpoints.push(visibleLinks.scrollWidth);
      hiddenLinks.insertBefore(lastMovableLink, hiddenLinks.firstChild);
      menuButton.classList.remove("hidden");
      availableWidth = nav.clientWidth - menuButton.offsetWidth - 30;
    }

    while (breakpoints.length && availableWidth > breakpoints[breakpoints.length - 1]) {
      var nextLink = hiddenLinks.firstElementChild;
      if (!nextLink) break;

      var persistentTail = visibleLinks.querySelector(".persist.tail");
      visibleLinks.insertBefore(nextLink, persistentTail || null);
      breakpoints.pop();
    }

    if (!breakpoints.length) {
      menuButton.classList.add("hidden");
      menuButton.classList.remove("close");
      menuButton.setAttribute("aria-expanded", "false");
      hiddenLinks.classList.add("hidden");
    }

    menuButton.setAttribute("count", String(breakpoints.length));

    if (masthead) {
      document.body.style.paddingTop = masthead.offsetHeight + "px";
    }

    var authorMenuButton = document.querySelector(".author__urls-wrapper button");
    var sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.style.paddingTop = isVisible(authorMenuButton)
        ? ""
        : (masthead ? masthead.offsetHeight + "px" : "");
    }
  }

  function updateFooterSpacing() {
    var footer = document.querySelector(".page__footer");
    if (!footer || document.body.classList.contains("academic-home-page")) return;
    document.body.style.marginBottom = footer.offsetHeight + "px";
  }

  if (menuButton && hiddenLinks) {
    menuButton.addEventListener("click", function () {
      hiddenLinks.classList.toggle("hidden");
      menuButton.classList.toggle("close");
      menuButton.setAttribute(
        "aria-expanded",
        String(!hiddenLinks.classList.contains("hidden"))
      );
    });
  }

  var authorMenuButton = document.querySelector(".author__urls-wrapper button");
  var authorMenu = document.querySelector(".author__urls");
  if (authorMenuButton && authorMenu) {
    authorMenuButton.addEventListener("click", function () {
      var shouldOpen = window.getComputedStyle(authorMenu).display === "none";
      authorMenu.style.display = shouldOpen ? "block" : "none";
      authorMenuButton.classList.toggle("open", shouldOpen);
      authorMenuButton.setAttribute("aria-expanded", String(shouldOpen));
    });
  }

  function handleResize() {
    updateNavigation();
    updateFooterSpacing();

    if (window.innerWidth >= 925 && authorMenu) {
      authorMenu.style.removeProperty("display");
      if (authorMenuButton) {
        authorMenuButton.classList.remove("open");
        authorMenuButton.setAttribute("aria-expanded", "false");
      }
    }
  }

  window.addEventListener("resize", handleResize, { passive: true });
  if (screen.orientation && screen.orientation.addEventListener) {
    screen.orientation.addEventListener("change", handleResize);
  }
  window.addEventListener("load", updateFooterSpacing);

  updateNavigation();
  updateFooterSpacing();
}());
