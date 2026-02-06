/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }
}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});

/* -----------------------------------------
  Navigation Scroll Effect (NOUVEAU)
 ---------------------------------------- */
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

/* -----------------------------------------
  CV Zoom functionality
 ---------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    const cvImage = document.getElementById('cv-image');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');
    
    if (cvImage && zoomInBtn && zoomOutBtn && resetZoomBtn) {
        let scale = 1;
        const scaleStep = 0.3;
        const maxScale = 3;
        const minScale = 1;
        
        // Zoom in
        zoomInBtn.addEventListener('click', function() {
            if (scale < maxScale) {
                scale += scaleStep;
                cvImage.style.transform = `scale(${scale})`;
                cvImage.classList.add('zoomed');
            }
        });
        
        // Zoom out
        zoomOutBtn.addEventListener('click', function() {
            if (scale > minScale) {
                scale -= scaleStep;
                cvImage.style.transform = `scale(${scale})`;
                if (scale === minScale) {
                    cvImage.classList.remove('zoomed');
                }
            }
        });
        
        // Reset zoom
        resetZoomBtn.addEventListener('click', function() {
            scale = 1;
            cvImage.style.transform = `scale(${scale})`;
            cvImage.classList.remove('zoomed');
        });
        
        // Click on image to toggle zoom
        cvImage.addEventListener('click', function() {
            if (scale === minScale) {
                scale = 2;
                cvImage.classList.add('zoomed');
            } else {
                scale = minScale;
                cvImage.classList.remove('zoomed');
            }
            cvImage.style.transform = `scale(${scale})`;
        });
    }

    /* -----------------------------------------
      Mobile Menu Toggle
     ---------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    /* -----------------------------------------
      Language Toggle
     ---------------------------------------- */
    const langToggle = document.getElementById('lang-toggle');
    const langFlag = document.querySelector('.lang-flag');
    const langText = document.querySelector('.lang-text');
    let currentLang = 'fr';

    // Function to change language
    function switchLanguage(lang) {
        currentLang = lang;
        
        // Update all elements with data-fr and data-en attributes
        document.querySelectorAll('[data-fr][data-en]').forEach(element => {
            if (lang === 'fr') {
                element.textContent = element.getAttribute('data-fr');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });

        // Update button
        if (lang === 'fr') {
            langFlag.textContent = '🇫🇷';
            langText.textContent = 'FR';
            document.documentElement.lang = 'fr';
        } else {
            langFlag.textContent = '🇬🇧';
            langText.textContent = 'EN';
            document.documentElement.lang = 'en';
        }

        // Save preference to localStorage
        localStorage.setItem('preferredLanguage', lang);
    }

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        switchLanguage(savedLang);
    }

    // Language toggle click event
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const newLang = currentLang === 'fr' ? 'en' : 'fr';
            switchLanguage(newLang);
        });
    }
});