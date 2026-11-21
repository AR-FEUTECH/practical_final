// ---------- Mobile menu ----------
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "Close" : "Menu";
  });
}

// ---------- Lightbox: click any photo to view it large ----------
const shots = [...document.querySelectorAll("a.shot")];
if (shots.length) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.innerHTML = `
    <div class="lb-bar"><span class="lb-count"></span><button class="lb-btn lb-close">Close ✕</button></div>
    <div class="lb-stage"><img alt=""></div>
    <div class="lb-caption"></div>
    <button class="lb-btn lb-prev" aria-label="Previous photo">←</button>
    <button class="lb-btn lb-next" aria-label="Next photo">→</button>`;
  document.body.appendChild(box);

  const img = box.querySelector("img");
  const cap = box.querySelector(".lb-caption");
  const count = box.querySelector(".lb-count");
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = (i + shots.length) % shots.length;
    const s = shots[current];
    img.src = s.href;
    img.alt = s.querySelector("img").alt;
    cap.textContent = s.dataset.caption || img.alt;
    count.textContent = `Frame ${String(current + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  };
  const close = () => {
    box.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  shots.forEach((s, i) => s.addEventListener("click", (e) => { e.preventDefault(); open(i); }));
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-stage")) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

// ---------- Fade in on scroll ----------
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("in"));
}

// ---------- Footer year ----------
document.querySelectorAll(".year").forEach((el) => { el.textContent = new Date().getFullYear(); });
