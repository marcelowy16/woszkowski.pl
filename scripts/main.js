const body = document.body;
const menu = document.getElementById("mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = document.querySelector(".menu-toggle-label");
const scrollLinks = document.querySelectorAll("[data-scroll-target]");
const staticForm = document.querySelector("[data-static-form]");

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
