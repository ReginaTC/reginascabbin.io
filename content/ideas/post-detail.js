(function () {
  const posts = Array.isArray(window.IDEAS_POSTS) ? window.IDEAS_POSTS : [];
  const target = document.querySelector("#full-post");

  if (!target) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const post = posts.find((item) => item.id === id);

  if (!post) {
    target.innerHTML = `
      <div class="section-head">
        <div>
          <p class="section-eyebrow">POST</p>
          <h2>未找到这篇随笔</h2>
        </div>
      </div>
      <p>这篇内容可能已移动或不存在。</p>
      <p><a class="text-link" href="./index.html">返回随笔列表</a></p>
    `;
    return;
  }

  document.title = `${post.title} | 随笔林间`;

  const tags = (post.tags || []).map((tag) => `<span>${tag}</span>`).join("");
  const paragraphs = (post.content || []).map((line) => `<p>${line}</p>`).join("");

  target.innerHTML = `
    <div class="section-head">
      <div>
        <p class="section-eyebrow">FULL POST</p>
        <h1 class="full-post-title">${post.title}</h1>
      </div>
    </div>
    <div class="full-post-body">
      <div class="article-meta">
        <span>${post.date}</span>
        <span>${post.category}</span>
      </div>
      <div class="card-tags">${tags}</div>
      <div class="full-post-content">${paragraphs}</div>
      <p><a class="text-link" href="./index.html">返回随笔列表</a></p>
    </div>
  `;
})();
