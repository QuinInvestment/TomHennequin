/* ═══════════════════════════════════════════════════
   app.js — Tom Hennequin Portfolio
═══════════════════════════════════════════════════ */

// ── Year ────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Custom Cursor ────────────────────────────────────
(function() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Scale on hover over interactive els
  document.querySelectorAll('a,button,input,textarea,select,.qt-card,.exp-card,.kpi-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.cssText += ';width:50px;height:50px;border-color:rgba(34,211,238,.8)');
    el.addEventListener('mouseleave', () => ring.style.cssText += ';width:32px;height:32px;border-color:rgba(34,211,238,.5)');
  });
})();

// ── Nav scroll + progress ────────────────────────────
(function() {
  const nav  = document.getElementById('nav');
  const prog = document.getElementById('navProgress');
  if (!nav) return;

  function update() {
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('scrolled', scrolled);

    if (prog) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (total > 0 ? (window.scrollY / total * 100) : 0) + '%';
    }

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Mobile menu ──────────────────────────────────────
(function() {
  const burger  = document.getElementById('burger');
  const overlay = document.getElementById('mobileOverlay');
  const close   = document.getElementById('mobClose');
  if (!burger || !overlay) return;

  function open()  { overlay.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function shut()  { overlay.classList.remove('open'); document.body.style.overflow = ''; }

  burger.addEventListener('click', () => overlay.classList.contains('open') ? shut() : open());
  close?.addEventListener('click', shut);
  overlay.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', shut));
  overlay.addEventListener('click', e => { if (e.target === overlay) shut(); });
})();

// ── Hero Canvas (particle network) ──────────────────
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const NUM  = 60;
  const DIST = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * .18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,.35)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize(); createParticles(); draw();
})();

// ── AOS (scroll reveal) ──────────────────────────────
(function() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: .1 });
  els.forEach(el => io.observe(el));
})();

// ── Language bars (animate on visible) ──────────────
(function() {
  const fills = document.querySelectorAll('.lc-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.w || '0';
        e.target.style.width = w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  fills.forEach(f => io.observe(f));
})();

// ── Progress bars (animate on visible) ───────────────
(function() {
  const fills = document.querySelectorAll('.prog-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.w || '0';
        e.target.style.width = w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  fills.forEach(f => io.observe(f));
})();

// ── Radar Chart ──────────────────────────────────────
(function() {
  const canvas = document.getElementById('radarChart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: ['Finance\nquantitative', 'Python /\nCode', 'Bloomberg\n/ Outils', 'Mathématiques', 'Langues', 'Ingénierie\ntechnique'],
      datasets: [{
        label: 'Compétences',
        data: [82, 78, 76, 85, 80, 68],
        backgroundColor: 'rgba(34,211,238,.12)',
        borderColor: 'rgba(34,211,238,.8)',
        pointBackgroundColor: '#22d3ee',
        pointBorderColor: 'transparent',
        pointRadius: 4,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false, stepSize: 25 },
          grid: { color: 'rgba(255,255,255,.07)' },
          angleLines: { color: 'rgba(255,255,255,.07)' },
          pointLabels: {
            color: 'rgba(255,255,255,.5)',
            font: { family: "'Outfit', sans-serif", size: 10, weight: '500' },
          }
        }
      },
      plugins: { legend: { display: false } },
    }
  });
})();

// ── Performance + Allocation + Risk Charts ────────────
(function() {
  if (typeof Chart === 'undefined') return;

  const perfCanvas  = document.getElementById('perfChart');
  const allocCanvas = document.getElementById('allocChart');
  const riskCanvas  = document.getElementById('riskChart');
  const tabs        = document.querySelectorAll('.cc-tab');
  if (!perfCanvas) return;

  const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  const generateData = (base, noise) =>
    labels.map((_, i) => +(base + i * (noise/12) + (Math.random() - .5) * noise * .5).toFixed(2));

  // Performance chart (line)
  const perfChart = new Chart(perfCanvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Portefeuille PEA',
          data: [100, 101.2, 102.8, 102.1, 103.9, 105.2, 106.4, 107.1, 108.8, 110.2, 111.5, 112.4],
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,.08)',
          fill: true,
          tension: .45,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
          pointBackgroundColor: '#22d3ee',
        },
        {
          label: 'Référence (CAC 40)',
          data: [100, 100.8, 101.5, 100.9, 102.1, 103.0, 103.8, 104.2, 105.5, 106.1, 107.0, 107.8],
          borderColor: 'rgba(129,140,248,.6)',
          backgroundColor: 'transparent',
          fill: false,
          tension: .45,
          pointRadius: 2,
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointBackgroundColor: 'rgba(129,140,248,.6)',
        }
      ]
    },
    options: chartOpts('Performance rebased (100 = Jan)')
  });

  // Allocation chart (doughnut)
  let allocChart = null;
  if (allocCanvas) {
    allocChart = new Chart(allocCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Actions EU', 'Actions US', 'Obligations', 'Crypto', 'Liquidités'],
        datasets: [{
          data: [38, 32, 15, 8, 7],
          backgroundColor: ['#22d3ee','#818cf8','#34d399','#f59e0b','#64748b'],
          borderColor: '#f7f9fc',
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#64748b', font: { family: "'Outfit'", size: 11 }, padding: 14, boxWidth: 10 }
          }
        },
        cutout: '68%',
      }
    });
  }

  // Risk chart (bar)
  let riskChart = null;
  if (riskCanvas) {
    riskChart = new Chart(riskCanvas, {
      type: 'bar',
      data: {
        labels: ['Volatilité\nann.', 'Max\nDrawdown', 'Sharpe\n(x10)', 'Beta', 'Corr.\nCAC (x10)'],
        datasets: [
          { label: 'Portefeuille', data: [10.2, 8.5, 12.8, 8.7, 7.6], backgroundColor: 'rgba(34,211,238,.7)', borderRadius: 5 },
          { label: 'Référence',    data: [13.5, 14.2, 8.1, 10.0, 10.0], backgroundColor: 'rgba(129,140,248,.4)', borderRadius: 5 }
        ]
      },
      options: chartOpts('Indicateurs de risque (%)')
    });
  }

  function chartOpts(yLabel) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#64748b', font: { family: "'Outfit'", size: 11 }, padding: 16, boxWidth: 10 }
        },
        tooltip: {
          backgroundColor: 'rgba(6,9,14,.9)',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,.6)',
          borderColor: 'rgba(255,255,255,.08)',
          borderWidth: 1,
          padding: 10,
          titleFont: { family: "'Outfit'", weight: '700' },
          bodyFont: { family: "'JetBrains Mono'" },
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(15,23,42,.05)' },
          ticks: { color: '#94a3b8', font: { family: "'Outfit'", size: 11 } }
        },
        y: {
          grid: { color: 'rgba(15,23,42,.05)' },
          ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono'", size: 10 } },
          title: { display: false }
        }
      }
    };
  }

  // Tab switching
  const charts = { perf: perfChart, alloc: allocChart, risk: riskChart };
  const canvases = { perf: perfCanvas, alloc: allocCanvas, risk: riskCanvas };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.chart;
      Object.entries(canvases).forEach(([k, c]) => {
        if (c) c.style.display = k === key ? 'block' : 'none';
      });
      // Trigger resize for doughnut layout
      if (key === 'alloc' && charts.alloc) charts.alloc.resize();
    });
  });
})();

// ── Carousel ─────────────────────────────────────────
(function() {
  const carousel  = document.getElementById('carousel');
  const track     = document.getElementById('qtTrack');
  const dotsWrap  = document.getElementById('qtDots');
  const viewport  = document.getElementById('qtViewport');
  const prevBtn   = carousel?.querySelector('.qt-prev');
  const nextBtn   = carousel?.querySelector('.qt-next');
  if (!carousel || !track || !dotsWrap || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.qt-card'));
  if (!cards.length) return;

  // Build dots
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'qt-dot' + (i === 0 ? ' active' : '');
    b.setAttribute('aria-label', `Slide ${i + 1}`);
    b.addEventListener('click', () => scrollTo(i, true));
    dotsWrap.appendChild(b);
    return b;
  });

  const INTERVAL = 4500;
  let timer = null, paused = false;

  function vpCx() { const r = track.getBoundingClientRect(); return r.left + viewport.clientWidth / 2; }
  function cCx(c) { const r = c.getBoundingClientRect(); return r.left + r.width / 2; }
  function nearest() {
    const vc = vpCx(); let best = 0, bd = Infinity;
    cards.forEach((c, i) => { const d = Math.abs(cCx(c) - vc); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function setActive(i) { dots.forEach((d, j) => d.classList.toggle('active', j === i)); }

  function scrollTo(i, user = false) {
    const c = cards[i];
    const left = c.offsetLeft - (viewport.clientWidth - c.clientWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
    if (user) bump();
  }

  let raf = null;
  function animate() {
    raf = null;
    const vc = vpCx(), maxD = viewport.clientWidth * .52;
    cards.forEach(card => {
      const cc = cCx(card), d = Math.min(Math.abs(cc - vc), maxD), t = 1 - d / maxD;
      card.style.transform = `scale(${(.91 + t * .11).toFixed(3)})`;
      card.style.opacity   = (.6 + t * .4).toFixed(3);
      const img = card.querySelector('img');
      if (img) img.style.transform = `translateX(${(-(cc-vc)/maxD*7).toFixed(2)}px) scale(1.04)`;
    });
    setActive(nearest());
  }
  function schedAnim() { if (!raf) raf = requestAnimationFrame(animate); }

  track.addEventListener('scroll', schedAnim, { passive: true });
  window.addEventListener('resize', schedAnim);

  prevBtn?.addEventListener('click', () => scrollTo(Math.max(0, nearest() - 1), true));
  nextBtn?.addEventListener('click', () => scrollTo(Math.min(cards.length - 1, nearest() + 1), true));

  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollTo(Math.max(0, nearest() - 1), true); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollTo(Math.min(cards.length - 1, nearest() + 1), true); }
  });

  // Drag
  let isDown = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', e => {
    isDown = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId); pause();
  });
  track.addEventListener('pointermove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
    schedAnim();
  });
  track.addEventListener('pointerup', () => {
    if (!isDown) return; isDown = false;
    setTimeout(() => scrollTo(nearest(), false), 0);
    resumeDelay();
  });
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  // Autoplay
  function tick() { if (!paused) scrollTo((nearest() + 1) % cards.length, false); }
  function start() { stop(); timer = setInterval(tick, INTERVAL); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }
  function pause() { paused = true; }
  function resume(){ paused = false; }
  function resumeDelay() { pause(); setTimeout(resume, 2500); }
  function bump()  { stop(); start(); resumeDelay(); }

  carousel.addEventListener('mouseenter', pause);
  carousel.addEventListener('mouseleave', resume);
  viewport.addEventListener('focusin', pause);
  viewport.addEventListener('focusout', resume);

  schedAnim();
  setTimeout(() => scrollTo(0, false), 80);
  start();
})();

// ── Contact form ──────────────────────────────────────
(function() {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('submitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const span = btn.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Message envoyé ✓';
    btn.style.background = '#4ade80';
    btn.style.color = '#052e16';
    btn.style.boxShadow = '0 8px 24px rgba(74,222,128,.3)';
    btn.disabled = true;

    setTimeout(() => {
      span.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
})();

// ── Smooth scroll for anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
