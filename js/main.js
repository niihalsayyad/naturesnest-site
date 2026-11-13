/* =========================================================
   Nature's Nest Exotic Resort — site scripts
   No libraries needed. Edit the CONFIG below if details change.
   ========================================================= */
const CONFIG = {
  whatsappNumber: "919595446986",          // country code + number, no "+" or spaces
  resortName: "Nature's Nest Exotic Resort",
  web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY" // get a free key at web3forms.com
};

document.documentElement.classList.add("js");

/* ---------- Helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function nightsBetween(a, b) {
  const ms = new Date(b + "T00:00:00") - new Date(a + "T00:00:00");
  return Math.round(ms / 86400000);
}

function isoDate(d) {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

/* ---------- Sticky header that shrinks on scroll ---------- */
const header = $(".site-header");
const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const toggle = $(".nav-toggle");
if (toggle) {
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".main-nav a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 960) closeMenu(); });
}

/* ---------- Fade-up animations on scroll ---------- */
const revealEls = $$(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}

/* ---------- Date fields: no past dates, check-out after check-in ---------- */
$$("form[data-booking]").forEach(form => {
  const inEl = $("[name=checkin]", form);
  const outEl = $("[name=checkout]", form);
  if (!inEl || !outEl) return;
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  inEl.min = isoDate(today);
  outEl.min = isoDate(tomorrow);
  inEl.addEventListener("change", () => {
    if (!inEl.value) return;
    const next = new Date(new Date(inEl.value + "T00:00:00").getTime() + 86400000);
    outEl.min = isoDate(next);
    if (!outEl.value || outEl.value <= inEl.value) outEl.value = isoDate(next);
  });
});

/* ---------- Booking forms -> WhatsApp (pre-filled message) ---------- */
$$("form[data-booking]").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const err = $(".form-error", form);
    const get = n => { const el = form.elements[n]; return el ? el.value.trim() : ""; };
    const checkin = get("checkin"), checkout = get("checkout");

    if (!checkin || !checkout) {
      if (err) err.textContent = "Please choose your check-in and check-out dates.";
      return;
    }
    if (checkout <= checkin) {
      if (err) err.textContent = "Check-out must be after check-in.";
      return;
    }
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (err) err.textContent = "";

    const nights = nightsBetween(checkin, checkout);
    const lines = [
      `Hello ${CONFIG.resortName}! 🌿`,
      `I would like to check availability for a stay:`,
      ``,
      `📅 Check-in: ${formatDate(checkin)}`,
      `📅 Check-out: ${formatDate(checkout)}`,
      `🌙 Nights: ${nights}`
    ];
    if (get("room")) lines.push(`🛏️ Room: ${get("room")}`);
    if (get("rooms")) lines.push(`🔑 No. of rooms: ${get("rooms")}`);
    if (get("adults")) lines.push(`👤 Adults: ${get("adults")}`);
    if (get("children")) lines.push(`🧒 Children: ${get("children")}`);
    if (get("guests")) lines.push(`👥 Guests: ${get("guests")}`);
    if (get("name")) lines.push(``, `Name: ${get("name")}`);
    if (get("phone")) lines.push(`Phone: ${get("phone")}`);
    if (get("notes")) lines.push(`Special requests: ${get("notes")}`);
    lines.push(``, `Please share availability and the best rate. Thank you!`);

    openWhatsApp(lines.join("\n"));
  });
});

/* ---------- Pre-select room from "Book this room" links ---------- */
$$("[data-pick-room]").forEach(btn => {
  btn.addEventListener("click", () => {
    const select = $("#booking-form [name=room]");
    if (select) select.value = btn.dataset.pickRoom;
  });
});

/* ---------- Contact form (Web3Forms, falls back to WhatsApp) ---------- */
const contactForm = $("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    const err = $(".form-error", contactForm);
    const ok = $(".form-success", contactForm);
    const btn = $("button[type=submit]", contactForm);
    const data = new FormData(contactForm);
    const keyMissing = !CONFIG.web3formsKey || CONFIG.web3formsKey.startsWith("YOUR_");

    // No email service set up yet -> send the enquiry on WhatsApp instead.
    if (keyMissing) {
      openWhatsApp([
        `Hello ${CONFIG.resortName}!`,
        ``,
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        data.get("phone") ? `Phone: ${data.get("phone")}` : null,
        data.get("subject") ? `Subject: ${data.get("subject")}` : null,
        ``,
        data.get("message")
      ].filter(l => l !== null).join("\n"));
      return;
    }

    data.set("access_key", CONFIG.web3formsKey);
    data.set("from_name", CONFIG.resortName + " Website");
    btn.disabled = true;
    const label = btn.innerHTML;
    btn.textContent = "Sending…";
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) {
        contactForm.reset();
        err.textContent = "";
        ok.classList.add("show");
      } else {
        throw new Error(json.message || "Something went wrong");
      }
    } catch (ex) {
      err.textContent = "Sorry, the message could not be sent. Please call or WhatsApp us instead.";
    } finally {
      btn.disabled = false;
      btn.innerHTML = label;
    }
  });
}

/* ---------- Reviews carousel ---------- */
$$(".carousel").forEach(carousel => {
  const track = $(".carousel-track", carousel);
  const prev = $(".carousel-prev", carousel);
  const next = $(".carousel-next", carousel);
  if (!track) return;
  const step = () => track.firstElementChild.getBoundingClientRect().width + 28;
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
  const go = dir => {
    if (dir > 0 && atEnd()) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth });
    else track.scrollBy({ left: dir * step() });
  };
  prev && prev.addEventListener("click", () => go(-1));
  next && next.addEventListener("click", () => go(1));

  // Gentle autoplay; pauses on hover / focus / touch
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    let paused = false;
    ["mouseenter", "focusin", "touchstart"].forEach(ev => carousel.addEventListener(ev, () => paused = true, { passive: true }));
    ["mouseleave", "focusout"].forEach(ev => carousel.addEventListener(ev, () => paused = false));
    setInterval(() => { if (!paused && !document.hidden) go(1); }, 5500);
  }
});

/* ---------- Gallery filter ---------- */
const filterBtns = $$(".filter-btn");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    const f = btn.dataset.filter;
    $$(".gallery-item").forEach(item => {
      item.classList.toggle("is-hidden", f !== "all" && item.dataset.category !== f);
    });
  });
});

/* ---------- Lightbox (any link with data-lightbox="group") ---------- */
(function lightbox() {
  const links = $$("a[data-lightbox]");
  if (!links.length) return;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  const arrow = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  box.innerHTML = `
    <span class="lb-count" aria-live="polite"></span>
    <button class="lb-btn lb-close" aria-label="Close">${arrow("M18 6 6 18M6 6l12 12")}</button>
    <button class="lb-btn lb-prev" aria-label="Previous photo">${arrow("m15 18-6-6 6-6")}</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="lb-btn lb-next" aria-label="Next photo">${arrow("m9 18 6-6-6-6")}</button>`;
  document.body.appendChild(box);

  const img = $("img", box), cap = $("figcaption", box), count = $(".lb-count", box);
  let group = [], index = 0, lastFocus = null;

  const visible = name => links.filter(a => a.dataset.lightbox === name && !a.classList.contains("is-hidden"));
  const show = i => {
    index = (i + group.length) % group.length;
    const a = group[index];
    img.src = a.getAttribute("href");
    img.alt = $("img", a)?.alt || "";
    cap.textContent = a.dataset.caption || img.alt;
    count.textContent = `${index + 1} / ${group.length}`;
  };
  const open = a => {
    group = visible(a.dataset.lightbox);
    lastFocus = document.activeElement;
    show(group.indexOf(a));
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    $(".lb-close", box).focus();
  };
  const close = () => {
    box.classList.remove("open");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  };

  links.forEach(a => a.addEventListener("click", e => { e.preventDefault(); open(a); }));
  $(".lb-close", box).addEventListener("click", close);
  $(".lb-prev", box).addEventListener("click", () => show(index - 1));
  $(".lb-next", box).addEventListener("click", () => show(index + 1));
  box.addEventListener("click", e => { if (e.target === box) close(); });
  document.addEventListener("keydown", e => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  // Swipe on phones
  let x0 = null;
  box.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();

/* ---------- Footer year ---------- */
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
