const marquee = document.querySelector("#guestbook-marquee");
const track = document.querySelector("#guestbook-track");
const form = document.querySelector("#guestbook-form");
const authorInput = document.querySelector("#guestbook-author");
const messageInput = document.querySelector("#guestbook-message");
const submitButton = document.querySelector("#guestbook-submit");
const statusEl = document.querySelector("#guestbook-status");

const API_BASE = "/api/messages";
const MAX_MESSAGE_LENGTH = 280;

if (!marquee || !track || !form || !authorInput || !messageInput || !submitButton || !statusEl) {
  console.error("Guestbook page is missing required elements.");
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatRelativeTime(isoTime) {
  const time = new Date(isoTime).getTime();
  if (Number.isNaN(time)) {
    return "刚刚";
  }

  const diffMs = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "刚刚";
  }
  if (diffMs < hour) {
    return `${Math.max(1, Math.floor(diffMs / minute))} 分钟前`;
  }
  if (diffMs < day) {
    return `${Math.max(1, Math.floor(diffMs / hour))} 小时前`;
  }
  if (diffMs < 7 * day) {
    return `${Math.max(1, Math.floor(diffMs / day))} 天前`;
  }
  return new Date(time).toLocaleDateString("zh-CN");
}

function renderMessageCard(message) {
  const author = escapeHtml(message.author || "匿名来访");
  const content = escapeHtml(message.message || "");
  const timeLabel = escapeHtml(formatRelativeTime(message.createdAt));

  return `
    <article class="message-card">
      <div class="message-meta"><span>${author}</span><span>${timeLabel}</span></div>
      <blockquote>${content}</blockquote>
    </article>
  `;
}

function hydrateMarquee(messages) {
  track.innerHTML = messages.map(renderMessageCard).join("");

  const cards = Array.from(track.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  const duration = Math.max(18, cards.length * 5.5);
  track.style.animationDuration = `${duration}s`;
}

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.classList.remove("is-error", "is-success");
  if (type) {
    statusEl.classList.add(type);
  }
}

function setSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "发送中..." : "发送";
}

async function fetchMessages() {
  const response = await fetch(`${API_BASE}?limit=30`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Load failed: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.messages) ? data.messages : [];
}

async function loadAndRenderMessages() {
  const messages = await fetchMessages();
  if (!messages.length) {
    hydrateMarquee([
      {
        author: "客厅管理员",
        message: "还没有留言，来写下第一句吧。",
        createdAt: new Date().toISOString(),
      },
    ]);
    return;
  }

  hydrateMarquee(messages);
}

async function submitMessage(payload) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Submit failed: ${response.status}`);
  }

  const data = await response.json();
  return data.message;
}

if (marquee && track && form && authorInput && messageInput && submitButton && statusEl) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const author = String(authorInput.value || "").trim();
    const message = String(messageInput.value || "").trim();

    if (!message) {
      setStatus("请先写下留言内容。", "is-error");
      return;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      setStatus(`留言不能超过 ${MAX_MESSAGE_LENGTH} 个字。`, "is-error");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      await submitMessage({ author, message });
      messageInput.value = "";
      setStatus("发送成功，暖心寄语已更新。", "is-success");
      await loadAndRenderMessages();
    } catch (error) {
      console.error(error);
      setStatus("发送失败，请稍后重试。", "is-error");
    } finally {
      setSubmitting(false);
    }
  });

  loadAndRenderMessages().catch((error) => {
    console.error(error);
    setStatus("留言加载失败，请刷新页面重试。", "is-error");
  });
}
