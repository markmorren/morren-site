// morren.uk — tiny progressive-enhancement script.
// No framework, no dependencies. Runs after DOMContentLoaded (deferred in HTML).

// -- Footer year
for (const el of document.querySelectorAll("[data-year]")) {
  el.textContent = String(new Date().getFullYear());
}

// -- Fade-in on scroll
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  for (const el of document.querySelectorAll("[data-fade]")) {
    observer.observe(el);
  }
} else {
  for (const el of document.querySelectorAll("[data-fade]")) {
    el.classList.add("is-visible");
  }
}

// -- Contact form
const form = document.querySelector("form[data-contact]");
if (form) {
  const status = form.querySelector("[data-status]");
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const turnstile =
      form.querySelector('input[name="cf-turnstile-response"]')?.value || "";

    if (!name || !email || !message) {
      status.textContent = "Please fill in all three fields.";
      return;
    }
    if (!turnstile) {
      status.textContent = "Please complete the Turnstile check.";
      return;
    }

    submit.disabled = true;
    status.textContent = "Sending…";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, turnstile }),
      });
      const data = await response.json();
      if (data.ok) {
        status.textContent = "Sent. Thanks — I'll be in touch.";
        form.reset();
        if (window.turnstile?.reset) window.turnstile.reset();
      } else {
        status.textContent = data.error || "Something went wrong. Please try again.";
      }
    } catch {
      status.textContent = "Network error. Please try again.";
    } finally {
      submit.disabled = false;
    }
  });
}
