export const config = {
  runtime: "edge",
  regions: ["fra1"], // opsiyonel ama iyi
};

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extra },
  });
}

export default async function handler(req) {
  if (req.method !== "POST")
    return json({ error: "Method Not Allowed" }, 405, { Allow: "POST" });

  if (!process.env.RESEND_API_KEY || !process.env.MAIL_TO) {
    return json({ error: "Server env missing (RESEND_API_KEY/MAIL_TO)." }, 500);
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const {
    name = "",
    email = "",
    subject = "",
    message = "",
    honeypot = "",
  } = body;
  if (honeypot) return json({ ok: true }); // basit anti-spam

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !subject || !message) {
    return json({ error: "Missing or invalid fields" }, 400);
  }

  // 12 sn timeout (Resend gecikirse 5 dk beklemesin)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), 12_000);

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "Portfolio <onboarding@resend.dev>",
        to: [process.env.MAIL_TO],
        reply_to: email,
        subject: `Portfolio Contact: ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return json({ error: "Resend error", status: r.status, detail }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    clearTimeout(timer);
    return json({ error: "Upstream fetch failed", detail: String(err) }, 504);
  }
}
