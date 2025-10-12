import "./scripts/imgVideo.js";
import "./scripts/timeline.js";
import "./scripts/mail.js";

// Sayfa yüklendiğinde navigasyonu sabitleme
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "none";
  }
});
