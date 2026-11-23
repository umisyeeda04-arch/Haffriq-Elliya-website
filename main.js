const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const backToTop = document.querySelector(".back-to-top");
const yearElement = document.querySelector("#year");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  });
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  });
}
// Show the loading screen briefly while the page opens.
const pageLoader = document.querySelector("#page-loader");

if (pageLoader) {
  pageLoader.hidden = false;

  let loaderDismissed = false;

  const dismissLoader = () => {
    if (loaderDismissed) return;
    loaderDismissed = true;

    const elapsed = performance.now();
    const minimumDisplayTime = 450;
    const remainingTime = Math.max(0, minimumDisplayTime - elapsed);

    window.setTimeout(() => {
      pageLoader.classList.add("is-leaving");

      window.setTimeout(() => {
        pageLoader.hidden = true;
        pageLoader.classList.remove("is-leaving");
      }, 350);
    }, remainingTime);
  };

  window.addEventListener("load", dismissLoader, { once: true });

  // Prevent the loading screen from remaining visible if a resource is slow.
  window.setTimeout(dismissLoader, 4000);

  // Handle returning to a page from the browser's back/forward cache.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      pageLoader.hidden = true;
      pageLoader.classList.remove("is-leaving");
    }
  });
}
(() => {
  const gallery = document.querySelector(".idol-portrait");
  if (!gallery) return;

  const portraits = Array.from(
    gallery.querySelectorAll(".idol-portrait-image")
  );
  const counter = gallery.querySelector(".idol-portrait-count");

  if (portraits.length < 2) return;

  let currentIndex = 0;

  window.setInterval(() => {
    portraits[currentIndex].classList.remove("is-active");

    currentIndex = (currentIndex + 1) % portraits.length;
    portraits[currentIndex].classList.add("is-active");

    if (counter) {
      const current = String(currentIndex + 1).padStart(2, "0");
      const total = String(portraits.length).padStart(2, "0");
      counter.textContent = `${current} / ${total}`;
    }
  }, 3000);
})();
(() => {
  const button = document.querySelector("#music-toggle");
  const audio = document.querySelector("#site-music");

  if (!button || !audio) return;

  const icon = button.querySelector("span");

  function updateButton(isPlaying) {
    button.setAttribute("aria-pressed", String(isPlaying));
    button.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");

    if (icon) {
      icon.textContent = isPlaying ? "Ⅱ" : "▶";
    }
  }

  button.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        updateButton(true);
      } catch {
        updateButton(false);
        button.setAttribute("aria-label", "Music could not be played");
      }
    } else {
      audio.pause();
      updateButton(false);
    }
  });

  audio.addEventListener("pause", () => updateButton(false));
  audio.addEventListener("play", () => updateButton(true));
})();