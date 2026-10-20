const SITE_CONFIG = {
  name: 'Teodor Toni',
  email: 'teodor.toni.dev@gmail.com',
  github: 'https://github.com/tonit82',
  linkedin: 'https://linkedin.com/in/teodor-t-89a4191a/',
  resumePath: 'assets/Teodor-Toni-Resume.pdf'
};

const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const themeToggle = document.querySelector('#theme-toggle');
const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');

function applyConfig() {
  document.querySelectorAll('[data-link="github"]').forEach((el) => {
    el.href = SITE_CONFIG.github;
  });
  document.querySelectorAll('[data-link="linkedin"]').forEach((el) => {
    el.href = SITE_CONFIG.linkedin;
  });
  document.querySelectorAll('[data-link="resume"]').forEach((el) => {
    el.href = SITE_CONFIG.resumePath;
  });
  document.querySelectorAll('[data-email]').forEach((el) => {
    el.href = `mailto:${SITE_CONFIG.email}`;
    if (el.hasAttribute('data-email-text')) {
      el.textContent = SITE_CONFIG.email;
    }
  });
}

function setupNavigation() {
  if (!menuToggle || !siteNav) return;
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteNav.classList.toggle('is-open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    });
  });
}

function setupTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    root.dataset.theme = stored;
  }

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
  });
}

function setupActiveSection() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isMatch = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', isMatch);
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));
}

function setupCopyEmail() {
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      copyStatus.textContent = 'Email copied to clipboard.';
    } catch {
      copyStatus.textContent = 'Unable to copy automatically. Please copy the email manually.';
    }
  });
}

applyConfig();
setupNavigation();
setupTheme();
setupActiveSection();
setupReveal();
setupCopyEmail();
