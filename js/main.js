/* =========================================================
   Landing Abogados Medellín — interacciones
   - Sticky header con sombra al scroll
   - FAQ accordion
   - Smooth scroll
   - Formularios → Formspree (https://formspree.io/f/xzdnvqzb)
   - Exit-intent modal
   - Scroll reveal
   - Tracking events (GA4 ready)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Tracking helper (GA4-ready, console fallback) ---------- */
  function track(name, params = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    }
    console.info("[track]", name, params);
  }

  /* ---------- Credentials marquee (mobile) ---------- */
  document.querySelectorAll(".credentials-carousel").forEach((carousel) => {
    const marquee = carousel.querySelector(".credentials-marquee");
    const row = carousel.querySelector(".credentials-row");
    if (!marquee || !row || marquee.querySelector(".credentials-row--clone")) return;

    const clone = row.cloneNode(true);
    clone.classList.add("credentials-row--clone");
    clone.setAttribute("aria-hidden", "true");
    marquee.appendChild(clone);
  });

  /* ---------- Header sombra al scroll ---------- */
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        if (window.innerWidth <= 900 && a.classList.contains("nav-dropdown-trigger")) {
          return;
        }
        navLinks.classList.remove("open");
        document.querySelectorAll(".nav-dropdown.open").forEach((d) => {
          d.classList.remove("open");
          const trigger = d.querySelector(".nav-dropdown-trigger");
          if (trigger) trigger.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  /* ---------- Nav dropdown (mobile) ---------- */
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const isOpen = dropdown.classList.contains("open");
      document.querySelectorAll(".nav-dropdown.open").forEach((d) => {
        d.classList.remove("open");
        const t = d.querySelector(".nav-dropdown-trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        dropdown.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document
        .querySelectorAll(".faq-item.open")
        .forEach((o) => o.classList.remove("open"));
      if (!wasOpen) {
        item.classList.add("open");
        track("faq_open", { question: btn.textContent.trim().slice(0, 80) });
      }
    });
  });

  /* ---------- Smooth scroll para anclas internas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Validación de teléfono colombiano ---------- */
  function validatePhoneCO(value) {
    const v = value.replace(/\s|-/g, "");
    return /^(\+?57)?[13]\d{9}$/.test(v) || /^[3]\d{9}$/.test(v);
  }
  function validateName(value) {
    return value.trim().length >= 3;
  }

  /* ---------- Formspree endpoint ---------- */
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzdnvqzb";

  /* ---------- Manejo de formularios ---------- */
  function handleForm(form) {
    if (!form) return;
    const fields = form.querySelectorAll("[data-validate]");
    const submitBtn = form.querySelector('button[type="submit"]');
    const successBox = form.parentElement.querySelector(".form-success");

    function setError(field, message) {
      const errorEl = field.parentElement.querySelector(".field-error");
      if (errorEl) errorEl.textContent = message || "";
      field.style.borderColor = message ? "var(--red-600)" : "";
    }

    fields.forEach((field) => {
      field.addEventListener("blur", () => {
        validateField(field);
      });
      field.addEventListener("input", () => {
        if (field.dataset.touched) validateField(field);
      });
      field.addEventListener("change", () => {
        if (field.dataset.touched) validateField(field);
      });
    });

    function validateField(field) {
      field.dataset.touched = "1";
      const type = field.dataset.validate;
      const v = field.value;

      if (type === "name") {
        if (!validateName(v)) {
          setError(field, "Por favor ingresa tu nombre completo.");
          return false;
        }
      }
      if (type === "phone") {
        if (!validatePhoneCO(v)) {
          setError(field, "Ingresa un número celular colombiano válido (10 dígitos).");
          return false;
        }
      }
      if (type === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          setError(field, "Ingresa un correo válido.");
          return false;
        }
      }
      if (type === "case") {
        if (v.trim().length < 10) {
          setError(field, "Cuéntanos tu caso en una línea (mínimo 10 caracteres).");
          return false;
        }
      }
      if (type === "consent") {
        if (!field.checked) {
          setError(field, "Debes aceptar la política de tratamiento de datos.");
          return false;
        }
      }
      setError(field, "");
      return true;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach((f) => {
        if (!validateField(f)) valid = false;
      });
      if (!valid) {
        track("lead_form_error", { form: form.dataset.formId });
        return;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      data._form = form.dataset.formId || "unknown";
      data._subject =
        data._form === "exit_intent"
          ? "LEXAR — Solicitud de guía PDF"
          : "LEXAR — Lead consulta";
      data.source = window.location.pathname;
      data.utm = window.location.search || "(none)";
      data.referrer = document.referrer || "direct";
      data.submitted_at = new Date().toISOString();
      if (data.consent) data.consent = "accepted";

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Enviando…";

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || `Formspree HTTP ${response.status}`);
        }

        track("lead_form_submit", {
          form: form.dataset.formId,
          area: data.area || "general",
        });

        form.style.display = "none";
        if (successBox) successBox.classList.add("show");
      } catch (err) {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        alert(
          "Hubo un problema enviando tu mensaje. Por favor escríbenos directamente por WhatsApp al 324 577 7090."
        );
      }
    });
  }

  document.querySelectorAll("form[data-form-id]").forEach(handleForm);

  /* ---------- Exit-intent modal ---------- */
  const modal = document.querySelector(".modal-backdrop");
  if (modal) {
    let triggered = sessionStorage.getItem("exit_intent_shown") === "1";

    function showModal() {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem("exit_intent_shown", "1");
      modal.classList.add("show");
      track("exit_intent_show");
    }

    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget && e.clientY < 10) showModal();
    });

    setTimeout(() => {
      if (window.scrollY === 0 && !triggered) showModal();
    }, 45000);

    modal.addEventListener("click", (e) => {
      if (
        e.target === modal ||
        e.target.classList.contains("modal-close") ||
        e.target.closest(".modal-close")
      ) {
        modal.classList.remove("show");
      }
    });
  }

  /* ---------- Scroll reveal (fade-in suave) ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Trackers de clics importantes ---------- */
  document.querySelectorAll('a[href^="https://wa.me"]').forEach((a) => {
    a.addEventListener("click", () =>
      track("whatsapp_click", { href: a.getAttribute("href") })
    );
  });
  document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
    a.addEventListener("click", () =>
      track("call_click", { number: a.getAttribute("href").replace("tel:", "") })
    );
  });

  /* ---------- Año dinámico en footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll depth tracking ---------- */
  const milestones = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener(
    "scroll",
    () => {
      const pct = Math.round(
        ((window.scrollY + window.innerHeight) /
          document.documentElement.scrollHeight) *
          100
      );
      Object.keys(milestones).forEach((m) => {
        if (!milestones[m] && pct >= Number(m)) {
          milestones[m] = true;
          track("scroll_depth", { percent: Number(m) });
        }
      });
    },
    { passive: true }
  );
})();
