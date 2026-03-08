const body = document.body;
const siteHeader = document.querySelector(".site-header");
const menu = document.getElementById("mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = document.querySelector(".menu-toggle-label");
const scrollLinks = document.querySelectorAll("[data-scroll-target]");
const staticForm = document.querySelector("[data-static-form]");
const staticFormFields = staticForm ? Array.from(staticForm.querySelectorAll("[data-field]")) : [];
const staticFormSubmit = staticForm?.querySelector('button[type="submit"]');
const projectCards = document.querySelectorAll(".project-card");
const projectTitleLinks = document.querySelectorAll(".project-copy h3 a");
const wordSlideTargets = document.querySelectorAll(
  ".hero-copy h1, .section-head h2, .about-kicker, .contact-title, .wip-hero-title, .wip-card-title, .wip-section-title, .wip-process-kicker, .wip-section-kicker, .animation-showcase-title"
);
const heroCopyBlocks = document.querySelectorAll(".hero-copy, .animation-showcase-copy");
const scrollToTopButton = document.querySelector(".scroll-to-top");
const riveCanvases = document.querySelectorAll("canvas[data-rive-src]");
const offsetVideos = document.querySelectorAll("video[data-start-time]");
const subtropicaSurveyCarousels = document.querySelectorAll("[data-subtropica-carousel]");
const wipZoomableImages = document.querySelectorAll(
  ".project-page-wip .wip-hero-media img, .project-page-wip .wip-image-card img, .project-page-wip .wip-image-frame img, .project-page-wip .wip-comments-media img, .project-page-wip .assistant-intro-shot img"
);
const wipZoomableVideos = document.querySelectorAll(".project-page-wip video");
const lightboxTransitionDuration = 380;
const riveCanvasInstances = new WeakMap();

let returnFocusTo = null;
let lastScrollY = Math.max(window.scrollY, 0);
let headerTicking = false;

const headerScrollTolerance = 10;
const headerRevealOffset = 16;
const scrollToTopRevealOffset = 480;
const headerHiddenBodyClass = "site-header-is-hidden";
const cookieConsentStorageKey = "mw-cookie-consent-v1";
const cookieConsentAcceptedValue = "accepted";
const cookieConsentEssentialOnlyValue = "essential-only";
const cookieConsentCloseDelay = 260;
const cookiePolicyModalCloseDelay = 220;
const pageScrollStorageKeyPrefix = "mw-scroll-pos-v1:";
const homeScrollRestoreIntentStorageKey = "mw-home-scroll-restore-intent-v1";
const homeScrollRestoreIntentTtlMs = 20000;
const supportsDocumentPrefetch =
  typeof document !== "undefined" &&
  (() => {
    const prefetchProbe = document.createElement("link");
    return Boolean(prefetchProbe.relList?.supports?.("prefetch"));
  })();
const prefetchedPageUrls = new Set();

const syncHeaderStateClass = () => {
  if (!siteHeader) {
    return;
  }

  body.classList.toggle(headerHiddenBodyClass, siteHeader.classList.contains("site-header-hidden"));
};

const getCookieConsentValue = () => {
  try {
    return window.localStorage.getItem(cookieConsentStorageKey) ?? "";
  } catch (error) {
    return "";
  }
};

const setCookieConsentValue = (value) => {
  try {
    window.localStorage.setItem(cookieConsentStorageKey, value);
  } catch (error) {
    return;
  }
};

const setCookieConsentVisibility = (visible) => {
  body.classList.toggle("cookie-consent-visible", visible);
};

const hasCookieConsentDecision = () => {
  const value = getCookieConsentValue();
  return value === cookieConsentAcceptedValue || value === cookieConsentEssentialOnlyValue;
};

const initCookieConsentBar = () => {
  if (!body) {
    return;
  }

  const cookiePolicyModal = document.createElement("section");
  cookiePolicyModal.className = "cookie-policy-modal";
  cookiePolicyModal.hidden = true;
  cookiePolicyModal.setAttribute("role", "dialog");
  cookiePolicyModal.setAttribute("aria-modal", "true");
  cookiePolicyModal.setAttribute("aria-hidden", "true");
  cookiePolicyModal.setAttribute("aria-labelledby", "cookie-policy-modal-title");
  cookiePolicyModal.innerHTML = `
    <div class="cookie-policy-modal-backdrop" data-cookie-policy-close="true" aria-hidden="true"></div>
    <article class="cookie-policy-modal-panel" role="document">
      <header class="cookie-policy-modal-head">
        <h2 class="cookie-policy-modal-title" id="cookie-policy-modal-title">Polityka plików cookies</h2>
        <button class="cookie-policy-modal-close" type="button" aria-label="Zamknij politykę cookies" data-cookie-policy-close="true">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      </header>
      <div class="cookie-policy-modal-body">
        <section class="cookie-policy-section">
          <h3>Administrator danych</h3>
          <p>
            Administratorem danych związanych z działaniem strony jest Marcel Woszkowski.
            Kontakt: <a href="mailto:marcel.woszkowski@onet.pl">marcel.woszkowski@onet.pl</a>.
          </p>
        </section>
        <section class="cookie-policy-section">
          <h3>Jakie technologie stosuje strona</h3>
          <p>
            Strona wykorzystuje wyłącznie niezbędne technologie, aby poprawnie działać
            i zapamiętać Twoją decyzję dotyczącą cookies. Nie uruchamiam aktywnych cookies analitycznych
            ani marketingowych w tej wersji serwisu.
          </p>
        </section>
        <section class="cookie-policy-section">
          <h3>Wykaz technologii</h3>
          <div class="cookie-policy-table-wrap">
            <table class="cookie-policy-table">
              <thead>
                <tr>
                  <th scope="col">Nazwa</th>
                  <th scope="col">Cel</th>
                  <th scope="col">Typ</th>
                  <th scope="col">Czas życia</th>
                  <th scope="col">Dostawca</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>mw-cookie-consent-v1</code></td>
                  <td>Zapisuje informację, że użytkownik zapoznał się z polityką cookies.</td>
                  <td>Local Storage (first-party)</td>
                  <td>Do momentu usunięcia przez użytkownika</td>
                  <td>woszkowski.pl</td>
                </tr>
                <tr>
                  <td>Rive WebGL script</td>
                  <td>Ładuje bibliotekę animacji dla komponentów interaktywnych.</td>
                  <td>Zasób zewnętrzny (bez cookie first-party)</td>
                  <td>Sesja połączenia HTTP / cache przeglądarki</td>
                  <td>unpkg.com (Cloudflare)</td>
                </tr>
                <tr>
                  <td>Dodatkowe cookies first-party</td>
                  <td>Brak aktywnych cookies analitycznych i marketingowych.</td>
                  <td>Cookie</td>
                  <td>Nie dotyczy</td>
                  <td>woszkowski.pl</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="cookie-policy-note">
            Jeśli w przyszłości dodam nowe narzędzia wymagające dodatkowych cookies,
            zaktualizuję wykaz technologii.
          </p>
        </section>
        <section class="cookie-policy-section">
          <h3>Podstawa prawna</h3>
          <p>
            Niezbędne technologie stosuję na podstawie uzasadnionego interesu administratora
            oraz konieczności technicznej świadczenia usługi elektronicznej.
          </p>
        </section>
        <section class="cookie-policy-section">
          <h3>Odbiorcy i transfery</h3>
          <p>
            Odbiorcami danych technicznych mogą być dostawca hostingu oraz dostawca zasobów zewnętrznych
            (unpkg.com). W zależności od infrastruktury dostawcy może dochodzić do transferu danych poza EOG.
          </p>
        </section>
        <section class="cookie-policy-section">
          <h3>Twoje prawa</h3>
          <p>
            Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz
            wniesienia sprzeciwu. Masz też prawo wniesienia skargi do Prezesa UODO.
          </p>
          <p>
            Zmianę decyzji o cookies możesz wykonać przez usunięcie danych strony w ustawieniach przeglądarki.
          </p>
        </section>
      </div>
    </article>
  `;
  body.appendChild(cookiePolicyModal);

  let cookiePolicyReturnFocus = null;
  let closePolicyTimeout = 0;

  const closeCookiePolicyModal = () => {
    if (cookiePolicyModal.hidden && !cookiePolicyModal.classList.contains("is-open")) {
      return;
    }

    cookiePolicyModal.classList.remove("is-open");
    body.classList.remove("cookie-policy-modal-open");
    cookiePolicyModal.setAttribute("aria-hidden", "true");

    window.clearTimeout(closePolicyTimeout);
    closePolicyTimeout = window.setTimeout(() => {
      closePolicyTimeout = 0;
      cookiePolicyModal.hidden = true;

      if (cookiePolicyReturnFocus instanceof HTMLElement && cookiePolicyReturnFocus.isConnected) {
        cookiePolicyReturnFocus.focus();
      }

      cookiePolicyReturnFocus = null;
    }, cookiePolicyModalCloseDelay);
  };

  const openCookiePolicyModal = (trigger) => {
    if (!cookiePolicyModal.hidden && cookiePolicyModal.classList.contains("is-open")) {
      return;
    }

    window.clearTimeout(closePolicyTimeout);
    closePolicyTimeout = 0;
    cookiePolicyReturnFocus = trigger instanceof HTMLElement ? trigger : null;
    cookiePolicyModal.hidden = false;
    cookiePolicyModal.setAttribute("aria-hidden", "false");
    body.classList.add("cookie-policy-modal-open");

    window.requestAnimationFrame(() => {
      cookiePolicyModal.classList.add("is-open");
      const closeButton = cookiePolicyModal.querySelector(".cookie-policy-modal-close");

      if (closeButton instanceof HTMLButtonElement) {
        closeButton.focus();
      }
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const trigger = target.closest("[data-open-cookie-policy]");
    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    openCookiePolicyModal(trigger);
  });

  cookiePolicyModal.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.cookiePolicyClose === "true") {
      closeCookiePolicyModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cookiePolicyModal.classList.contains("is-open")) {
      event.preventDefault();
      closeCookiePolicyModal();
    }
  });

  if (hasCookieConsentDecision()) {
    return;
  }

  const consentBar = document.createElement("section");
  consentBar.className = "cookie-consent";
  consentBar.setAttribute("role", "dialog");
  consentBar.setAttribute("aria-live", "polite");
  consentBar.setAttribute("aria-label", "Informacja o plikach cookies");
  consentBar.innerHTML = `
    <div class="cookie-consent-copy">
      <p class="cookie-consent-title">Polityka plików cookies</p>
      <p class="cookie-consent-text">
        Ta strona korzysta wyłącznie z niezbędnych technologii (cookies i localStorage),
        aby poprawnie działać i zapamiętać Twoją decyzję o cookies.
      </p>
    </div>
    <div class="cookie-consent-actions">
      <button class="cookie-consent-button cookie-consent-button-policy" type="button" data-open-cookie-policy="true">
        Polityka cookies
      </button>
      <button class="cookie-consent-button cookie-consent-button-acknowledge" type="button" data-cookie-consent-action="acknowledge">
        Rozumiem
      </button>
    </div>
  `;

  body.appendChild(consentBar);
  setCookieConsentVisibility(true);

  window.requestAnimationFrame(() => {
    consentBar.classList.add("is-visible");
  });

  const dismissConsentBar = () => {
    setCookieConsentValue(cookieConsentEssentialOnlyValue);
    setCookieConsentVisibility(false);
    consentBar.classList.remove("is-visible");

    window.setTimeout(() => {
      consentBar.remove();
    }, cookieConsentCloseDelay);
  };

  const acknowledgeButton = consentBar.querySelector('[data-cookie-consent-action="acknowledge"]');
  acknowledgeButton?.addEventListener("click", () => {
    dismissConsentBar();
  });
};

const syncHeaderVisibility = () => {
  if (!siteHeader) {
    return;
  }

  const currentScrollY = Math.max(window.scrollY, 0);
  const scrollDelta = currentScrollY - lastScrollY;
  const nearTop = currentScrollY <= headerRevealOffset;
  const menuOpen = body.classList.contains("menu-open");

  if (nearTop || menuOpen) {
    siteHeader.classList.remove("site-header-hidden");
  } else if (Math.abs(scrollDelta) >= headerScrollTolerance) {
    siteHeader.classList.toggle("site-header-hidden", scrollDelta > 0);
  }

  syncHeaderStateClass();
  lastScrollY = currentScrollY;
  headerTicking = false;
};

const requestHeaderSync = () => {
  if (!siteHeader || headerTicking) {
    return;
  }

  headerTicking = true;
  window.requestAnimationFrame(syncHeaderVisibility);
};

const syncScrollToTopButton = () => {
  if (!(scrollToTopButton instanceof HTMLButtonElement)) {
    return;
  }

  scrollToTopButton.hidden = window.scrollY < scrollToTopRevealOffset;
};

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

  siteHeader?.classList.remove("site-header-hidden");
  syncHeaderStateClass();
  lastScrollY = Math.max(window.scrollY, 0);
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

window.addEventListener("scroll", requestHeaderSync, { passive: true });
window.addEventListener("scroll", syncScrollToTopButton, { passive: true });
window.addEventListener("resize", requestHeaderSync);
syncHeaderVisibility();
syncScrollToTopButton();
initCookieConsentBar();

scrollToTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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

const normalizePathname = (pathname) => {
  const normalizedPathname = pathname.replace(/\/+$/, "");
  return normalizedPathname || "/";
};

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const backToHomeLink = target.closest("a.back-to-home[href]");
  if (!(backToHomeLink instanceof HTMLAnchorElement)) {
    return;
  }

  const linkTarget = (backToHomeLink.getAttribute("target") ?? "_self").trim().toLowerCase();
  if (linkTarget && linkTarget !== "_self") {
    return;
  }

  if (backToHomeLink.hasAttribute("download")) {
    return;
  }

  let nextUrl;
  try {
    nextUrl = new URL(backToHomeLink.href, window.location.href);
  } catch (error) {
    return;
  }

  if (nextUrl.origin !== window.location.origin) {
    return;
  }

  const nextPathname = normalizePathname(nextUrl.pathname);
  if (nextPathname !== "/" || nextUrl.search || nextUrl.hash) {
    return;
  }

  try {
    window.sessionStorage.setItem(homeScrollRestoreIntentStorageKey, String(Date.now()));
  } catch (error) {
    return;
  }
});

const getPrefetchCandidateHref = (link) => {
  if (!(link instanceof HTMLAnchorElement)) {
    return "";
  }

  const linkTarget = (link.getAttribute("target") ?? "_self").trim().toLowerCase();
  if (linkTarget && linkTarget !== "_self") {
    return "";
  }

  if (link.hasAttribute("download") || link.dataset.scrollTarget) {
    return "";
  }

  let nextUrl;
  try {
    nextUrl = new URL(link.href, window.location.href);
  } catch (error) {
    return "";
  }

  if (nextUrl.protocol !== "http:" && nextUrl.protocol !== "https:") {
    return "";
  }

  if (nextUrl.origin !== window.location.origin) {
    return "";
  }

  const currentPathname = normalizePathname(window.location.pathname);
  const nextPathname = normalizePathname(nextUrl.pathname);
  const isSamePathAndSearch = nextPathname === currentPathname && nextUrl.search === window.location.search;

  if (isSamePathAndSearch && nextUrl.hash) {
    return "";
  }

  if (nextUrl.href === window.location.href) {
    return "";
  }

  return nextUrl.href;
};

const queueDocumentPrefetch = (href) => {
  if (!supportsDocumentPrefetch || !href || prefetchedPageUrls.has(href)) {
    return;
  }

  prefetchedPageUrls.add(href);
  const prefetchLink = document.createElement("link");
  prefetchLink.rel = "prefetch";
  prefetchLink.as = "document";
  prefetchLink.href = href;
  document.head.appendChild(prefetchLink);
};

const prefetchFromEventTarget = (target) => {
  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) {
    return;
  }

  const href = getPrefetchCandidateHref(link);
  if (!href) {
    return;
  }

  queueDocumentPrefetch(href);
};

const warmupInternalPagePrefetch = () => {
  if (!supportsDocumentPrefetch) {
    return;
  }

  const seenUrls = new Set();
  const links = document.querySelectorAll("a[href]");
  let remaining = 10;

  for (const link of links) {
    if (!(link instanceof HTMLAnchorElement)) {
      continue;
    }

    const href = getPrefetchCandidateHref(link);
    if (!href || seenUrls.has(href)) {
      continue;
    }

    seenUrls.add(href);
    queueDocumentPrefetch(href);
    remaining -= 1;

    if (remaining <= 0) {
      break;
    }
  }
};

const getCurrentPageScrollStorageKey = () => {
  const normalizedPath = normalizePathname(window.location.pathname);
  return `${pageScrollStorageKeyPrefix}${normalizedPath}${window.location.search}`;
};

const saveCurrentPageScrollPosition = () => {
  try {
    const scrollY = Math.max(window.scrollY, 0);
    window.sessionStorage.setItem(getCurrentPageScrollStorageKey(), String(scrollY));
  } catch (error) {
    return;
  }
};

const consumeHomeScrollRestoreIntent = () => {
  try {
    const timestampRaw = window.sessionStorage.getItem(homeScrollRestoreIntentStorageKey);
    if (timestampRaw === null) {
      return false;
    }

    window.sessionStorage.removeItem(homeScrollRestoreIntentStorageKey);

    const timestamp = Number.parseInt(timestampRaw, 10);
    if (!Number.isFinite(timestamp)) {
      return true;
    }

    return Date.now() - timestamp <= homeScrollRestoreIntentTtlMs;
  } catch (error) {
    return false;
  }
};

const isBackForwardNavigation = () => {
  const navigationEntries = window.performance?.getEntriesByType?.("navigation");
  const latestEntry = Array.isArray(navigationEntries) ? navigationEntries[0] : null;
  return latestEntry?.type === "back_forward";
};

const restoreHomeScrollPositionOnBack = (pageshowEvent) => {
  if (normalizePathname(window.location.pathname) !== "/") {
    return;
  }

  const shouldRestoreFromBackForward = pageshowEvent?.persisted || isBackForwardNavigation();
  const shouldRestoreFromBackToHomeLink = consumeHomeScrollRestoreIntent();

  if (!shouldRestoreFromBackForward && !shouldRestoreFromBackToHomeLink) {
    return;
  }

  let savedScroll = null;

  try {
    savedScroll = window.sessionStorage.getItem(getCurrentPageScrollStorageKey());
  } catch (error) {
    return;
  }

  if (savedScroll === null) {
    return;
  }

  const scrollY = Number.parseFloat(savedScroll);
  if (!Number.isFinite(scrollY) || scrollY < 0) {
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    });
  });
};

window.addEventListener("pageshow", (event) => {
  restoreHomeScrollPositionOnBack(event);
});
window.addEventListener("pagehide", () => {
  saveCurrentPageScrollPosition();
});

if (supportsDocumentPrefetch) {
  document.addEventListener(
    "mouseover",
    (event) => {
      prefetchFromEventTarget(event.target);
    },
    { passive: true }
  );
  document.addEventListener("focusin", (event) => {
    prefetchFromEventTarget(event.target);
  });
  document.addEventListener(
    "pointerdown",
    (event) => {
      prefetchFromEventTarget(event.target);
    },
    { passive: true }
  );
  document.addEventListener(
    "touchstart",
    (event) => {
      prefetchFromEventTarget(event.target);
    },
    { passive: true }
  );

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warmupInternalPagePrefetch, { timeout: 1200 });
  } else {
    window.setTimeout(warmupInternalPagePrefetch, 700);
  }
}

const validators = {
  email: (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    const parts = trimmed.split("@");
    const domain = parts[1] ?? "";

    if (!trimmed.includes("@") || parts.length !== 2 || !parts[0] || !domain.includes(".") || domain.endsWith(".")) {
      return "Wpisz poprawny adres e-mail.";
    }

    return "";
  },
  phone: (value) => {
    const trimmed = value.trim();
    const digits = trimmed.replace(/\D/g, "");

    if (!trimmed) {
      return "";
    }

    if (digits.length < 9) {
      return "Wpisz poprawny numer telefonu.";
    }

    return "";
  },
  name: (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    if (trimmed.length < 2) {
      return "Imię i nazwisko jest zbyt krótkie.";
    }

    return "";
  },
  message: (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    if (trimmed.length < 10) {
      return "Wiadomość powinna mieć co najmniej 10 znaków.";
    }

    return "";
  },
};

const formatPolishPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  const groups = digits.match(/.{1,3}/g);

  return groups ? groups.join(" ") : "";
};

const getFieldElements = (field) => {
  const control = field.querySelector("input, textarea");
  const error = field.querySelector(".field-error");

  return { control, error };
};

const setFieldVisualState = (field, control) => {
  const hasValue = Boolean(control.value.trim());
  field.classList.toggle("is-filled", hasValue);
};

const validateControl = (control) => {
  const validator = validators[control.name];

  if (!validator) {
    return "";
  }

  return validator(control.value);
};

const renderFieldError = (field, control, forceVisible = false) => {
  const { error } = getFieldElements(field);
  const message = validateControl(control);
  const touched = control.dataset.touched === "true";
  const hasValue = Boolean(control.value.trim());
  const shouldShow = Boolean(message) && hasValue && (forceVisible || touched);

  field.classList.toggle("has-error", shouldShow);
  control.setAttribute("aria-invalid", shouldShow ? "true" : "false");

  if (error) {
    error.textContent = shouldShow ? message : "";
  }

  return message;
};

const updateSubmitState = () => {
  if (!staticFormSubmit) {
    return;
  }

  const isValid = staticFormFields.every((field) => {
    const { control } = getFieldElements(field);
    return control && Boolean(control.value.trim()) && !validateControl(control);
  });

  staticFormSubmit.disabled = !isValid;
  staticFormSubmit.setAttribute("aria-disabled", String(!isValid));
};

staticFormFields.forEach((field) => {
  const { control } = getFieldElements(field);

  if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
    return;
  }

  setFieldVisualState(field, control);
  renderFieldError(field, control);

  control.addEventListener("focus", () => {
    field.classList.add("is-active");
  });

  control.addEventListener("blur", () => {
    field.classList.remove("is-active");
    control.dataset.touched = "true";
    setFieldVisualState(field, control);
    renderFieldError(field, control, true);
    updateSubmitState();
  });

  control.addEventListener("input", () => {
    if (control.name === "phone") {
      control.value = formatPolishPhoneNumber(control.value);
    }

    setFieldVisualState(field, control);
    renderFieldError(field, control);
    updateSubmitState();
  });
});

staticForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const invalidControls = [];

  staticFormFields.forEach((field) => {
    const { control } = getFieldElements(field);

    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
      return;
    }

    control.dataset.touched = "true";
    const message = renderFieldError(field, control, true);

    if (!control.value.trim() || message) {
      invalidControls.push(control);
    }
  });

  updateSubmitState();

  if (invalidControls.length > 0) {
    event.preventDefault();
    invalidControls[0].focus();
  }
});

updateSubmitState();

const createProjectMediaLinks = () => {
  projectCards.forEach((card) => {
    const media = card.querySelector(".project-media");
    const image = media?.querySelector("img");
    const projectButton = card.querySelector(".project-copy .button[href]");
    const projectHeading = card.querySelector(".project-copy h3");

    if (!(media instanceof HTMLDivElement) || !(image instanceof HTMLImageElement) || !(projectButton instanceof HTMLAnchorElement)) {
      return;
    }

    if (media.querySelector(".project-media-link")) {
      return;
    }

    const mediaLink = document.createElement("a");
    mediaLink.className = "project-media-link";
    mediaLink.href = projectButton.href;
    mediaLink.target = projectButton.target;
    mediaLink.rel = projectButton.rel;
    mediaLink.setAttribute("aria-label", `Zobacz projekt: ${(projectHeading?.textContent ?? "").trim()}`);

    const mediaFrame = document.createElement("span");
    mediaFrame.className = "project-media-frame";

    const hoverCursor = document.createElement("span");
    hoverCursor.className = "project-hover-cursor";
    hoverCursor.setAttribute("aria-hidden", "true");
    hoverCursor.textContent = "Zobacz projekt";

    mediaFrame.appendChild(image);
    mediaLink.append(mediaFrame, hoverCursor);
    media.appendChild(mediaLink);
  });
};

const initHoverCursorTargets = (selector) => {
  const hoverTargets = document.querySelectorAll(selector);

  hoverTargets.forEach((target) => {
    if (!(target instanceof HTMLElement) || target.dataset.cursorReady === "true") {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame = 0;

    const renderCursorPosition = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      target.style.setProperty("--cursor-x", `${currentX}px`);
      target.style.setProperty("--cursor-y", `${currentY}px`);

      if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        animationFrame = 0;
        return;
      }

      animationFrame = window.requestAnimationFrame(renderCursorPosition);
    };

    const ensureAnimation = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(renderCursorPosition);
    };

    const setCursorPosition = (clientX, clientY) => {
      const bounds = target.getBoundingClientRect();
      targetX = clientX - bounds.left;
      targetY = clientY - bounds.top;

      if (!animationFrame) {
        currentX = targetX;
        currentY = targetY;
        target.style.setProperty("--cursor-x", `${currentX}px`);
        target.style.setProperty("--cursor-y", `${currentY}px`);
      }

      ensureAnimation();
    };

    target.addEventListener("pointerenter", (event) => {
      setCursorPosition(event.clientX, event.clientY);
      target.classList.add("is-hovering");
    });

    target.addEventListener("pointermove", (event) => {
      setCursorPosition(event.clientX, event.clientY);
    });

    target.addEventListener("pointerleave", () => {
      target.classList.remove("is-hovering");

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    target.addEventListener("focus", () => {
      const bounds = target.getBoundingClientRect();
      targetX = bounds.width / 2;
      targetY = bounds.height / 2;
      currentX = targetX;
      currentY = targetY;
      target.style.setProperty("--cursor-x", `${currentX}px`);
      target.style.setProperty("--cursor-y", `${currentY}px`);
      target.classList.add("is-hovering");
    });

    target.addEventListener("blur", () => {
      target.classList.remove("is-hovering");

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    target.dataset.cursorReady = "true";
  });
};

createProjectMediaLinks();

const initWipImageLightbox = () => {
  if (!body.classList.contains("project-page-wip") || !wipZoomableImages.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "wip-lightbox";
  lightbox.hidden = true;
  lightbox.tabIndex = -1;
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Powiększony obraz");

  const backdrop = document.createElement("div");
  backdrop.className = "wip-lightbox-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const figure = document.createElement("figure");
  figure.className = "wip-lightbox-figure";

  const lightboxImage = document.createElement("img");
  lightboxImage.className = "wip-lightbox-image";
  lightboxImage.alt = "";

  const caption = document.createElement("figcaption");
  caption.className = "wip-lightbox-caption";
  caption.hidden = true;

  figure.append(lightboxImage, caption);
  lightbox.append(backdrop, figure);
  body.appendChild(lightbox);

  let activeTrigger = null;
  let activeSourceImage = null;
  let closeLightboxTimeout = 0;
  let animationTimeout = 0;
  let isAnimating = false;

  const clearLightboxStyles = () => {
    lightboxImage.style.left = "";
    lightboxImage.style.top = "";
    lightboxImage.style.width = "";
    lightboxImage.style.height = "";
    lightboxImage.style.transform = "";
  };

  const getTargetRect = (image) => {
    const viewportPadding = window.innerWidth < 768 ? 32 : 72;
    const maxWidth = Math.max(120, window.innerWidth - viewportPadding * 2);
    const maxHeight = Math.max(120, window.innerHeight - viewportPadding * 2);
    const aspectRatio = image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1;

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
      width,
      height,
    };
  };

  const getTransformFromRects = (fromRect, toRect) => {
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const translateX = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const translateY = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  };

  const finishClose = () => {
    isAnimating = false;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.classList.remove("is-open", "is-closing");
    body.classList.remove("image-lightbox-open");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    activeSourceImage?.style.removeProperty("opacity");
    clearLightboxStyles();
    activeTrigger?.focus();
    activeTrigger = null;
    activeSourceImage = null;
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains("is-open") || isAnimating) {
      return;
    }

    isAnimating = true;
    lightbox.classList.add("is-closing");
    lightbox.classList.remove("is-open");

    if (activeSourceImage instanceof HTMLImageElement && activeSourceImage.isConnected) {
      const sourceRect = activeSourceImage.getBoundingClientRect();
      lightboxImage.style.transform = getTransformFromRects(sourceRect, getTargetRect(lightboxImage));
    }

    window.clearTimeout(closeLightboxTimeout);
    closeLightboxTimeout = window.setTimeout(() => {
      closeLightboxTimeout = 0;
      finishClose();
    }, lightboxTransitionDuration);
  };

  const openLightbox = (image, trigger = image) => {
    if (!(image instanceof HTMLImageElement) || !image.currentSrc || isAnimating) {
      return;
    }

    window.clearTimeout(closeLightboxTimeout);
    window.clearTimeout(animationTimeout);
    closeLightboxTimeout = 0;
    animationTimeout = 0;
    activeSourceImage?.style.removeProperty("opacity");
    activeTrigger = trigger instanceof HTMLElement ? trigger : image;
    activeSourceImage = image;
    activeSourceImage.style.opacity = "0";
    isAnimating = true;
    lightbox.hidden = false;
    lightbox.classList.remove("is-closing");
    lightboxImage.src = image.currentSrc;
    lightboxImage.alt = image.alt;
    caption.hidden = true;

    const sourceRect = image.getBoundingClientRect();

    const animateIn = () => {
      const targetRect = getTargetRect(lightboxImage);
      lightboxImage.style.left = `${targetRect.left}px`;
      lightboxImage.style.top = `${targetRect.top}px`;
      lightboxImage.style.width = `${targetRect.width}px`;
      lightboxImage.style.height = `${targetRect.height}px`;
      lightboxImage.style.transform = getTransformFromRects(sourceRect, targetRect);

      lightbox.setAttribute("aria-hidden", "false");
      body.classList.add("image-lightbox-open");

      window.requestAnimationFrame(() => {
        lightbox.classList.add("is-open");
        lightbox.focus();
        lightboxImage.style.transform = "translate(0, 0) scale(1)";
        animationTimeout = window.setTimeout(() => {
          animationTimeout = 0;
          isAnimating = false;
        }, lightboxTransitionDuration);
      });
    };

    if (lightboxImage.complete) {
      animateIn();
    } else {
      lightboxImage.addEventListener("load", animateIn, { once: true });
    }
  };

  lightbox.addEventListener("click", () => {
    closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  window.addEventListener(
    "wheel",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  wipZoomableImages.forEach((image) => {
    if (!(image instanceof HTMLImageElement)) {
      return;
    }

    if (image.closest("[data-disable-image-zoom='true']")) {
      return;
    }

    const trigger = image.parentElement;
    if (!(trigger instanceof HTMLElement) || trigger.dataset.zoomReady === "true") {
      return;
    }

    trigger.classList.add("wip-zoom-target");
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-label", `${image.alt.trim() || "Obraz"} - kliknij, aby powiększyć`);

    const hoverCursor = document.createElement("span");
    hoverCursor.className = "project-hover-cursor";
    hoverCursor.setAttribute("aria-hidden", "true");
    hoverCursor.textContent = "Powiększ";
    trigger.appendChild(hoverCursor);

    trigger.addEventListener("click", () => {
      openLightbox(image, trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openLightbox(image, trigger);
    });

    trigger.dataset.zoomReady = "true";
  });
};

initWipImageLightbox();
const initWipVideoLightbox = () => {
  if (!body.classList.contains("project-page-wip") || !wipZoomableVideos.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "wip-video-lightbox";
  lightbox.hidden = true;
  lightbox.tabIndex = -1;
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Powiększone wideo");

  const backdrop = document.createElement("div");
  backdrop.className = "wip-video-lightbox-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const figure = document.createElement("figure");
  figure.className = "wip-video-lightbox-figure";

  const lightboxFrame = document.createElement("div");
  lightboxFrame.className = "wip-video-lightbox-frame";

  const lightboxVideo = document.createElement("video");
  lightboxVideo.className = "wip-video-lightbox-video";
  lightboxVideo.autoplay = true;
  lightboxVideo.loop = true;
  lightboxVideo.muted = true;
  lightboxVideo.playsInline = true;
  lightboxVideo.preload = "auto";

  lightboxFrame.appendChild(lightboxVideo);
  figure.appendChild(lightboxFrame);
  lightbox.append(backdrop, figure);
  body.appendChild(lightbox);

  let activeTrigger = null;
  let activeSourceVideo = null;
  let activeVideoCropScale = 1;
  let closeLightboxTimeout = 0;
  let animationTimeout = 0;
  let isAnimating = false;

  const clearLightboxStyles = () => {
    lightboxFrame.style.left = "";
    lightboxFrame.style.top = "";
    lightboxFrame.style.width = "";
    lightboxFrame.style.height = "";
    lightboxFrame.style.transform = "";
  };

  const getTargetRect = (videoWidth, videoHeight) => {
    const viewportPadding = window.innerWidth < 768 ? 24 : 72;
    const maxWidth = Math.max(160, window.innerWidth - viewportPadding * 2);
    const maxHeight = Math.max(160, window.innerHeight - viewportPadding * 2);
    const safeVideoWidth = videoWidth || 16;
    const safeVideoHeight = videoHeight || 9;
    const aspectRatio = safeVideoWidth / safeVideoHeight;

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
      width,
      height,
    };
  };

  const getTransformFromRects = (fromRect, toRect) => {
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const translateX = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const translateY = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  };

  const finishClose = () => {
    isAnimating = false;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.classList.remove("is-open", "is-closing");
    body.classList.remove("image-lightbox-open");
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    clearLightboxStyles();
    lightboxFrame.style.removeProperty("--video-crop-scale");
    activeTrigger?.focus();
    activeTrigger = null;
    activeSourceVideo = null;
    activeVideoCropScale = 1;
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains("is-open") || isAnimating) {
      return;
    }

    isAnimating = true;
    lightbox.classList.add("is-closing");
    lightbox.classList.remove("is-open");

    if (activeSourceVideo instanceof HTMLVideoElement && activeSourceVideo.isConnected) {
      const sourceRect = activeSourceVideo.getBoundingClientRect();
      lightboxFrame.style.transform = getTransformFromRects(
        sourceRect,
        getTargetRect(lightboxVideo.videoWidth, lightboxVideo.videoHeight)
      );
    }

    window.clearTimeout(closeLightboxTimeout);
    closeLightboxTimeout = window.setTimeout(() => {
      closeLightboxTimeout = 0;
      finishClose();
    }, lightboxTransitionDuration);
  };

  const openLightbox = (video, trigger = video) => {
    if (!(video instanceof HTMLVideoElement) || isAnimating) {
      return;
    }

    const source = video.currentSrc || video.src || video.querySelector("source")?.src;
    if (!source) {
      return;
    }

    window.clearTimeout(closeLightboxTimeout);
    window.clearTimeout(animationTimeout);
    closeLightboxTimeout = 0;
    animationTimeout = 0;
    activeTrigger = trigger instanceof HTMLElement ? trigger : video;
    activeSourceVideo = video;
    const requestedCropScale = Number.parseFloat(video.dataset.lightboxScale ?? "1");
    activeVideoCropScale =
      Number.isFinite(requestedCropScale) && requestedCropScale > 1 ? requestedCropScale : 1;
    isAnimating = true;
    lightbox.hidden = false;
    lightbox.classList.remove("is-closing");
    lightboxFrame.style.setProperty("--video-crop-scale", String(activeVideoCropScale));
    lightboxVideo.src = source;
    lightboxVideo.currentTime = video.currentTime || 0;

    const sourceRect = video.getBoundingClientRect();

    const animateIn = () => {
      const targetRect = getTargetRect(lightboxVideo.videoWidth, lightboxVideo.videoHeight);
      lightboxFrame.style.left = `${targetRect.left}px`;
      lightboxFrame.style.top = `${targetRect.top}px`;
      lightboxFrame.style.width = `${targetRect.width}px`;
      lightboxFrame.style.height = `${targetRect.height}px`;
      lightboxFrame.style.transform = getTransformFromRects(sourceRect, targetRect);

      lightbox.setAttribute("aria-hidden", "false");
      body.classList.add("image-lightbox-open");

      window.requestAnimationFrame(() => {
        lightbox.classList.add("is-open");
        lightbox.focus();
        lightboxFrame.style.transform = "translate(0, 0) scale(1)";
        void lightboxVideo.play().catch(() => {});
        animationTimeout = window.setTimeout(() => {
          animationTimeout = 0;
          isAnimating = false;
        }, lightboxTransitionDuration);
      });
    };

    if (lightboxVideo.readyState >= 1) {
      animateIn();
    } else {
      lightboxVideo.addEventListener("loadedmetadata", animateIn, { once: true });
    }
  };

  lightbox.addEventListener("click", () => {
    closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  window.addEventListener(
    "wheel",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  wipZoomableVideos.forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    const trigger = video.parentElement;
    if (!(trigger instanceof HTMLElement) || trigger.dataset.videoZoomReady === "true") {
      return;
    }

    trigger.classList.add("wip-video-zoom-target");
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-label", "Wideo - kliknij, aby powiekszyc");

    const hoverCursor = document.createElement("span");
    hoverCursor.className = "project-hover-cursor";
    hoverCursor.setAttribute("aria-hidden", "true");
    hoverCursor.textContent = "Powiększ";
    trigger.appendChild(hoverCursor);

    trigger.addEventListener("click", () => {
      openLightbox(video, trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openLightbox(video, trigger);
    });

    trigger.dataset.videoZoomReady = "true";
  });
};

initWipVideoLightbox();
initHoverCursorTargets(".project-media-link, .project-page-wip .wip-zoom-target, .project-page-wip .wip-video-zoom-target, .rive-zoom-target");

const splitProjectTitleLines = (link) => {
  if (!(link instanceof HTMLAnchorElement)) {
    return;
  }

  const originalText = (link.dataset.originalText ?? link.textContent ?? "").trim().replace(/\s+/g, " ");

  if (!originalText) {
    return;
  }

  link.dataset.originalText = originalText;
  link.textContent = "";

  const words = originalText.split(" ");
  const fragments = [];

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "project-title-word";
    span.textContent = index === 0 ? word : ` ${word}`;
    link.appendChild(span);
    fragments.push(span);
  });

  const lines = [];
  let currentLine = [];
  let currentTop = null;

  fragments.forEach((fragment) => {
    const top = Math.round(fragment.offsetTop);

    if (currentTop === null || top === currentTop) {
      currentLine.push(fragment);
      currentTop = top;
      return;
    }

    lines.push(currentLine);
    currentLine = [fragment];
    currentTop = top;
  });

  if (currentLine.length) {
    lines.push(currentLine);
  }

  link.textContent = "";

  lines.forEach((lineWords, index) => {
    const line = document.createElement("span");
    line.className = "project-title-line";
    line.style.setProperty("--line-index", `${index}`);

    lineWords.forEach((word) => {
      line.appendChild(document.createTextNode(word.textContent ?? ""));
    });

    link.appendChild(line);

    if (index < lines.length - 1) {
      link.appendChild(document.createElement("br"));
    }
  });
};

const rebuildProjectTitleLines = () => {
  projectTitleLinks.forEach((link) => {
    splitProjectTitleLines(link);
  });
};

rebuildProjectTitleLines();
window.addEventListener("resize", rebuildProjectTitleLines);

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

const getAnimatedCopyBlock = (element) => element?.closest(".hero-copy, .animation-showcase-copy") ?? null;

const getHeroSequenceItems = (heroCopy) => {
  const items = [];
  const eyebrow = heroCopy.querySelector(".eyebrow");
  const showcaseKicker = heroCopy.querySelector(".animation-showcase-kicker");
  const lead = heroCopy.querySelector(".hero-lead");
  const values = heroCopy.querySelector(".hero-values");
  const buttons = heroCopy.querySelectorAll(".hero-actions .button");

  if (eyebrow) {
    items.push(eyebrow);
  }

  if (showcaseKicker) {
    items.push(showcaseKicker);
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

    const heroCopy = getAnimatedCopyBlock(element);
    if (heroCopy) {
      prepareHeroSequence(heroCopy, Number.parseFloat(element.dataset.wordSlideDuration ?? `${wordSlideDuration}`));
    }
  });

  if (wordSlideMediaQuery.matches) {
    wordSlideTargets.forEach((element) => {
      revealWordSlide(element);

      const heroCopy = getAnimatedCopyBlock(element);
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

          const heroCopy = getAnimatedCopyBlock(element);
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

        const heroCopy = getAnimatedCopyBlock(entry.target);
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

const initRiveCanvases = () => {
  if (!riveCanvases.length || !window.rive || typeof window.rive.Rive !== "function") {
    return;
  }

  riveCanvases.forEach((canvas) => {
    if (!(canvas instanceof HTMLCanvasElement) || canvas.dataset.riveInitialized === "true") {
      return;
    }

    const { riveSrc, riveArtboard, riveAutoplay } = canvas.dataset;
    if (!riveSrc) {
      return;
    }

    canvas.dataset.riveInitialized = "true";

    let riveInstance;
    const markReady = () => {
      canvas.dataset.riveReady = "true";
      riveInstance?.resizeDrawingSurfaceToCanvas?.();
    };

    const options = {
      src: riveSrc,
      canvas,
      autoplay: riveAutoplay !== "false",
      onLoad: markReady,
    };

    if (riveArtboard) {
      options.artboard = riveArtboard;
    }

    riveInstance = new window.rive.Rive(options);
    riveCanvasInstances.set(canvas, riveInstance);
  });
};

initRiveCanvases();

const resizeRiveCanvas = (canvas) => {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  riveCanvasInstances.get(canvas)?.resizeDrawingSurfaceToCanvas?.();
};

const initRiveCanvasLightbox = () => {
  if (!riveCanvases.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "rive-lightbox";
  lightbox.hidden = true;
  lightbox.tabIndex = -1;
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Powiększona animacja");

  const backdrop = document.createElement("div");
  backdrop.className = "rive-lightbox-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  const figure = document.createElement("figure");
  figure.className = "rive-lightbox-figure";

  lightbox.append(backdrop, figure);
  body.appendChild(lightbox);

  let activeTrigger = null;
  let activeCanvas = null;
  let activePlaceholder = null;
  let activeCanvasInlineStyle = null;
  let closeLightboxTimeout = 0;
  let animationTimeout = 0;
  let isAnimating = false;

  const getTargetRect = (canvas) => {
    const viewportPadding = window.innerWidth < 768 ? 24 : 72;
    const maxWidth = Math.max(160, window.innerWidth - viewportPadding * 2);
    const maxHeight = Math.max(160, window.innerHeight - viewportPadding * 2);
    const intrinsicWidth = Number.parseFloat(canvas.getAttribute("width") ?? "") || canvas.clientWidth || 1;
    const intrinsicHeight = Number.parseFloat(canvas.getAttribute("height") ?? "") || canvas.clientHeight || 1;
    const aspectRatio = intrinsicWidth > 0 && intrinsicHeight > 0 ? intrinsicWidth / intrinsicHeight : 1;

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
      width,
      height,
    };
  };

  const getTransformFromRects = (fromRect, toRect) => {
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const translateX = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    const translateY = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  };

  const clearActiveCanvasStyles = () => {
    if (!(activeCanvas instanceof HTMLCanvasElement)) {
      return;
    }

    if (activeCanvasInlineStyle === null) {
      activeCanvas.removeAttribute("style");
    } else {
      activeCanvas.setAttribute("style", activeCanvasInlineStyle);
    }
  };

  const syncActiveCanvasBounds = () => {
    if (!(activeCanvas instanceof HTMLCanvasElement)) {
      return;
    }

    const targetRect = getTargetRect(activeCanvas);
    activeCanvas.style.left = `${targetRect.left}px`;
    activeCanvas.style.top = `${targetRect.top}px`;
    activeCanvas.style.width = `${targetRect.width}px`;
    activeCanvas.style.height = `${targetRect.height}px`;
    resizeRiveCanvas(activeCanvas);
  };

  const restoreCanvas = () => {
    if (!(activeCanvas instanceof HTMLCanvasElement)) {
      return;
    }

    if (activePlaceholder instanceof HTMLElement && activePlaceholder.isConnected) {
      activePlaceholder.replaceWith(activeCanvas);
    }

    activeCanvas.classList.remove("rive-lightbox-active-canvas");
    clearActiveCanvasStyles();
    resizeRiveCanvas(activeCanvas);
  };

  const finishClose = () => {
    window.clearTimeout(animationTimeout);
    animationTimeout = 0;
    isAnimating = false;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.classList.remove("is-open", "is-closing");
    body.classList.remove("image-lightbox-open");
    restoreCanvas();
    activeTrigger?.focus();
    activeTrigger = null;
    activeCanvas = null;
    activePlaceholder = null;
    activeCanvasInlineStyle = null;
  };

  const closeLightbox = () => {
    if (!(activeCanvas instanceof HTMLCanvasElement) || isAnimating) {
      return;
    }

    const sourceRect =
      activePlaceholder instanceof HTMLElement && activePlaceholder.isConnected
        ? activePlaceholder.getBoundingClientRect()
        : activeCanvas.getBoundingClientRect();

    isAnimating = true;
    lightbox.classList.add("is-closing");
    lightbox.classList.remove("is-open");
    activeCanvas.style.transform = getTransformFromRects(sourceRect, getTargetRect(activeCanvas));

    window.clearTimeout(closeLightboxTimeout);
    closeLightboxTimeout = window.setTimeout(() => {
      closeLightboxTimeout = 0;
      finishClose();
    }, lightboxTransitionDuration);
  };

  const openLightbox = (canvas, trigger = canvas.parentElement) => {
    if (!(canvas instanceof HTMLCanvasElement) || isAnimating || lightbox.classList.contains("is-open")) {
      return;
    }

    const sourceRect = canvas.getBoundingClientRect();
    if (!sourceRect.width || !sourceRect.height) {
      return;
    }

    window.clearTimeout(closeLightboxTimeout);
    window.clearTimeout(animationTimeout);
    closeLightboxTimeout = 0;
    animationTimeout = 0;
    activeTrigger = trigger instanceof HTMLElement ? trigger : canvas;
    activeCanvas = canvas;
    activeCanvasInlineStyle = canvas.getAttribute("style");
    activePlaceholder = document.createElement("span");
    activePlaceholder.className = "rive-lightbox-placeholder";
    activePlaceholder.style.width = `${sourceRect.width}px`;
    activePlaceholder.style.height = `${sourceRect.height}px`;
    canvas.insertAdjacentElement("afterend", activePlaceholder);
    figure.appendChild(canvas);
    canvas.classList.add("rive-lightbox-active-canvas");
    isAnimating = true;
    lightbox.hidden = false;
    lightbox.classList.remove("is-closing");
    lightbox.setAttribute("aria-label", `Powiększona animacja: ${(canvas.getAttribute("aria-label") ?? "Animacja").trim()}`);
    body.classList.add("image-lightbox-open");
    lightbox.setAttribute("aria-hidden", "false");

    const targetRect = getTargetRect(canvas);
    canvas.style.left = `${targetRect.left}px`;
    canvas.style.top = `${targetRect.top}px`;
    canvas.style.width = `${targetRect.width}px`;
    canvas.style.height = `${targetRect.height}px`;
    canvas.style.transform = getTransformFromRects(sourceRect, targetRect);

    window.requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      lightbox.focus();
      canvas.style.transform = "translate(0, 0) scale(1)";
      resizeRiveCanvas(canvas);
      animationTimeout = window.setTimeout(() => {
        animationTimeout = 0;
        isAnimating = false;
      }, lightboxTransitionDuration);
    });
  };

  lightbox.addEventListener("click", () => {
    closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  window.addEventListener(
    "wheel",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      if (lightbox.classList.contains("is-open") && !isAnimating) {
        closeLightbox();
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    if (lightbox.classList.contains("is-open")) {
      syncActiveCanvasBounds();
    }
  });

  riveCanvases.forEach((canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    if (canvas.closest("[data-disable-rive-zoom='true']")) {
      return;
    }

    const trigger = canvas.parentElement;
    if (!(trigger instanceof HTMLElement) || trigger.dataset.riveZoomReady === "true") {
      return;
    }

    trigger.classList.add("rive-zoom-target");
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-label", `${(canvas.getAttribute("aria-label") ?? "Animacja").trim()} - kliknij, aby powiekszyc`);

    const hoverCursor = document.createElement("span");
    hoverCursor.className = "project-hover-cursor";
    hoverCursor.setAttribute("aria-hidden", "true");
    hoverCursor.textContent = "Powiększ";
    trigger.appendChild(hoverCursor);

    trigger.addEventListener("click", () => {
      openLightbox(canvas, trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openLightbox(canvas, trigger);
    });

    trigger.dataset.riveZoomReady = "true";
  });
};

initRiveCanvasLightbox();
initHoverCursorTargets(".rive-zoom-target");

const initSubtropicaSurveyCarousels = () => {
  subtropicaSurveyCarousels.forEach((carousel, carouselIndex) => {
    if (!(carousel instanceof HTMLElement) || carousel.dataset.carouselReady === "true") {
      return;
    }

    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]")).filter(
      (slide) => slide instanceof HTMLElement
    );
    const track = carousel.querySelector("[data-carousel-track]");
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const pagination = carousel.querySelector("[data-carousel-pagination]");

    if (
      !(track instanceof HTMLElement) ||
      !(prevButton instanceof HTMLButtonElement) ||
      !(nextButton instanceof HTMLButtonElement) ||
      !(pagination instanceof HTMLElement) ||
      slides.length === 0
    ) {
      return;
    }

    let activeIndex = 0;
    const trackId = `subtropica-survey-track-${carouselIndex + 1}`;
    track.id = trackId;

    const dots = slides.map((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "subtropica-survey-dot";
      dot.setAttribute("aria-label", `Przejdz do slajdu ${index + 1}`);
      dot.setAttribute("aria-controls", trackId);
      dot.addEventListener("click", () => {
        setActiveSlide(index);
      });
      pagination.appendChild(dot);
      return dot;
    });

    const setActiveSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.hidden = !isActive;
        slide.style.display = isActive ? "block" : "none";
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    prevButton.addEventListener("click", () => {
      setActiveSlide(activeIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      setActiveSlide(activeIndex + 1);
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveSlide(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveSlide(activeIndex + 1);
      }
    });

    setActiveSlide(0);
    carousel.dataset.carouselReady = "true";
  });
};

initSubtropicaSurveyCarousels();

const initOffsetVideos = () => {
  offsetVideos.forEach((video) => {
    if (!(video instanceof HTMLVideoElement) || video.dataset.offsetInitialized === "true") {
      return;
    }

    const startTime = Number.parseFloat(video.dataset.startTime ?? "");

    if (!Number.isFinite(startTime)) {
      return;
    }

    const syncStartTime = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const targetTime =
        startTime > 0 && startTime <= 1 ? duration * startTime : startTime;

      video.currentTime = Math.min(Math.max(targetTime, 0.01), Math.max(duration - 0.05, 0.01));
      void video.play().catch(() => {});
    };

    if (Number.isFinite(video.duration) && video.duration > 0) {
      syncStartTime();
    } else {
      video.addEventListener("loadedmetadata", syncStartTime, { once: true });
    }

    video.dataset.offsetInitialized = "true";
  });
};

initOffsetVideos();
