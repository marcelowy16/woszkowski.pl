const body = document.body;
const menu = document.getElementById("mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = document.querySelector(".menu-toggle-label");
const scrollLinks = document.querySelectorAll("[data-scroll-target]");
const staticForm = document.querySelector("[data-static-form]");
const wordSlideTargets = document.querySelectorAll(".hero-copy h1, .section-head h2, .project-copy h3");
const heroCopyBlocks = document.querySelectorAll(".hero-copy");

let returnFocusTo = null;

const setMenuState = (open) => {
  if (!menu || !menuToggle || !menuToggleLabel) {
    return;
  }

  menu.hidden = !open;
  body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  menuToggleLabel.textContent = open ? menuToggleLabel.dataset.closeLabel : menuToggleLabel.dataset.openLabel;

  if (!open && returnFocusTo) {
    returnFocusTo.focus();
    returnFocusTo = null;
  }
};

menuToggle?.addEventListener("click", () => {
  const willOpen = menu.hidden;
  if (willOpen) {
    returnFocusTo = menuToggle;
  }
  setMenuState(willOpen);
});

menu?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.closeMenu === "true") {
    setMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu && !menu.hidden) {
    setMenuState(false);
  }
});

scrollLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLAnchorElement)) {
      return;
    }

    const selector = trigger.dataset.scrollTarget;
    const target = selector ? document.querySelector(selector) : null;
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (menu && !menu.hidden) {
      setMenuState(false);
    }
  });
});

staticForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

const wordSlideMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const wordSlideStagger = 0.1;
const wordSlideDuration = 0.5;
const heroSequenceStepDelay = 0.15;

const splitWordSlideText = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";

    return text.replace(/[^\s]+/g, (word) => `<span class="word-slide-word"><span>${word}</span></span>`);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node;
  const tagName = element.tagName.toLowerCase();

  if (tagName === "br") {
    return "<br>";
  }

  const attributes = Array.from(element.attributes)
    .map((attribute) => ` ${attribute.name}="${String(attribute.value).replace(/"/g, "&quot;")}"`)
    .join("");

  const children = Array.from(element.childNodes)
    .map((childNode) => splitWordSlideText(childNode))
    .join("");

  return `<${tagName}${attributes}>${children}</${tagName}>`;
};

const prepareWordSlide = (element) => {
  if (element.dataset.wordSlideReady === "true") {
    return;
  }

  const originalHtml = element.dataset.wordSlideOriginal ?? element.innerHTML;
  element.dataset.wordSlideOriginal = originalHtml;
  element.classList.add("word-slide-target");
  element.innerHTML = Array.from(element.childNodes)
    .map((childNode) => splitWordSlideText(childNode))
    .join("");

  const words = element.querySelectorAll(".word-slide-word > span");

  words.forEach((word, index) => {
    word.style.transitionDelay = `${index * wordSlideStagger}s`;
  });

  element.dataset.wordSlideDuration = `${Math.max(words.length - 1, 0) * wordSlideStagger + wordSlideDuration}`;
  element.dataset.wordSlideReady = "true";
};

const revealWordSlide = (element) => {
  element.classList.add("word-slide-visible");
};

const getHeroSequenceItems = (heroCopy) => {
  const items = [];
  const eyebrow = heroCopy.querySelector(".eyebrow");
  const lead = heroCopy.querySelector(".hero-lead");
  const values = heroCopy.querySelector(".hero-values");
  const buttons = heroCopy.querySelectorAll(".hero-actions .button");

  if (eyebrow) {
    items.push(eyebrow);
  }

  if (lead) {
    items.push(lead);
  }

  if (values) {
    items.push(values);
  }

  buttons.forEach((button) => {
    items.push(button);
  });

  return items;
};

const prepareHeroSequence = (heroCopy, headingDuration = 0.4) => {
  if (heroCopy.dataset.heroSequenceReady === "true") {
    return;
  }

  const items = getHeroSequenceItems(heroCopy);
  const sequenceStartDelay = Math.max(0.15, headingDuration - 0.175);

  items.forEach((item, index) => {
    item.classList.add("hero-sequence-item");

    if (index === 0) {
      item.style.transitionDelay = "0.075s";
      return;
    }

    item.style.transitionDelay = `${sequenceStartDelay + (index - 1) * heroSequenceStepDelay}s`;
  });

  heroCopy.dataset.heroSequenceReady = "true";
};

const revealHeroSequence = (heroCopy) => {
  if (!heroCopy || heroCopy.dataset.heroSequenceVisible === "true") {
    return;
  }

  getHeroSequenceItems(heroCopy).forEach((item) => {
    item.classList.add("hero-sequence-visible");
  });

  heroCopy.dataset.heroSequenceVisible = "true";
};

const initWordSlides = () => {
  if (!wordSlideTargets.length) {
    return;
  }

  wordSlideTargets.forEach((element) => {
    prepareWordSlide(element);

    const heroCopy = element.closest(".hero-copy");
    if (heroCopy) {
      prepareHeroSequence(heroCopy, Number.parseFloat(element.dataset.wordSlideDuration ?? `${wordSlideDuration}`));
    }
  });

  if (wordSlideMediaQuery.matches) {
    wordSlideTargets.forEach((element) => {
      revealWordSlide(element);

      const heroCopy = element.closest(".hero-copy");
      if (heroCopy) {
        revealHeroSequence(heroCopy);
      }
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wordSlideTargets.forEach((element) => {
          revealWordSlide(element);

          const heroCopy = element.closest(".hero-copy");
          if (heroCopy) {
            revealHeroSequence(heroCopy);
          }
        });
      });
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealWordSlide(entry.target);

        const heroCopy = entry.target.closest(".hero-copy");
        if (heroCopy) {
          revealHeroSequence(heroCopy);
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  wordSlideTargets.forEach((element) => {
    observer.observe(element);
  });
};

if (wordSlideTargets.length || heroCopyBlocks.length) {
  const initializeWordSlides = () => {
    initWordSlides();
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(initializeWordSlides).catch(initializeWordSlides);
  } else {
    initializeWordSlides();
  }
}
