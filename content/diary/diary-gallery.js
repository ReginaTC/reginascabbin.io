(function () {
  const photos = Array.isArray(window.DIARY_PHOTOS) ? window.DIARY_PHOTOS.slice() : [];
  const gridEl = document.querySelector("#diary-media-grid");
  const prevBtn = document.querySelector("#diary-prev");
  const nextBtn = document.querySelector("#diary-next");
  const pageButtonsEl = document.querySelector("#diary-page-buttons");
  const resultCountEl = document.querySelector("#diary-result-count");

  if (!gridEl || !prevBtn || !nextBtn || !pageButtonsEl || !resultCountEl) {
    return;
  }

  const pageSize = 9;
  let currentPage = 1;
  const sorted = photos.sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function totalPages() {
    return Math.max(1, Math.ceil(sorted.length / pageSize));
  }

  function renderPageButtons(total) {
    pageButtonsEl.innerHTML = "";
    if (total <= 1) {
      return;
    }

    for (let page = 1; page <= total; page += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = String(page);
      btn.className = "gallery-page-btn";
      if (page === currentPage) {
        btn.setAttribute("aria-current", "page");
      }
      btn.addEventListener("click", () => {
        currentPage = page;
        render();
      });
      pageButtonsEl.appendChild(btn);
    }
  }

  function renderGrid(items) {
    gridEl.innerHTML = items
      .map((item) => {
        return `
          <figure class="media-card">
            <div class="media-visual"></div>
            <figcaption class="media-copy">
              <strong>${item.title}</strong>
              <span>${item.date} · ${item.note}</span>
            </figcaption>
          </figure>
        `;
      })
      .join("");
  }

  function render() {
    const pages = totalPages();
    currentPage = Math.min(Math.max(1, currentPage), pages);

    const start = (currentPage - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    renderGrid(items);
    renderPageButtons(pages);

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= pages;
    resultCountEl.textContent = `${sorted.length} 条结果 · 第 ${currentPage} / ${pages} 页`;
  }

  prevBtn.addEventListener("click", () => {
    currentPage -= 1;
    render();
  });

  nextBtn.addEventListener("click", () => {
    currentPage += 1;
    render();
  });

  render();
})();
