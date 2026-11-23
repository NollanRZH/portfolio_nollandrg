'use strict';

/* -----------------------------------------
   Focus outline uniquement au clavier
   ----------------------------------------- */
const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce, { once: true });
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.addEventListener('keydown', handleFirstTab);
};

window.addEventListener('keydown', handleFirstTab);

/* -----------------------------------------
   Barre de progression & Back to Top
   ----------------------------------------- */
const backToTopButton = document.querySelector('.back-to-top');
const scrollProgressBar = document.getElementById('scroll-progress');
let scrollTicking = false;

const updateScrollEffects = () => {
  const scrollTop = window.scrollY || window.pageYOffset || 0;

  if (backToTopButton) {
    backToTopButton.classList.toggle('is-visible', scrollTop > 600);
  }

  if (scrollProgressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    scrollProgressBar.style.width = `${progress}%`;
  }

  scrollTicking = false;
};

window.addEventListener(
  'scroll',
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollEffects);
      scrollTicking = true;
    }
  },
  { passive: true }
);

/* -----------------------------------------
   Initialisation DOM
   ----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  updateScrollEffects();

  /* ---- Zoom CV ---- */
  const cvImage = document.getElementById('cv-image');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const resetZoomBtn = document.getElementById('reset-zoom');

  if (cvImage && zoomInBtn && zoomOutBtn && resetZoomBtn) {
    let scale = 1;
    const scaleStep = 0.25;
    const maxScale = 3;
    const minScale = 1;

    const applyScale = () => {
      cvImage.style.transform = `scale(${scale})`;
      cvImage.classList.toggle('zoomed', scale > 1);
      zoomOutBtn.disabled = scale <= minScale;
      zoomInBtn.disabled = scale >= maxScale;
    };

    applyScale();

    zoomInBtn.addEventListener('click', () => {
      scale = Math.min(maxScale, Number((scale + scaleStep).toFixed(2)));
      applyScale();
    });

    zoomOutBtn.addEventListener('click', () => {
      scale = Math.max(minScale, Number((scale - scaleStep).toFixed(2)));
      applyScale();
    });

    resetZoomBtn.addEventListener('click', () => {
      scale = minScale;
      applyScale();
    });

    cvImage.addEventListener('click', () => {
      scale = scale === minScale ? 2 : minScale;
      applyScale();
    });
  }

  /* ---- Menu Mobile ---- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    const closeMenu = ({ returnFocus = false } = {}) => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (returnFocus) {
        navToggle.focus();
      }
    };

    const openMenu = () => {
      navMenu.classList.add('active');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };

    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      const isClickInside =
        target instanceof Node && (navMenu.contains(target) || navToggle.contains(target));
      if (!isClickInside && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu({ returnFocus: true });
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ---- Changement de langue (FR / EN) ---- */
  const langToggle = document.getElementById('lang-toggle');
  const langFlag = document.querySelector('.lang-flag');
  const langText = document.querySelector('.lang-text');
  let currentLang = 'fr';
  let copyFeedbackTimeout = null;

  const applyTranslations = (lang) => {
    currentLang = lang === 'en' ? 'en' : 'fr';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-fr][data-en]').forEach((element) => {
      const value = element.getAttribute(`data-${currentLang}`);
      if (value === null) return;

      if (element.tagName === 'TITLE') {
        document.title = value;
      } else if (element.tagName === 'META') {
        element.setAttribute('content', value);
      } else {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-fr-label][data-en-label]').forEach((element) => {
      const label = element.getAttribute(
        currentLang === 'fr' ? 'data-fr-label' : 'data-en-label'
      );
      if (label) {
        element.setAttribute('aria-label', label);
      }
    });

    if (langFlag && langText) {
      if (currentLang === 'fr') {
        langFlag.textContent = '🇫🇷';
        langText.textContent = 'FR';
      } else {
        langFlag.textContent = '🇬🇧';
        langText.textContent = 'EN';
      }
    }

    try {
      localStorage.setItem('preferredLanguage', currentLang);
    } catch (_) {
      // Ignorer si le stockage local est indisponible
    }
  };

  let savedLang = null;
  try {
    savedLang = localStorage.getItem('preferredLanguage');
  } catch (_) {
    savedLang = null;
  }

  if (savedLang === 'fr' || savedLang === 'en') {
    applyTranslations(savedLang);
  } else {
    applyTranslations('fr');
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyTranslations(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

  /* ---- Bouton copier du terminal ---- */
  const terminalCopyBtn = document.getElementById('terminal-copy');
  const terminalBody = document.getElementById('terminal-output-box');

  if (terminalCopyBtn && terminalBody) {
    terminalCopyBtn.addEventListener('click', async () => {
      const lines = Array.from(terminalBody.querySelectorAll('.terminal__line'))
        .filter((line) => !line.classList.contains('terminal__cursor'))
        .map((line) => line.textContent.trim())
        .filter(Boolean);

      const textToCopy = lines.join('\n');
      if (!textToCopy) return;

      let copied = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          copied = true;
        }
      } catch (_) {
        copied = false;
      }

      if (!copied) {
        const helper = document.createElement('textarea');
        helper.value = textToCopy;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        try {
          copied = document.execCommand('copy');
        } catch (_) {
          copied = false;
        }
        document.body.removeChild(helper);
      }

      if (copied) {
        if (copyFeedbackTimeout) {
          window.clearTimeout(copyFeedbackTimeout);
        }
        const copiedLabel =
          terminalCopyBtn.getAttribute(
            currentLang === 'fr' ? 'data-copied-fr' : 'data-copied-en'
          ) || 'Copié ✓';
        const defaultLabel =
          terminalCopyBtn.getAttribute(`data-${currentLang}`) || 'Copier';

        terminalCopyBtn.textContent = copiedLabel;
        copyFeedbackTimeout = window.setTimeout(() => {
          terminalCopyBtn.textContent = defaultLabel;
        }, 1800);
      }
    });
  }
});