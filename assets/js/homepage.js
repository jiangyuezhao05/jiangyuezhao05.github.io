(function () {
  "use strict";

  function initializeExternalLinks() {
    Array.prototype.slice.call(document.querySelectorAll("a[href]"))
      .forEach(function (link) {
        var url;

        try {
          url = new URL(link.href, window.location.href);
        } catch (error) {
          return;
        }

        if ((url.protocol === "http:" || url.protocol === "https:") &&
            url.origin !== window.location.origin) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });
  }

  function initializeSectionNavigation() {
    var sectionIds = ["home", "research", "publications", "experience", "teaching"];
    var sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (!sections.length) return;

    var navLinks = Array.prototype.slice.call(document.querySelectorAll("#site-nav a[href]"))
      .filter(function (link) {
        return !link.closest(".masthead__menu-item--lg") &&
          link.getAttribute("href").charAt(0) === "#";
      });
    var linksBySection = {};
    var pendingSection = null;
    var pendingUntil = 0;

    navLinks.forEach(function (link) {
      if (!link.hasAttribute("href")) return;

      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      var sectionId = url.hash ? url.hash.slice(1) : "home";
      if (sectionIds.indexOf(sectionId) !== -1) linksBySection[sectionId] = link;

      link.addEventListener("click", function (event) {
        var target = document.getElementById(sectionId);
        var isSamePageAnchor = url.pathname === window.location.pathname && target;

        if (isSamePageAnchor) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start"
          });
          window.history.pushState(null, "", "#" + sectionId);
          pendingSection = sectionId;
          pendingUntil = Date.now() + 2000;
          setActiveSection(sectionId);
        }

        var hiddenLinks = document.querySelector("#site-nav .hidden-links");
        var menuButton = document.querySelector("#site-nav > button");

        if (hiddenLinks && hiddenLinks.contains(link)) {
          hiddenLinks.classList.add("hidden");
          if (menuButton) menuButton.classList.remove("close");
        }
      });
    });

    function setActiveSection(sectionId) {
      navLinks.forEach(function (link) {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });

      var activeLink = linksBySection[sectionId];
      if (activeLink) {
        activeLink.classList.add("is-active");
        activeLink.setAttribute("aria-current", "location");
      }
    }

    var ticking = false;
    function updateActiveSection() {
      if (pendingSection && Date.now() < pendingUntil) {
        setActiveSection(pendingSection);
        ticking = false;
        return;
      }

      pendingSection = null;
      var masthead = document.querySelector(".masthead");
      var threshold = (masthead ? masthead.offsetHeight : 0) + 24;
      var active = sections[0].id;

      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= threshold) active = section.id;
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        active = sections[sections.length - 1].id;
      }

      setActiveSection(active);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("load", updateActiveSection);
    window.addEventListener("pageshow", function () {
      var hashSection = window.location.hash.slice(1);
      var target = document.getElementById(hashSection);

      if (sectionIds.indexOf(hashSection) !== -1 && target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        pendingSection = hashSection;
        pendingUntil = Date.now() + 300;
        setActiveSection(hashSection);
        window.requestAnimationFrame(updateActiveSection);
      }
    });
    window.addEventListener("hashchange", function () {
      var hashSection = window.location.hash.slice(1);
      if (sectionIds.indexOf(hashSection) !== -1) {
        pendingSection = hashSection;
        pendingUntil = Date.now() + 800;
        setActiveSection(hashSection);
      }
      window.requestAnimationFrame(updateActiveSection);
    });

    var initialSection = window.location.hash.slice(1);
    if (sectionIds.indexOf(initialSection) !== -1) {
      pendingSection = initialSection;
      pendingUntil = Date.now() + 800;
      var initialTarget = document.getElementById(initialSection);
      if (initialTarget) initialTarget.scrollIntoView({ behavior: "auto", block: "start" });
    }
    updateActiveSection();
  }

  function initializeHomepage() {
    initializeExternalLinks();
    initializeSectionNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeHomepage);
  } else {
    initializeHomepage();
  }
}());
