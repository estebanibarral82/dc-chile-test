class WebsiteApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupAccordion();
    this.setupForm();
    this.setupSmoothScrolling();
    this.setupIntersectionObserver();
    this.setupVideoAutoplay();
    this.setupResponsiveHandlers();
    this.setupCarousel();
    this.setupLightbox();
  }

  // Carousel functionality - disabled for 3 static cases
  setupCarousel() {
    console.log('Carousel disabled - showing 3 static cases');
  }

  // Lightbox functionality
  setupLightbox() {
    // Create close function as a simple global function
    window.closeLightboxModal = function() {
      const lightbox = document.getElementById('lightbox');
      if (lightbox) {
        // Stop all media
        const videos = lightbox.querySelectorAll('video');
        const iframes = lightbox.querySelectorAll('iframe');
        
        videos.forEach(v => {
          v.pause();
          v.src = '';
        });
        
        iframes.forEach(i => {
          i.src = '';
        });
        
        // Remove video containers
        const containers = lightbox.querySelectorAll('.lightbox-video-container');
        containers.forEach(c => c.remove());
        
        // Hide lightbox
        lightbox.style.display = 'none';
        lightbox.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('Lightbox closed successfully');
      }
    };

    // Setup caso item clicks
    const casoItems = document.querySelectorAll('.caso-item');
    casoItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const videoUrl = item.dataset.video;
        const category = item.querySelector('.caso-category').textContent;
        const title = item.querySelector('.caso-title').textContent;
        const description = item.querySelector('.caso-description').textContent;
        
        this.showLightbox(videoUrl, category, title, description);
      });
    });

    // Setup close button
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', window.closeLightboxModal);
    }

    // Setup background click
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          window.closeLightboxModal();
        }
      });
    }

    // Setup escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeLightboxModal();
      }
    });
  }

  showLightbox(videoUrl, category, title, description) {
    const lightbox = document.getElementById('lightbox');
    const content = lightbox.querySelector('.lightbox-content');
    
    // Clear all existing content
    content.innerHTML = '';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Cerrar video');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = window.closeLightboxModal;
    
    // Create video element directly
    const youtubeId = this.extractYouTubeId(videoUrl);
    
    if (youtubeId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`;
      iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
      iframe.allowFullscreen = true;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      
      content.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      
      content.appendChild(video);
    }
    
    // Add close button on top
    content.appendChild(closeBtn);
    
    // Show lightbox
    lightbox.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.9) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 999999 !important;
      padding: 2rem !important;
    `;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Video-only lightbox opened');
  }

  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const menuBtn = document.getElementById('btn-menu');
    const closeBtn = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!menuBtn || !closeBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Enhanced Accordion Functionality
  setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion details');

    accordionItems.forEach(item => {
      const summary = item.querySelector('summary');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other accordion items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });

        // Toggle current item
        if (item.hasAttribute('open')) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', '');
        }
      });
    });
  }

  // Form Validation and Submission
  setupForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    const submitBtn = form.querySelector('.submit-btn');

    // Remove any existing event listeners that might interfere
    inputs.forEach(input => {
      // Clear any previous event listeners
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
      
      // Add validation events
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
      
      // Ensure inputs are focusable
      input.addEventListener('focus', (e) => {
        e.target.style.pointerEvents = 'auto';
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reset form
          form.reset();
          this.showSuccessMessage();
        } catch (error) {
          this.showErrorMessage();
        } finally {
          // Remove loading state
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  validateField(field) {
    const errorSpan = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else {
      // Specific validations
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
          }
          break;
      }
    }

    // Check required checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMessage = 'Debes aceptar este campo';
    }

    // Show/hide error
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      field.classList.toggle('error', !isValid);
    }

    return isValid;
  }

  clearError(field) {
    const errorSpan = field.nextElementSibling;
    if (errorSpan) {
      errorSpan.textContent = '';
      field.classList.remove('error');
    }
  }

  showSuccessMessage() {
    // You can implement a success message here
    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
  }

  showErrorMessage() {
    // You can implement an error message here
    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      '.intro, .accordion details, .video-container, .casos-grid, .contact-content'
    );

    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  }

  // Video Autoplay Functionality
  setupVideoAutoplay() {
    const video = document.querySelector('.reel-video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = this.isMobile ? 'metadata' : 'auto';

    const observerOptions = {
      threshold: this.isMobile ? 0.3 : 0.5,
      rootMargin: '0px'
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isSlowConnection()) {
            video.play().catch(error => {
              console.log('Video autoplay failed:', error);
            });
          }
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoObserver.observe(videoContainer);
    }

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  isSlowConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }
    return false;
  }

  // Responsive Handlers
  setupResponsiveHandlers() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile && !this.isMobile) {
      const mobileMenu = document.getElementById('mobile-menu');
      const btnMenu = document.getElementById('btn-menu');
      
      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        btnMenu?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    this.adjustVideoHeight();
  }
  
  handleOrientationChange() {
    this.adjustVideoHeight();
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu?.classList.contains('active')) {
      window.scrollTo(0, 0);
    }
  }
  
  adjustVideoHeight() {
    const video = document.querySelector('.reel-video');
    const container = document.querySelector('.video-container');
    
    if (video && container) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile && isLandscape) {
        container.style.height = '100vh';
      } else if (isMobile) {
        container.style.height = window.innerWidth <= 480 ? '50vh' : '60vh';
      } else {
        container.style.height = '100vh';
      }
    }
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const menuBtn = document.getElementById('btn-menu');
    const closeBtn = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!menuBtn || !closeBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Enhanced Accordion Functionality
  setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion details');

    accordionItems.forEach(item => {
      const summary = item.querySelector('summary');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other accordion items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });

        // Toggle current item
        if (item.hasAttribute('open')) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', '');
        }
      });
    });
  }

  // Form Validation and Submission
  setupForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    const submitBtn = form.querySelector('.submit-btn');

    // Remove any existing event listeners that might interfere
    inputs.forEach(input => {
      // Clear any previous event listeners
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
      
      // Add validation events
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
      
      // Ensure inputs are focusable
      input.addEventListener('focus', (e) => {
        e.target.style.pointerEvents = 'auto';
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reset form
          form.reset();
          this.showSuccessMessage();
        } catch (error) {
          this.showErrorMessage();
        } finally {
          // Remove loading state
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  validateField(field) {
    const errorSpan = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else {
      // Specific validations
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
          }
          break;
      }
    }

    // Check required checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMessage = 'Debes aceptar este campo';
    }

    // Show/hide error
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      field.classList.toggle('error', !isValid);
    }

    return isValid;
  }

  clearError(field) {
    const errorSpan = field.nextElementSibling;
    if (errorSpan) {
      errorSpan.textContent = '';
      field.classList.remove('error');
    }
  }

  showSuccessMessage() {
    // You can implement a success message here
    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
  }

  showErrorMessage() {
    // You can implement an error message here
    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      '.intro, .accordion details, .video-container, .casos-grid, .contact-content'
    );

    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  }

  // Video Autoplay Functionality
  setupVideoAutoplay() {
    const video = document.querySelector('.reel-video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = this.isMobile ? 'metadata' : 'auto';

    const observerOptions = {
      threshold: this.isMobile ? 0.3 : 0.5,
      rootMargin: '0px'
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isSlowConnection()) {
            video.play().catch(error => {
              console.log('Video autoplay failed:', error);
            });
          }
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoObserver.observe(videoContainer);
    }

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  isSlowConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }
    return false;
  }

  // Responsive Handlers
  setupResponsiveHandlers() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile && !this.isMobile) {
      const mobileMenu = document.getElementById('mobile-menu');
      const btnMenu = document.getElementById('btn-menu');
      
      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        btnMenu?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    this.adjustVideoHeight();
  }
  
  handleOrientationChange() {
    this.adjustVideoHeight();
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu?.classList.contains('active')) {
      window.scrollTo(0, 0);
    }
  }
  
  adjustVideoHeight() {
    const video = document.querySelector('.reel-video');
    const container = document.querySelector('.video-container');
    
    if (video && container) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile && isLandscape) {
        container.style.height = '100vh';
      } else if (isMobile) {
        container.style.height = window.innerWidth <= 480 ? '50vh' : '60vh';
      } else {
        container.style.height = '100vh';
      }
    }
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const menuBtn = document.getElementById('btn-menu');
    const closeBtn = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!menuBtn || !closeBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Enhanced Accordion Functionality
  setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion details');

    accordionItems.forEach(item => {
      const summary = item.querySelector('summary');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other accordion items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });

        // Toggle current item
        if (item.hasAttribute('open')) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', '');
        }
      });
    });
  }

  // Form Validation and Submission
  setupForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    const submitBtn = form.querySelector('.submit-btn');

    // Remove any existing event listeners that might interfere
    inputs.forEach(input => {
      // Clear any previous event listeners
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
      
      // Add validation events
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
      
      // Ensure inputs are focusable
      input.addEventListener('focus', (e) => {
        e.target.style.pointerEvents = 'auto';
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reset form
          form.reset();
          this.showSuccessMessage();
        } catch (error) {
          this.showErrorMessage();
        } finally {
          // Remove loading state
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  validateField(field) {
    const errorSpan = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else {
      // Specific validations
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
          }
          break;
      }
    }

    // Check required checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMessage = 'Debes aceptar este campo';
    }

    // Show/hide error
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      field.classList.toggle('error', !isValid);
    }

    return isValid;
  }

  clearError(field) {
    const errorSpan = field.nextElementSibling;
    if (errorSpan) {
      errorSpan.textContent = '';
      field.classList.remove('error');
    }
  }

  showSuccessMessage() {
    // You can implement a success message here
    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
  }

  showErrorMessage() {
    // You can implement an error message here
    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      '.intro, .accordion details, .video-container, .casos-grid, .contact-content'
    );

    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  }

  // Video Autoplay Functionality
  setupVideoAutoplay() {
    const video = document.querySelector('.reel-video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = this.isMobile ? 'metadata' : 'auto';

    const observerOptions = {
      threshold: this.isMobile ? 0.3 : 0.5,
      rootMargin: '0px'
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isSlowConnection()) {
            video.play().catch(error => {
              console.log('Video autoplay failed:', error);
            });
          }
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoObserver.observe(videoContainer);
    }

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  isSlowConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }
    return false;
  }

  // Responsive Handlers
  setupResponsiveHandlers() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile && !this.isMobile) {
      const mobileMenu = document.getElementById('mobile-menu');
      const btnMenu = document.getElementById('btn-menu');
      
      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        btnMenu?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    this.adjustVideoHeight();
  }
  
  handleOrientationChange() {
    this.adjustVideoHeight();
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu?.classList.contains('active')) {
      window.scrollTo(0, 0);
    }
  }
  
  adjustVideoHeight() {
    const video = document.querySelector('.reel-video');
    const container = document.querySelector('.video-container');
    
    if (video && container) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile && isLandscape) {
        container.style.height = '100vh';
      } else if (isMobile) {
        container.style.height = window.innerWidth <= 480 ? '50vh' : '60vh';
      } else {
        container.style.height = '100vh';
      }
    }
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const menuBtn = document.getElementById('btn-menu');
    const closeBtn = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!menuBtn || !closeBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Enhanced Accordion Functionality
  setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion details');

    accordionItems.forEach(item => {
      const summary = item.querySelector('summary');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other accordion items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });

        // Toggle current item
        if (item.hasAttribute('open')) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', '');
        }
      });
    });
  }

  // Form Validation and Submission
  setupForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    const submitBtn = form.querySelector('.submit-btn');

    // Remove any existing event listeners that might interfere
    inputs.forEach(input => {
      // Clear any previous event listeners
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
      
      // Add validation events
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
      
      // Ensure inputs are focusable
      input.addEventListener('focus', (e) => {
        e.target.style.pointerEvents = 'auto';
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reset form
          form.reset();
          this.showSuccessMessage();
        } catch (error) {
          this.showErrorMessage();
        } finally {
          // Remove loading state
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  validateField(field) {
    const errorSpan = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else {
      // Specific validations
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
          }
          break;
      }
    }

    // Check required checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMessage = 'Debes aceptar este campo';
    }

    // Show/hide error
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      field.classList.toggle('error', !isValid);
    }

    return isValid;
  }

  clearError(field) {
    const errorSpan = field.nextElementSibling;
    if (errorSpan) {
      errorSpan.textContent = '';
      field.classList.remove('error');
    }
  }

  showSuccessMessage() {
    // You can implement a success message here
    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
  }

  showErrorMessage() {
    // You can implement an error message here
    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      '.intro, .accordion details, .video-container, .casos-grid, .contact-content'
    );

    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  }

  // Video Autoplay Functionality
  setupVideoAutoplay() {
    const video = document.querySelector('.reel-video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = this.isMobile ? 'metadata' : 'auto';

    const observerOptions = {
      threshold: this.isMobile ? 0.3 : 0.5,
      rootMargin: '0px'
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isSlowConnection()) {
            video.play().catch(error => {
              console.log('Video autoplay failed:', error);
            });
          }
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoObserver.observe(videoContainer);
    }

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  isSlowConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }
    return false;
  }

  // Responsive Handlers
  setupResponsiveHandlers() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile && !this.isMobile) {
      const mobileMenu = document.getElementById('mobile-menu');
      const btnMenu = document.getElementById('btn-menu');
      
      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        btnMenu?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    this.adjustVideoHeight();
  }
  
  handleOrientationChange() {
    this.adjustVideoHeight();
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu?.classList.contains('active')) {
      window.scrollTo(0, 0);
    }
  }
  
  adjustVideoHeight() {
    const video = document.querySelector('.reel-video');
    const container = document.querySelector('.video-container');
    
    if (video && container) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile && isLandscape) {
        container.style.height = '100vh';
      } else if (isMobile) {
        container.style.height = window.innerWidth <= 480 ? '50vh' : '60vh';
      } else {
        container.style.height = '100vh';
      }
    }
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const menuBtn = document.getElementById('btn-menu');
    const closeBtn = document.getElementById('btn-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!menuBtn || !closeBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Enhanced Accordion Functionality
  setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion details');

    accordionItems.forEach(item => {
      const summary = item.querySelector('summary');
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other accordion items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });

        // Toggle current item
        if (item.hasAttribute('open')) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', '');
        }
      });
    });
  }

  // Form Validation and Submission
  setupForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    const submitBtn = form.querySelector('.submit-btn');

    // Remove any existing event listeners that might interfere
    inputs.forEach(input => {
      // Clear any previous event listeners
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
      
      // Add validation events
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
      
      // Ensure inputs are focusable
      input.addEventListener('focus', (e) => {
        e.target.style.pointerEvents = 'auto';
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Reset form
          form.reset();
          this.showSuccessMessage();
        } catch (error) {
          this.showErrorMessage();
        } finally {
          // Remove loading state
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  validateField(field) {
    const errorSpan = field.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    } else {
      // Specific validations
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
          }
          break;
        case 'tel':
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un teléfono válido';
          }
          break;
      }
    }

    // Check required checkboxes
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
      isValid = false;
      errorMessage = 'Debes aceptar este campo';
    }

    // Show/hide error
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      field.classList.toggle('error', !isValid);
    }

    return isValid;
  }

  clearError(field) {
    const errorSpan = field.nextElementSibling;
    if (errorSpan) {
      errorSpan.textContent = '';
      field.classList.remove('error');
    }
  }

  showSuccessMessage() {
    // You can implement a success message here
    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
  }

  showErrorMessage() {
    // You can implement an error message here
    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
  }

  // Smooth Scrolling for Anchor Links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
      '.intro, .accordion details, .video-container, .casos-grid, .contact-content'
    );

    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  }

  // Video Autoplay Functionality
  setupVideoAutoplay() {
    const video = document.querySelector('.reel-video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = this.isMobile ? 'metadata' : 'auto';

    const observerOptions = {
      threshold: this.isMobile ? 0.3 : 0.5,
      rootMargin: '0px'
    };

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isSlowConnection()) {
            video.play().catch(error => {
              console.log('Video autoplay failed:', error);
            });
          }
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoObserver.observe(videoContainer);
    }

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  }

  isSlowConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    }
    return false;
  }

  // Responsive Handlers
  setupResponsiveHandlers() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile && !this.isMobile) {
      const mobileMenu = document.getElementById('mobile-menu');
      const btnMenu = document.getElementById('btn-menu');
      
      if (mobileMenu?.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        btnMenu?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    this.adjustVideoHeight();
  }
  
  handleOrientationChange() {
    this.adjustVideoHeight();
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu?.classList.contains('active')) {
      window.scrollTo(0, 0);
    }
  }
  
  adjustVideoHeight() {
    const video = document.querySelector('.reel-video');
    const container = document.querySelector('.video-container');
    
    if (video && container) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile && isLandscape) {
        container.style.height = '100vh';
      } else if (isMobile) {
        container.style.height = window.innerWidth <= 480 ? '50vh' : '60vh';
      } else {
        container.style.height = '100vh';
      }
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new WebsiteApp();
});
