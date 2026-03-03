document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu   = document.getElementById("sideMenu");
  const overlay    = document.getElementById("overlay");
  const closeMenu  = document.getElementById("closeMenu");

  const openMenu = () => {
    sideMenu.classList.add("active");
    overlay.classList.remove("hidden");
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    sideMenu.setAttribute("aria-hidden", "false");
  };

  const closeSide = () => {
    sideMenu.classList.remove("active");
    overlay.classList.add("hidden");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
  };

  menuToggle?.addEventListener("click", () => {
    if (sideMenu.classList.contains("active")) closeSide();
    else openMenu();
  });

  closeMenu?.addEventListener("click", closeSide);
  overlay?.addEventListener("click", closeSide);

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSide();
  });

  // Smooth scroll + close menu
  document.querySelectorAll(".side-links a").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
        closeSide();
      }
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  // Counter (run once)
  const counters = document.querySelectorAll(".counter");
  let counterStarted = false;

  const runCounters = () => {
    if (counterStarted) return;
    counterStarted = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));

      const tick = () => {
        current += step;
        if (current >= target) current = target;
        counter.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
    });
  };

  // Start counters when hero trust is visible
  const trust = document.querySelector(".trust");
  if (trust) {
    const trustIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.3 });
    trustIO.observe(trust);
  } else {
    runCounters();
  }

  // Testimonial slider + dots
  const cards = Array.from(document.querySelectorAll(".testimonial-card"));
  const dotsWrap = document.getElementById("dots");

  let idx = 0;
  const setActive = (i) => {
    cards.forEach(c => c.classList.remove("active"));
    dotsWrap?.querySelectorAll(".dotbtn")?.forEach(d => d.classList.remove("active"));
    cards[i]?.classList.add("active");
    dotsWrap?.querySelectorAll(".dotbtn")[i]?.classList.add("active");
    idx = i;
  };

  if (dotsWrap && cards.length) {
    dotsWrap.innerHTML = cards.map((_, i) => `<button class="dotbtn ${i===0?'active':''}" aria-label="Testimoni ${i+1}"></button>`).join("");
    dotsWrap.querySelectorAll(".dotbtn").forEach((btn, i) => {
      btn.addEventListener("click", () => setActive(i));
    });
  }

  if (cards.length) {
    setInterval(() => setActive((idx + 1) % cards.length), 3500);
  }

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(btn => {
    btn.addEventListener("click", () => {
      const ans = btn.nextElementSibling;
      const isOpen = ans && ans.style.display === "block";
      document.querySelectorAll(".faq-a").forEach(a => a.style.display = "none");
      document.querySelectorAll(".faq-q span").forEach(s => s.textContent = "+");
      if (ans) {
        ans.style.display = isOpen ? "none" : "block";
        const span = btn.querySelector("span");
        if (span) span.textContent = isOpen ? "+" : "–";
      }
    });
  });

  // Pricing button -> WA with message
  document.querySelectorAll(".wa-pack").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const pack = btn.getAttribute("data-pack") || "Paket";
      const msg = encodeURIComponent(`Halo, saya mau konsultasi untuk ${pack}. Bisa dibantu?`);
      window.open(`https://wa.me/6281391832772?text=${msg}`, "_blank");
    });
  });
});
