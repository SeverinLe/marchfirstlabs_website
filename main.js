// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  // Sticky header logic
  const header = document.getElementById('main-header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (window.scrollY > lastScrollY && window.scrollY > 200) {
        // Scrolling down
        header.classList.add('hidden');
      } else {
        // Scrolling up
        header.classList.remove('hidden');
      }
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
  });

  // Dark Mode Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function updateTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeIcon.textContent = 'light_mode';
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.textContent = 'dark_mode';
    }
  }

  if (themeToggle && themeIcon) {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateTheme(prefersDark);

    themeToggle.addEventListener('click', () => {
      const isDarkMode = document.body.classList.contains('dark-mode');
      updateTheme(!isDarkMode);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      updateTheme(e.matches);
    });
  }

  // Scroll Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Optional: animate only once
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-up, .fade-in-left');
  revealElements.forEach(el => observer.observe(el));

  // Dynamic Scroll Reveal Gradient
  const revealTexts = document.querySelectorAll('.reveal-text-gradient');
  if (revealTexts.length > 0) {
    const updateRevealTexts = () => {
      revealTexts.forEach(revealText => {
        const rect = revealText.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        
        const startReveal = windowHeight * 0.9;
        const endReveal = windowHeight / 2;
        
        let progress = 0;
        if (elementCenter > startReveal) {
          progress = 0;
        } else if (elementCenter <= endReveal) {
          progress = 100;
        } else {
          progress = 100 - ((elementCenter - endReveal) / (startReveal - endReveal)) * 100;
        }
        
        revealText.style.setProperty('--reveal-progress', `${progress}%`);
      });
    };

    window.addEventListener('scroll', updateRevealTexts);
    // Initialize immediately
    updateRevealTexts();
  }

  // Sticky Scroll Logic
  const scrollSteps = document.querySelectorAll('.scroll-step');
  const visualCards = document.querySelectorAll('.visual-card');

  if (scrollSteps.length > 0) {
    const stepObserverOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when step crosses the middle area of viewport
      threshold: 0
    };

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all
          scrollSteps.forEach(step => step.classList.remove('active'));
          visualCards.forEach(card => card.classList.remove('active'));

          // Add active class to current
          entry.target.classList.add('active');
          const stepId = entry.target.getAttribute('data-step');
          const correspondingCard = document.querySelector(`.visual-card[data-step="${stepId}"]`);
          if (correspondingCard) {
            correspondingCard.classList.add('active');
          }
        }
      });
    }, stepObserverOptions);

    scrollSteps.forEach(step => stepObserver.observe(step));
  }
});
