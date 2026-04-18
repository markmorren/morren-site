// Cloudflare Pages Function: POST /api/contact
// Verifies a Turnstile token, validates the form, sends email via Resend.
// Env vars required (set in Cloudflare Pages project settings):
//   TURNSTILE_SECRET_KEY   — from the Cloudflare Turnstile dashboard
//   RESEND_API_KEY         — from https://resend.com
//   CONTACT_EMAIL          — where form messages go (e.g. hello@morren.uk)
//   FROM_EMAIL             — verified sender on your domain (e.g. form@morren.uk)

export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim();
    const message = String(payload.message ?? "").trim();
    const turnstile = String(payload.turnstile ?? "");

    if (!name || !email || !message || !turnstile) {
      return json({ ok: false, error: "Missing fields." }, 400);
    }
    if (name.length > 120 || email.length > 200 || message.length > 5000) {
      return json({ ok: false, error: "One of the fields is too long." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: "That email address doesn't look right." }, 400);
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "";
    const turnstileResult = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, turnstile, ip);
    if (!turnstileResult.success) {
      return json({ ok: false, error: "Turnstile check failed. Please try again." }, 400);
    }

    const emailResult = await sendEmail(env, { name, email, message });
    if (!emailResult.ok) {
      console.error("Resend error:", emailResult.error);
      return json({ ok: false, error: "Couldn't send your message. Please try again later." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("contact function error:", err);
    return json({ ok: false, error: "Server error." }, 500);
  }
}

async function verifyTurnstile(secret, token, ip) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return res.json();
}

async function sendEmail(env, { name, email, message }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.CONTACT_EMAIL],
      reply_to: email,
      subject: `[morren.uk] Message from ${name}`,
      text: `Name:    ${name}\nEmail:   ${email}\n\n${message}\n`,
    }),
  });
  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }
  return { ok: true };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
