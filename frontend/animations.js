// Enhanced animations and interactions for Smart Vendor

// Dark mode functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  // Always default to light theme for all pages
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Add rotation animation
      themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 300);
    });
  }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Add animation classes to elements
  document.querySelectorAll('.card, .feature-card, .step-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    animateOnScroll.observe(el);
  });
}

// Enhanced button ripple effect
function addRippleEffect() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Smooth navbar hide/show on scroll
function initNavbarScroll() {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// Enhanced card parallax effect
function initParallaxCards() {
  // Skip parallax for specific pages
  const skipParallaxPages = [
    'rawmaterials', 
    'vendor-dashboard', 
    'sales-analytics'
  ];
  
  const currentPage = window.location.pathname;
  const shouldSkip = skipParallaxPages.some(page => currentPage.includes(page));
  
  if (shouldSkip) {
    return;
  }
  
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollAnimations();
  addRippleEffect();
  initNavbarScroll();
  initParallaxCards();
});

// Add floating animation to hero elements
function initFloatingAnimation() {
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle');
  
  heroElements.forEach((element, index) => {
    element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
  });
}

// Initialize floating animations after a delay
setTimeout(initFloatingAnimation, 1000);
