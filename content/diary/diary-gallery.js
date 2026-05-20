import { DIARY_PHOTOS } from "./diary-data.js";

(function () {
  const currentScript = document.currentScript;
  const assetBaseUrl = currentScript
    ? new URL(".", currentScript.src)
    : new URL("./", window.location.href);

  const photos = Array.isArray(DIARY_PHOTOS) ? DIARY_PHOTOS.slice() : [];
  const trackEl = document.querySelector("#diary-film-track");
  const marqueeEl = document.querySelector("#diary-film-marquee");
  const resultCountEl = document.querySelector("#diary-result-count");
  const instaxGridEl = document.querySelector(".instax-grid");

  function initInstaxModal() {
    if (!instaxGridEl) {
      return;
    }

    const modal = document.createElement("dialog");
    modal.className = "film-modal instax-modal";
    modal.innerHTML = `
      <article class="film-modal-card">
        <button class="film-modal-close" type="button" data-instax-close aria-label="关闭详情">×</button>
        <h3 class="instax-modal-title" id="instax-modal-title"></h3>
        <img class="film-modal-image" src="" alt="" />
        <p class="film-modal-desc" id="instax-modal-desc"></p>
      </article>
    `;
    instaxGridEl.after(modal);

    const modalImageEl = modal.querySelector(".film-modal-image");
    const modalDescEl = modal.querySelector("#instax-modal-desc");
    const modalTitleEl = modal.querySelector("#instax-modal-title");
    const modalCloseBtn = modal.querySelector("[data-instax-close]");

    function openModal(trigger) {
      if (!modalImageEl || !modalDescEl || !modalTitleEl) {
        return;
      }
      const title = trigger.getAttribute("data-instax-title") || "拍立得";
      const desc = trigger.getAttribute("data-instax-desc") || "暂无描述";
      const image =
        trigger.querySelector("img")?.getAttribute("src") ||
        trigger.getAttribute("data-instax-image") ||
        "";
      const imageUrl = image ? new URL(image, assetBaseUrl).href : "";

      modalTitleEl.textContent = title;
      modalImageEl.src = imageUrl;
      modalImageEl.alt = title;
      modalDescEl.textContent = desc;
      modal.showModal();
    }

    instaxGridEl.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const trigger = target.closest("[data-instax-open]");
      if (!(trigger instanceof HTMLElement)) {
        return;
      }
      openModal(trigger);
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", (event) => {
      const rect = modal.getBoundingClientRect();
      const clickedOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (clickedOutside) {
        modal.close();
      }
    });
  }

  initInstaxModal();

  if (!trackEl || !marqueeEl || !resultCountEl) {
    return;
  }

  const sorted = photos.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const holeRow = "<span></span><span></span><span></span><span></span><span></span><span></span>";

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function cardTemplate(item, index) {
    const title = escapeHtml(item.title || "未命名");
    const imageUrl = item.image ? new URL(item.image, assetBaseUrl).href : "";
    const visual = imageUrl
      ? `<img class="film-image" src="${imageUrl}" alt="${title}" loading="lazy" />`
      : `<span class="film-image film-image--empty" aria-hidden="true"></span>`;

    return `
      <article class="film-frame">
        <div class="film-hole-row film-hole-row--top" aria-hidden="true">${holeRow}</div>
        <button class="film-window-btn" type="button" data-film-open="${index}" aria-label="查看照片详情：${title}">
          <figure class="film-window">${visual}</figure>
        </button>
        <div class="film-hole-row film-hole-row--bottom" aria-hidden="true">${holeRow}</div>
      </article>
    `;
  }

  if (!sorted.length) {
    resultCountEl.textContent = "0 张";
    marqueeEl.innerHTML = '<p class="ideas-empty">还没有照片。</p>';
    return;
  }

  const cards = sorted.map((item, index) => cardTemplate(item, index)).join("");
  trackEl.innerHTML = `
    <div class="film-strip">${cards}</div>
    <div class="film-strip" aria-hidden="true">${cards}</div>
  `;

  const duration = Math.max(26, sorted.length * 3.6);
  trackEl.style.setProperty("--film-duration", `${duration}s`);
  resultCountEl.textContent = `${sorted.length} 张`;

  const modal = document.createElement("dialog");
  modal.className = "film-modal";
  modal.innerHTML = `
    <article class="film-modal-card">
      <button class="film-modal-close" type="button" data-film-close aria-label="关闭详情">×</button>
      <img class="film-modal-image" src="" alt="" />
      <p class="film-modal-desc" id="film-modal-desc"></p>
    </article>
  `;
  marqueeEl.appendChild(modal);

  const modalImageEl = modal.querySelector(".film-modal-image");
  const modalDescEl = modal.querySelector("#film-modal-desc");
  const modalCloseBtn = modal.querySelector("[data-film-close]");

  function openModal(index) {
    const item = sorted[index];
    if (!item || !modalImageEl || !modalDescEl) {
      return;
    }
    const title = item.title || "未命名";
    const imageUrl = item.image ? new URL(item.image, assetBaseUrl).href : "";
    const desc = item.note || "暂无描述";
    modalImageEl.src = imageUrl;
    modalImageEl.alt = title;
    modalDescEl.textContent = desc;
    modal.showModal();
  }

  trackEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const trigger = target.closest("[data-film-open]");
    if (!trigger) {
      return;
    }
    const index = Number(trigger.getAttribute("data-film-open"));
    if (!Number.isNaN(index)) {
      openModal(index);
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => modal.close());
  }

  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (clickedOutside) {
      modal.close();
    }
  });
})();
