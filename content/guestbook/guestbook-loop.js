(function () {
  const marquee = document.querySelector("#guestbook-marquee");
  const track = document.querySelector("#guestbook-track");

  if (!marquee || !track) {
    return;
  }

  const cards = Array.from(track.children);
  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  const duration = Math.max(18, cards.length * 5.5);
  track.style.animationDuration = `${duration}s`;
})();
