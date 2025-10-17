document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  // const backdrop = lightbox.querySelector(".lightbox-backdrop");

  function openLightboxImage(src) {
    document.documentElement.style.overflow = "hidden";
    content.innerHTML = "";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    content.appendChild(img);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function openLightboxVideo(src) {
    document.documentElement.style.overflow = "hidden";
    content.innerHTML = "";
    const vid = document.createElement("video");
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    content.appendChild(vid);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    content.innerHTML = "";
    document.documentElement.style.overflow = "";
  }

  // Delegation: görsel/video aç
  document.addEventListener("click", function (e) {
    const trigger = e.target.closest(".lightbox-trigger");
    if (trigger) {
      const type = trigger.getAttribute("data-type");
      const imgSrc = trigger.getAttribute("data-src");
      const videoSrc = trigger.getAttribute("data-video");

      e.preventDefault();
      if (type === "image" && imgSrc) openLightboxImage(imgSrc);
      if (type === "video" && videoSrc) openLightboxVideo(videoSrc);
      return;
    }
  });

  // X butonu
  closeBtn.addEventListener("click", closeLightbox);

  // ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  // Modal içinde, içerik dışına tıklandıysa kapat
  lightbox.addEventListener("click", function (e) {
    const clickedOutsideContent =
      !e.target.closest(".lightbox-content") &&
      !e.target.closest(".lightbox-close");
    if (clickedOutsideContent && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
