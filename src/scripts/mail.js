document.addEventListener("DOMContentLoaded", () => {
  let toastTimer, hideTimer;

  function showToast(
    message,
    type = "success",
    { duration = 4000, fade = 500 }
  ) {
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
  document
    .getElementById("contactForm")
    .addEventListener("submit", async (e) => {
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
        showToast("Mesaj gönderildi ✅", "success", {
          duration: 3000,
          fade: 500,
        });

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
});
