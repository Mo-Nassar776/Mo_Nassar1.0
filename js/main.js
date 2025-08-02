

javascript
/**
 * Professional Website Script
 * Features: Back to top, Scroll reveal, Animated counters, 
 *           Responsive menu, Enhanced form submission
 */

document.addEventListener('DOMContentLoaded', function() {
  // ===== Constants =====
  const SCROLL_THRESHOLD = 300;
  const REVEAL_OFFSET = 150;
  const COUNTER_SPEED = 15;
  const COUNTER_INCREMENT_DIVISOR = 200;

  // ===== Back to Top Button =====
  function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = `
      <span class="arrow">↑</span>
      <span class="sr-only">Back to top</span>
    `;
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    function toggleVisibility() {
      backToTopBtn.style.display = window.scrollY > SCROLL_THRESHOLD ? 'block' : 'none';
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Throttled scroll event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(toggleVisibility, 50);
    });

    backToTopBtn.addEventListener('click', scrollToTop);
    toggleVisibility(); // Initial check
  }

  // ===== Scroll Reveal Effect =====
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    function checkVisibility() {
      const windowHeight = window.innerHeight;
      
      elements.forEach(function(el) {
        const elementTop = el.getBoundingClientRect().top;
        el.classList.toggle('active', elementTop < windowHeight - REVEAL_OFFSET);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      }, {
        threshold: 0.1,
        rootMargin: REVEAL_OFFSET + 'px 0px'
      });

      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      window.addEventListener('scroll', checkVisibility);
      checkVisibility();
    }
  }

  // ===== Animated Counters =====
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function animateCounter(element) {
      const target = +element.dataset.target;
      let current = 0;
      const increment = target / COUNTER_INCREMENT_DIVISOR;
      
      function update() {
        current += increment;
        if (current < target) {
          element.textContent = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          element.textContent = target;
        }
      }
      update();
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function(counter) {
        observer.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  // ===== Mobile Menu =====
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('nav ul');
    if (!toggle || !menu) return;

    function toggleMenu() {
      const isExpanded = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', isExpanded);
    }

    toggle.addEventListener('click', toggleMenu);
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Form Submission =====
  function initFormSubmission() {
    const form = document.querySelector('form');
    if (!form) return;

    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = 'notification ' + type;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(function() {
        notification.classList.add('fade-out');
        setTimeout(function() {
          notification.remove();
        }, 500);
      }, 3000);
    }

    async function handleSubmit(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.value;
      
      try {
        submitBtn.disabled = true;
        submitBtn.value = 'Sending...';
        
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showNotification('Message sent successfully!', 'success');
          form.reset();
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Submission failed');
        }
      } catch (err) {
        showNotification('Error: ' + err.message, 'error');
        console.error('Form error:', err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.value = originalText;
      }
    }

    form.addEventListener('submit', handleSubmit);
  }

  // Initialize all components
  initBackToTop();
  initScrollReveal();
  initCounters();
  initMobileMenu();
  initFormSubmission();
});
