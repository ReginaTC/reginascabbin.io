const revealTargets = document.querySelectorAll(".reveal");
const entryDoor = document.querySelector("[data-enter-door]");
const returnDoor = document.querySelector("[data-return-door]");
const homeHeader = document.querySelector("#home");
const livingRoom = document.querySelector("#living-room");

function focusSection(target) {
  if (!target) {
    return;
  }

  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

function openLivingRoom(behavior = "smooth") {
  document.body.classList.add("hut-entered");

  const target = livingRoom || homeHeader;
  if (target) {
    target.scrollIntoView({ behavior, block: "start" });
    focusSection(homeHeader || target);
  }
}

function showEntryScreen() {
  document.body.classList.remove("hut-entered");
  if (entryDoor) {
    entryDoor.classList.remove("entering");
  }
  window.scrollTo({ top: 0, behavior: "auto" });
  focusSection(document.querySelector("#entry"));
}

function syncHashState() {
  if (window.location.hash === "#living-room" || window.location.hash === "#home") {
    window.requestAnimationFrame(() => {
      openLivingRoom("auto");
    });
    return;
  }

  if (window.location.hash === "#entry") {
    window.requestAnimationFrame(() => {
      showEntryScreen();
    });
  }
}

if (entryDoor && homeHeader) {
  entryDoor.addEventListener("click", () => {
    entryDoor.classList.add("entering");

    window.setTimeout(() => {
      window.history.replaceState(null, "", "#living-room");
      openLivingRoom("smooth");
    }, 360);
  });
}

if (returnDoor && entryDoor) {
  returnDoor.addEventListener("click", () => {
    window.history.replaceState(null, "", "#entry");
    showEntryScreen();
  });
}

syncHashState();
window.addEventListener("hashchange", syncHashState);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
  observer.observe(el);
});
