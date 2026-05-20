import { IDEAS_POSTS } from "./posts-data.js";

(function () {
  const posts = Array.isArray(IDEAS_POSTS) ? IDEAS_POSTS.slice() : [];
  const searchInput = document.querySelector("#ideas-search-input");
  const listEl = document.querySelector("#ideas-list");
  const resultCountEl = document.querySelector("#ideas-result-count");
  const prevBtn = document.querySelector("#ideas-prev");
  const nextBtn = document.querySelector("#ideas-next");
  const pageButtonsEl = document.querySelector("#ideas-page-buttons");

  if (!listEl || !searchInput || !prevBtn || !nextBtn || !pageButtonsEl || !resultCountEl) {
    return;
  }

  const pageSize = 10;
  let currentPage = 1;
  let keyword = "";

  const sortedPosts = posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function normalize(text) {
    return String(text || "").toLowerCase();
  }

  function getFilteredPosts() {
    const q = normalize(keyword).trim();
    if (!q) {
      return sortedPosts;
    }

    return sortedPosts.filter((post) => {
      const haystack = [
        post.title,
        post.category,
        post.excerpt,
        ...(post.tags || []),
        ...(post.content || [])
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function clampPage(page, totalPages) {
    if (totalPages <= 0) {
      return 1;
    }
    return Math.min(Math.max(page, 1), totalPages);
  }

  function renderPageButtons(totalPages) {
    pageButtonsEl.innerHTML = "";
    if (totalPages <= 1) {
      return;
    }

    const maxButtons = 7;
    let start = Math.max(1, currentPage - 3);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (let page = start; page <= end; page += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = String(page);
      btn.className = "ideas-page-btn";
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

  function renderPosts(items) {
    if (!items.length) {
      listEl.innerHTML = '<p class="ideas-empty">没有匹配结果。</p>';
      return;
    }

    listEl.innerHTML = items
      .map((post) => {
        const tags = (post.tags || [])
          .map((tag) => `<span>${tag}</span>`)
          .join("");

        return `
          <a class="article-card article-card-link" href="./post.html?id=${encodeURIComponent(post.id)}">
            <div class="article-meta">
              <span>${post.date}</span>
              <span>${post.category}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="card-tags">${tags}</div>
          </a>
        `;
      })
      .join("");
  }

  function render() {
    const filtered = getFilteredPosts();
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    currentPage = clampPage(currentPage, totalPages);

    const start = (currentPage - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    renderPosts(pageItems);
    renderPageButtons(totalPages);

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    const countText = total === 0 ? "0 条结果" : `${total} 条结果 · 第 ${currentPage} / ${totalPages} 页`;
    resultCountEl.textContent = countText;
  }

  searchInput.addEventListener("input", () => {
    keyword = searchInput.value;
    currentPage = 1;
    render();
  });

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
