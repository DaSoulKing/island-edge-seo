/* ============================================================
   NAVIGATION
   ============================================================ */
const nav = document.getElementById('mainNav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// Highlight active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
    link.classList.add('active');
  }
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ============================================================
   SEO CHECKER
   ============================================================ */
const checkerForm = document.getElementById('checkerForm');
const checkerInput = document.getElementById('checkerUrl');
const checkerBtn = document.getElementById('checkerBtn');
const checkerLoading = document.getElementById('checkerLoading');
const checkerError = document.getElementById('checkerError');
const scoreGrid = document.getElementById('scoreGrid');
const auditList = document.getElementById('auditList');
const ctaAfterScan = document.getElementById('ctaAfterScan');

function getScoreClass(score) {
  if (score >= 98) return 'score-good';
  if (score >= 80) return 'score-warn';
  return 'score-bad';
}

function getScoreColor(score) {
  if (score >= 98) return '#7cba6a';
  if (score >= 80) return '#e08522';
  return '#c0504a';
}

function animateRing(ringEl, score) {
  const circumference = 163;
  const offset = circumference - (score / 100) * circumference;
  const fg = ringEl.querySelector('.fg');
  const val = ringEl.querySelector('.score-val');
  const scoreClass = getScoreClass(score);

  ringEl.classList.remove('score-good', 'score-warn', 'score-bad');
  ringEl.classList.add(scoreClass);
  fg.style.stroke = getScoreColor(score);

  requestAnimationFrame(() => {
    setTimeout(() => {
      fg.style.strokeDashoffset = offset;
    }, 100);
  });

  // Count up animation
  let current = 0;
  const step = score / 50;
  const interval = setInterval(() => {
    current = Math.min(current + step, score);
    val.textContent = Math.round(current);
    if (current >= score) clearInterval(interval);
  }, 20);
}

function buildScoreCard(id, label, score) {
  const cls = getScoreClass(score);
  const circumference = 163;
  const r = 26;
  return `
    <div class="score-card">
      <div class="score-ring ${cls}" id="ring-${id}">
        <svg viewBox="0 0 64 64">
          <circle class="bg" cx="32" cy="32" r="${r}"/>
          <circle class="fg" cx="32" cy="32" r="${r}" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
        </svg>
        <span class="score-val">0</span>
      </div>
      <div class="score-label">${label}</div>
    </div>
  `;
}

async function runChecker(url) {
  checkerError.classList.remove('visible');
  checkerLoading.classList.add('visible');
  scoreGrid.classList.remove('visible');
  auditList.classList.remove('visible');
  ctaAfterScan.classList.remove('visible');
  checkerBtn.disabled = true;
  checkerBtn.textContent = 'Analyzing...';

  // Get reCAPTCHA token if available
  let recaptchaToken = '';
  if (typeof grecaptcha !== 'undefined' && window.RECAPTCHA_SITE_KEY) {
    try {
      recaptchaToken = await grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { action: 'analyze' });
    } catch (e) { /* skip */ }
  }

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, recaptchaToken })
    });

    const data = await res.json();

    if (!res.ok) {
      checkerError.textContent = data.error || 'Analysis failed. Please try again.';
      checkerError.classList.add('visible');
      return;
    }

    // Build score cards
    const { scores, seoAudits } = data;
    scoreGrid.innerHTML = `
      ${buildScoreCard('perf', 'Performance', scores.performance)}
      ${buildScoreCard('seo', 'SEO', scores.seo)}
      ${buildScoreCard('a11y', 'Accessibility', scores.accessibility)}
      ${buildScoreCard('bp', 'Best Practices', scores.bestPractices)}
    `;
    scoreGrid.classList.add('visible');

    // Animate rings
    setTimeout(() => {
      animateRing(document.getElementById('ring-perf'), scores.performance);
      animateRing(document.getElementById('ring-seo'), scores.seo);
      animateRing(document.getElementById('ring-a11y'), scores.accessibility);
      animateRing(document.getElementById('ring-bp'), scores.bestPractices);
    }, 100);

    // Build audit list (show top 6)
    const failedAudits = seoAudits.filter(a => !a.passed).slice(0, 4);
    const passedAudits = seoAudits.filter(a => a.passed).slice(0, 2);
    const displayAudits = [...failedAudits, ...passedAudits];

    if (displayAudits.length) {
      auditList.innerHTML = `
        <div class="audit-list-title">SEO Audit Results</div>
        ${displayAudits.map(a => `
          <div class="audit-item ${a.passed ? 'audit-pass' : 'audit-fail'}">
            <span class="audit-dot"></span>
            <span class="audit-text">${a.title}</span>
          </div>
        `).join('')}
      `;
      auditList.classList.add('visible');
    }

    // Build smart post-scan panel
    buildScanPanel(scores, seoAudits, data.url);

  } catch (err) {
    checkerError.textContent = 'Could not connect. Please check your URL and try again.';
    checkerError.classList.add('visible');
  } finally {
    checkerLoading.classList.remove('visible');
    checkerBtn.disabled = false;
    checkerBtn.textContent = 'Analyze';
  }
}

// Article recommendations keyed by audit failures
const articleRecs = {
  'document-title':    { title: 'How Page Titles Affect Your Rankings', href: '/blog/technical-seo-checklist' },
  'meta-description':  { title: 'Writing Meta Descriptions That Win Clicks', href: '/blog/why-seo-matters-2025' },
  'image-alt':         { title: 'Why Image Alt Text Matters More Than You Think', href: '/blog/technical-seo-checklist' },
  'is-crawlable':      { title: 'Is Google Actually Finding Your Pages?', href: '/blog/technical-seo-checklist' },
  'robots-txt':        { title: 'The robots.txt File Explained', href: '/blog/technical-seo-checklist' },
  'canonical':         { title: 'Duplicate Content and How to Fix It', href: '/blog/technical-seo-checklist' },
};

function buildScanPanel(scores, seoAudits, url) {
  const seoScore = scores.seo;
  const perfScore = scores.performance;

  // Always show warning - explain non-linear nature of SEO
  const warningEl = document.getElementById('scanWarning');
  const recsEl = document.getElementById('scanRecs');
  const recListEl = document.getElementById('scanRecList');

  if (!warningEl) return;

  let urgency = '';
  let detail = '';

  if (seoScore >= 98) {
    urgency = 'Strong foundation - now protect it.';
    detail = 'Your score looks good, but SEO is not a one-time task. Scores can drop quickly from new content, site changes, or competitors gaining ground. A single unoptimised page added to your site can drag rankings across the board.';
  } else if (seoScore >= 80) {
    urgency = 'This score is costing you real traffic.';
    detail = 'A score of ' + seoScore + ' may look acceptable, but SEO does not scale linearly. The difference between 80 and 98 is not 18 points of traffic - it can mean 3 to 10 times fewer visitors. Search engines reward the top positions exponentially. Sites at 95+ take the majority of clicks. Everything below them shares what is left.';
  } else {
    urgency = 'Critical issues are actively harming your visibility.';
    detail = 'A score of ' + seoScore + ' means search engines are likely struggling to understand, trust, or rank your site. The gap between where you are and where customers find you is significant. Most businesses at this score are invisible for their most valuable search terms.';
  }

  warningEl.querySelector('.scan-warning-title').textContent = urgency;
  warningEl.querySelector('.scan-warning-body').textContent = detail;
  warningEl.classList.add('visible');

  // Build article recommendations from failed audits
  const failedIds = seoAudits.filter(a => !a.passed).map(a => a.id);
  const matchedArticles = [];
  failedIds.forEach(id => {
    if (articleRecs[id] && !matchedArticles.find(a => a.href === articleRecs[id].href)) {
      matchedArticles.push(articleRecs[id]);
    }
  });

  if (matchedArticles.length > 0 && recListEl) {
    recListEl.innerHTML = matchedArticles.slice(0, 3).map(a =>
      '<div class="scan-rec-item"><a href="' + a.href + '" style="color:var(--gold-muted); font-weight:400;">' + a.title + '</a></div>'
    ).join('');
    recsEl.classList.add('visible');
  }
}

if (checkerForm) {
  checkerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let url = checkerInput.value.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
      checkerInput.value = url;
    }
    await runChecker(url);
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const successEl = document.getElementById('contactSuccess');
    const errorEl = document.getElementById('contactError');
    const original = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    successEl.classList.remove('visible');
    errorEl.classList.remove('visible');

    const formData = new FormData(contactForm);
    const body = Object.fromEntries(formData.entries());

    if (typeof grecaptcha !== 'undefined' && window.RECAPTCHA_SITE_KEY) {
      body.recaptchaToken = await grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { action: 'contact' });
    }

    try {
      const res = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        successEl.textContent = data.message;
        successEl.classList.add('visible');
        contactForm.reset();
      } else {
        errorEl.textContent = data.error;
        errorEl.classList.add('visible');
      }
    } catch {
      errorEl.textContent = 'Failed to send. Please try again.';
      errorEl.classList.add('visible');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}

/* ============================================================
   QUOTE FORM
   ============================================================ */
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = quoteForm.querySelector('.form-submit');
    const successEl = document.getElementById('quoteSuccess');
    const errorEl = document.getElementById('quoteError');
    const original = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    successEl.classList.remove('visible');
    errorEl.classList.remove('visible');

    const formData = new FormData(quoteForm);
    const services = Array.from(quoteForm.querySelectorAll('input[name="services"]:checked')).map(c => c.value);
    const body = Object.fromEntries(formData.entries());
    body.services = services;

    if (typeof grecaptcha !== 'undefined' && window.RECAPTCHA_SITE_KEY) {
      body.recaptchaToken = await grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { action: 'quote' });
    }

    try {
      const res = await fetch('/api/forms/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        successEl.textContent = data.message;
        successEl.classList.add('visible');
        quoteForm.reset();
      } else {
        errorEl.textContent = data.error;
        errorEl.classList.add('visible');
      }
    } catch {
      errorEl.textContent = 'Failed to submit. Please try again.';
      errorEl.classList.add('visible');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}


/* ============================================================
   PLAYBOOK LOADER
   ============================================================ */
async function loadPlaybook() {
  const container = document.getElementById('playbookGrid');
  if (!container) return;
  try {
    const res = await fetch('/api/blog/playbook/list');
    const posts = await res.json();
    if (!posts.length) {
      container.innerHTML = '<div style="padding:40px 32px; color:var(--muted); font-size:0.85rem; font-weight:300; grid-column:1/-1;">No playbook articles published yet.</div>';
      return;
    }
    container.innerHTML = posts.map(post => `
      <div class="academy-card reveal">
        <span class="academy-part">${post.playbook_part || 'Playbook'}</span>
        <h3 class="academy-card-title">${post.title}</h3>
        <p class="academy-card-desc">${post.excerpt || ''}</p>
        <a href="/blog/${post.slug}" class="academy-read">Read the article</a>
      </div>
    `).join('');
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } catch (err) {
    container.innerHTML = '<div style="padding:40px 32px; color:var(--muted); font-size:0.85rem; grid-column:1/-1;">Could not load playbook.</div>';
  }
}

/* ============================================================
   BLOG LOADER
   ============================================================ */
async function loadBlogPosts(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch('/api/blog');
    const posts = await res.json();
    const display = limit ? posts.slice(0, limit) : posts;

    if (!display.length) {
      container.innerHTML = '<p style="color:var(--muted); text-align:center; padding:40px 0;">No posts yet.</p>';
      return;
    }

    container.innerHTML = display.map(post => `
      <a href="/blog/${post.slug}" class="blog-card-link">
        <article class="blog-card reveal">
          <div class="blog-card-top"></div>
          <span class="blog-cat">${post.category || 'SEO'}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt || ''}</p>
          <div class="blog-card-meta">
            <span>${post.author || 'Honey Bridge SEO'}</span>
            <span>&middot;</span>
            <span>${post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
          </div>
        </article>
      </a>
    `).join('');

    // Re-observe new elements
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } catch (err) {
    container.innerHTML = '<p style="color:var(--muted);">Could not load posts.</p>';
  }
}

/* ============================================================
   SINGLE BLOG POST LOADER
   ============================================================ */
async function loadPost(slug) {
  const titleEl = document.getElementById('postTitle');
  const bodyEl = document.getElementById('postBody');
  const metaEl = document.getElementById('postMeta');
  if (!titleEl || !bodyEl) return;

  try {
    const res = await fetch(`/api/blog/${slug}`);
    if (!res.ok) {
      titleEl.textContent = 'Post not found';
      return;
    }
    const post = await res.json();
    document.title = `${post.title} - Honey Bridge SEO`;
    titleEl.textContent = post.title;
    bodyEl.innerHTML = post.content;
    if (metaEl) {
      metaEl.innerHTML = `
        <span>${post.author || 'Honey Bridge SEO'}</span>
        <span>·</span>
        <span>${post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
        ${post.category ? `<span>·</span><span>${post.category}</span>` : ''}
      `;
    }
  } catch {
    titleEl.textContent = 'Failed to load post.';
  }
}
