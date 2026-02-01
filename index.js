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
});