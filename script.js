/* ==========================================================
   SAMIUJJAMAN.DEV — Portfolio scripts (Vanilla ES6+)
   1.  Helpers
   2.  Page loader
   3.  Sticky navbar + active link highlight
   4.  Mobile menu
   5.  Typing effect
   6.  Scroll reveal
   7.  Project filtering
   8.  Skill card 3D tilt
   9.  Custom cursor glow
   10. Particle background
   11. Back-to-top
   12. Contact form validation
   13. Download CV
   ========================================================== */

(() => {
  'use strict';

  /* ---------- 1. HELPERS ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- 2. PAGE LOADER ---------- */
  const loader = $('#loader');
  const hideLoader = () => {
    if (!loader || loader.classList.contains('is-hidden')) return;
    loader.classList.add('is-hidden');
    document.body.classList.remove('no-scroll');
  };
  document.body.classList.add('no-scroll');
  // Wait for the page to load, but always show a short branded intro
  window.addEventListener('load', () => setTimeout(hideLoader, 1500));
  setTimeout(hideLoader, 4000); // safety net if "load" is slow (e.g. fonts)

  /* ---------- 3. NAVBAR ---------- */
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = navLinks
    .map(link => $(link.getAttribute('href')))
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('is-scrolled', y > 40);
    backTop.classList.toggle('is-visible', y > 600);
  };

  // Highlight the nav link of the section currently in view
  const setActiveLink = id => {
    navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
  };
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActiveLink(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- 4. MOBILE MENU ---------- */
  const hamburger = $('#hamburger');
  const menu = $('#navLinks');

  const setMenu = open => {
    hamburger.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  };
  hamburger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  // Close when a link is chosen, Escape is pressed, or viewport grows
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); });

  /* ---------- 5. TYPING EFFECT ---------- */
  const typingEl = $('#typingText');
  const phrases = ['Frontend Developer', 'JavaScript Developer', 'Creative Web Designer', 'UI Enthusiast'];

  if (reduceMotion) {
    typingEl.textContent = phrases[0];
  } else {
    let pIndex = 0, cIndex = 0, deleting = false;
    const type = () => {
      const current = phrases[pIndex];
      cIndex += deleting ? -1 : 1;
      typingEl.textContent = current.slice(0, cIndex);

      let delay = deleting ? 45 : 95;
      if (!deleting && cIndex === current.length) { delay = 1600; deleting = true; }
      else if (deleting && cIndex === 0) { deleting = false; pIndex = (pIndex + 1) % phrases.length; delay = 400; }
      setTimeout(type, delay);
    };
    setTimeout(type, 1800);
  }

  /* ---------- 6. SCROLL REVEAL ---------- */
  const revealEls = $$('.reveal');
  // Stagger siblings for a cascading entrance
  revealEls.forEach(el => {
    const siblings = $$(':scope > .reveal', el.parentElement);
    el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 6) * 0.09}s`);
  });
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 7. PROJECT FILTERING ---------- */
  const filterBtns = $$('.filter-btn');
  const projects = $$('.project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      let shown = 0;
      projects.forEach(card => {
        const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.classList.toggle('is-hidden', !match);
        card.classList.remove('is-entering');
        if (match) {
          void card.offsetWidth; // restart animation
          card.style.animationDelay = `${shown * 0.07}s`;
          card.classList.add('is-entering');
          shown++;
        }
      });
    });
  });

  /* ---------- 8. SKILL CARD 3D TILT (desktop only) ---------- */
  if (!isTouch && !reduceMotion) {
    $$('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform .1s linear, box-shadow .4s';
        card.style.transform = `perspective(700px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = '';
        card.style.transform = '';
      });
    });
  }

  /* ---------- 9. CUSTOM CURSOR GLOW ---------- */
  const glow = $('#cursorGlow');
  if (!isTouch && glow) {
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    const follow = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.left = `${cx}px`;
      glow.style.top = `${cy}px`;
      requestAnimationFrame(follow);
    };
    window.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('is-active');
      if (!running) { running = true; cx = tx; cy = ty; follow(); }
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('is-active'));
  }

  /* ---------- 10. PARTICLE BACKGROUND ---------- */
  const canvas = $('#particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const mouse = { x: null, y: null };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.floor((w * h) / 16000), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    };

    const LINK = 130;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56,189,248,.75)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(0,163,255,${(1 - d / LINK) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        // Connect to the mouse for a subtle interactive feel
        if (mouse.x !== null) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < 160) {
            ctx.strokeStyle = `rgba(56,189,248,${(1 - d / 160) * 0.45})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', () => { mouse.x = mouse.y = null; });
    window.addEventListener('resize', resize);
    resize(); draw();
  }

  /* ---------- 11. BACK TO TOP ---------- */
  const backTop = $('#backTop');
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 12. CONTACT FORM VALIDATION ---------- */
  const form = $('#contactForm');
  const statusEl = $('#formStatus');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: v => v.trim().length < 2 ? 'Please enter your full name (at least 2 characters).' : '',
    email: v => !v.trim() ? 'Email address is required.' : !EMAIL_RE.test(v.trim()) ? 'Please enter a valid email address.' : '',
    subject: v => v.trim().length < 3 ? 'Please add a subject (at least 3 characters).' : '',
    message: v => v.trim().length < 10 ? 'Your message should be at least 10 characters.' : ''
  };

  const validateField = input => {
    const error = rules[input.name](input.value);
    const wrap = input.closest('.field');
    $('.field__error', wrap).textContent = error;
    wrap.classList.toggle('has-error', !!error);
    wrap.classList.toggle('is-valid', !error && input.value.trim() !== '');
    input.setAttribute('aria-invalid', String(!!error));
    return !error;
  };

  const inputs = $$('input, textarea', form);
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    statusEl.className = 'form__status';
    const results = inputs.map(validateField);

    if (results.includes(false)) {
      statusEl.textContent = 'Please fix the highlighted fields and try again.';
      statusEl.classList.add('is-error');
      inputs[results.indexOf(false)].focus();
      return;
    }

    /* No backend is connected, so the message opens in the visitor's email app.
       To use a service instead (Formspree, EmailJS, etc.), replace this block with a fetch() call. */
    const data = Object.fromEntries(new FormData(form));
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
    window.location.href =
      `mailto:hello@samiujjaman.dev?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;

    statusEl.textContent = 'Thank you! Your email app should open with your message ready to send.';
    statusEl.classList.add('is-success');
    form.reset();
    $$('.field', form).forEach(f => f.classList.remove('is-valid', 'has-error'));
  });

  /* ---------- 13. DOWNLOAD CV ---------- */
  /* Put your real CV at assets/Samiujjaman-CV.pdf. Until then, a simple text CV is generated. */
  const CV_PATH = 'assets/Samiujjaman-CV.pdf';
  const downloadBlob = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  $$('[data-cv]').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      setMenu(false);
      try {
        const res = await fetch(CV_PATH, { method: 'HEAD' });
        if (!res.ok) throw new Error('CV not found');
        const a = Object.assign(document.createElement('a'), { href: CV_PATH, download: 'Samiujjaman-CV.pdf' });
        document.body.appendChild(a); a.click(); a.remove();
      } catch {
        const text = [
          'MD. SAMIUJJAMAN', 'Frontend Developer', '',
          'Email: hello@samiujjaman.dev', 'Website: samiujjaman.dev', '',
          'SKILLS', 'HTML5, CSS3, JavaScript, Responsive Web Design,',
          'CSS Animations, DOM Manipulation, Git & GitHub, Website Optimization', '',
          '(Placeholder CV — add your real PDF at ' + CV_PATH + ')'
        ].join('\n');
        downloadBlob(new Blob([text], { type: 'text/plain' }), 'Samiujjaman-CV.txt');
      }
    });
  });
})();
