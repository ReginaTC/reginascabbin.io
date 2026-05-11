(function () {
  const openButtons = document.querySelectorAll("[data-record-open]");
  const closeButtons = document.querySelectorAll("[data-record-close]");
  const modals = document.querySelectorAll(".record-modal");

  if (!openButtons.length || !closeButtons.length || !modals.length) {
    return;
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-record-open") || "record-modal";
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.showModal();
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".record-modal");
      if (modal) {
        modal.close();
      }
    });
  });

  modals.forEach((modal) => {
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
  });
})();
