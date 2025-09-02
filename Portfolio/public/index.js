// Sayfa yüklendiğinde navigasyonu sabitleme
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "none";
  }
});

const lightbox = document.getElementById("lightbox");
const content = document.getElementById("lightbox-content");
const closeBtn = lightbox.querySelector(".lightbox-close");
const backdrop = lightbox.querySelector(".lightbox-backdrop");

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

let toastTimer, hideTimer;

function showToast(message, type = "success", { duration = 4000, fade = 500 }) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = type ? type : "";
  el.showPopover();

  // bir sonraki frame'de .is-open ekle → transition tetiklensin
  requestAnimationFrame(() => el.classList.add("is-open"));

  clearTimeout(toastTimer);
  clearTimeout(hideTimer);

  toastTimer = setTimeout(() => {
    // kapanış animasyonu
    el.classList.remove("is-open");
    // animasyon süresi kadar bekleyip sonra kapat
    hideTimer = setTimeout(() => el.hidePopover(), fade);
  }, duration);
}

// Mail - Form bilgisi gönderme
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.style.cursor = "not-allowed";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
    honeypot: form.honeypot?.value || "",
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch((err) => alert(err));

    if (!res.ok) throw new Error(data.error || "Gönderilemedi");
    showToast("Mesaj gönderildi ✅", "success", { duration: 3000, fade: 500 });

    form.reset();
  } catch (err) {
    console.error(err);
    showToast("Gönderim hatası ❌ Lütfen sonra tekrar deneyin.", "error", {
      duration: 3000,
      fade: 500,
    });
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.style.cursor = "pointer";
    }, 3000);
  }
});
