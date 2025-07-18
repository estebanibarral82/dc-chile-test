class WebsiteApp {
  constructor() {
    this.youtubePlayer = null;
    this.isVideoInView = false;
    this.toastContainer = null;
    this.loadingOverlay = null;
    this.intersectionObserver = null;
    this.retryAttempts = new Map();
    this.init();
  }

  init() {
    this.addNoJSClass();
    this.createToastContainer();
    this.createLoadingOverlay();
    this.setupMobileMenu();
    this.setupAccordion();
    this.setupForm();
    this.setupSmoothScrolling();
    this.setupIntersectionObserver();
    this.setupYouTubePlayer();
    this.setupVideoAutoplay();
    this.setupResponsiveHandlers();
    this.setupCarousel();
    this.setupLightbox();
    this.setupLazyLoading();
    this.enhanceAccessibility();
    this.setupPerformanceOptimizations();
  }

  addNoJSClass() {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
  }

  // Toast notification system
  createToastContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.setAttribute('aria-live', 'polite');
    this.toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.toastContainer);
  }

  showToast(message, type = 'info', title = null, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '!',
      info: 'i'
    };

    const titles = {
      success: title || 'Éxito',
      error: title || 'Error',
      warning: title || 'Advertencia',
      info: title || 'Información'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Cerrar notificación">×</button>
    `;

    this.toastContainer.appendChild(toast);

    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove after duration
    const autoRemove = setTimeout(() => {
      this.removeToast(toast);
    }, duration);

    // Manual close
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoRemove);
      this.removeToast(toast);
    });

    return toast;
  }

  removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // Loading overlay system
  createLoadingOverlay() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.className = 'loading-overlay';
    this.loadingOverlay.innerHTML = `
      <div>
        <div class="loading-spinner"></div>
        <div class="loading-text">Cargando...</div>
      </div>
    `;
    document.body.appendChild(this.loadingOverlay);
  }

  showLoading(text = 'Cargando...') {
    const loadingText = this.loadingOverlay.querySelector('.loading-text');
    loadingText.textContent = text;
    this.loadingOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  hideLoading() {
    this.loadingOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Carousel functionality - disabled for 3 static cases
  setupCarousel() {
    console.log('Carousel disabled - showing 3 static cases');
  }

    // Lightbox functionality
  setupLightbox() {
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

    // Setup background click and escape key
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          this.closeLightbox();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
      }
    });
  }

  showLightbox(videoUrl, category, title, description) {
    const lightbox = document.getElementById('lightbox');
    const content = lightbox.querySelector('.lightbox-content');
    
    // Clear content but preserve close button structure
    content.innerHTML = `
      <button class="lightbox-close" aria-label="Cerrar video">&times;</button>
      <div class="lightbox-video-container"></div>
      <div class="lightbox-info">
        <div class="caso-category">${category}</div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
    `;
    
    const videoContainer = content.querySelector('.lightbox-video-container');
    const closeBtn = content.querySelector('.lightbox-close');
    
    // Setup close button
    closeBtn.addEventListener('click', () => {
      this.closeLightbox();
    });
    
    // Extract YouTube ID
    const youtubeId = this.extractYouTubeId(videoUrl);
    
    if (youtubeId) {
      // Create iframe for YouTube videos
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.className = 'lightbox-video';
      iframe.allowFullscreen = true;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      
      videoContainer.appendChild(iframe);
    } else {
      // Fallback for non-YouTube videos
      const video = document.createElement('video');
      video.src = videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.className = 'lightbox-video';
      
      videoContainer.appendChild(video);
    }
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    closeBtn.focus();
  }

  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      
      // Clear video content to stop playback
      const content = lightbox.querySelector('.lightbox-content');
      if (content) {
        const videoContainer = content.querySelector('.lightbox-video-container');
        if (videoContainer) {
          videoContainer.innerHTML = '';
        }
      }
    }
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
      menuBtn.classList.add('active');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      menuBtn.classList.remove('active');
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
        await this.submitForm(form, submitBtn);
      } else {
        this.showToast('Por favor, completa todos los campos requeridos correctamente.', 'error');
        this.announce('Formulario contiene errores. Por favor revisa los campos.');
      }
    });

    // Real-time validation feedback
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.length > 0) {
          this.validateField(input, true); // Silent validation
        }
      });
    });
  }

  async submitForm(form, submitBtn) {
    // Add loading state
    submitBtn.classList.add('loading', 'btn-loading-state');
    submitBtn.disabled = true;
    
    this.showLoading('Enviando mensaje...');

    try {
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Simulate API call with actual endpoint logic
      const response = await this.sendFormData(data);
      
      if (response.success) {
        // Reset form
        form.reset();
        this.clearAllErrors(form);
        this.showToast('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success', 'Éxito');
        this.announce('Mensaje enviado correctamente');
        
        // Track successful submission
        if (window.gtag) {
          gtag('event', 'form_submit', {
            'event_category': 'contact',
            'event_label': 'success'
          });
        }
      } else {
        throw new Error(response.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      this.handleFormError(error, form);
    } finally {
      this.hideLoading();
      submitBtn.classList.remove('loading', 'btn-loading-state');
      submitBtn.disabled = false;
    }
  }

  async sendFormData(data) {
    // This would be your actual form submission logic
    // For now, simulate different scenarios
    
    // Check if we're offline
    if (!navigator.onLine) {
      throw new Error('Sin conexión a internet. Por favor, verifica tu conexión y reintenta.');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Simulate different responses
    if (Math.random() < 0.1) { // 10% chance of error for testing
      throw new Error('Error del servidor. Por favor, reintenta en unos momentos.');
    }

    return { success: true };
  }

  handleFormError(error, form) {
    const retryKey = 'form-submission';
    const attempts = this.retryAttempts.get(retryKey) || 0;
    this.retryAttempts.set(retryKey, attempts + 1);

    let message = 'Hubo un error al enviar tu mensaje. ';
    
    if (error.message.includes('conexión')) {
      message += 'Verifica tu conexión a internet.';
    } else if (attempts < 2) {
      message += 'Reintentando automáticamente...';
      
      // Auto retry after 3 seconds
      setTimeout(() => {
        const submitBtn = form.querySelector('.submit-btn');
        this.submitForm(form, submitBtn);
      }, 3000);
    } else {
      message += 'Por favor, reintenta más tarde o contacta directamente.';
    }

    this.showToast(message, 'error', 'Error de envío');
    this.announce('Error al enviar mensaje');
    
    // Track error
    if (window.gtag) {
      gtag('event', 'form_error', {
        'event_category': 'contact',
        'event_label': error.message
      });
    }
  }

  clearAllErrors(form) {
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
      const errorMsg = group.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.style.opacity = '0';
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

  // Improved video autoplay setup with error handling
  setupVideoAutoplay() {
    const videos = document.querySelectorAll('video, iframe');
    
    videos.forEach(video => {
      if (video.tagName === 'IFRAME') {
        // Handle iframe loading errors
        video.addEventListener('error', () => {
          console.log('Video iframe failed to load');
          this.showVideoError(video);
        });
        
        // Add loading attribute for performance
        if (!video.hasAttribute('loading')) {
          video.setAttribute('loading', 'lazy');
        }
      }
    });
    
    // Intersection Observer for lazy loading videos
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
            videoObserver.unobserve(iframe);
          }
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    // Apply lazy loading to reel video
    const reelVideo = document.querySelector('.reel-video');
    if (reelVideo) {
      videoObserver.observe(reelVideo);
    }
  }

  showVideoError(videoElement) {
    const container = videoElement.parentElement;
    if (container && !container.querySelector('.video-error')) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'video-error';
      errorDiv.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #f5f5f5;
          color: #666;
          text-align: center;
          padding: 2rem;
        ">
          <div>
            <p>Error al cargar el video</p>
            <button onclick="location.reload()" style="
              margin-top: 1rem;
              padding: 0.5rem 1rem;
              background: var(--pink);
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">
              Reintentar
            </button>
          </div>
        </div>
      `;
      container.appendChild(errorDiv);
      videoElement.style.display = 'none';
    }
  }

  // YouTube Player setup with scroll-triggered autoplay
  setupYouTubePlayer() {
    // Wait for YouTube API to load
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      // If YouTube API isn't loaded yet, wait for it
      window.onYouTubeIframeAPIReady = () => {
        this.initializeYouTubePlayer();
      };
    } else {
      this.initializeYouTubePlayer();
    }
  }

  initializeYouTubePlayer() {
    const playerElement = document.getElementById('youtube-player');
    if (!playerElement) return;

    this.youtubePlayer = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: 'zoSeLSEFUrQ',
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        playsinline: 1,
        enablejsapi: 1
      },
      events: {
        onReady: (event) => {
          console.log('YouTube player ready');
          this.setupVideoScrollTrigger();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            console.log('Video started playing');
          } else if (event.data === YT.PlayerState.PAUSED) {
            console.log('Video paused');
          }
        },
        onError: (event) => {
          console.error('YouTube player error:', event.data);
          this.handleVideoError();
        }
      }
    });
  }

  setupVideoScrollTrigger() {
    const reelSection = document.getElementById('reel');
    if (!reelSection || !this.youtubePlayer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Video section is in view
          if (!this.isVideoInView) {
            this.isVideoInView = true;
            try {
              this.youtubePlayer.playVideo();
              console.log('Video autoplay triggered by scroll');
            } catch (error) {
              console.error('Error playing video:', error);
            }
          }
        } else {
          // Video section is out of view
          if (this.isVideoInView) {
            this.isVideoInView = false;
            try {
              this.youtubePlayer.pauseVideo();
              console.log('Video paused - out of view');
            } catch (error) {
              console.error('Error pausing video:', error);
            }
          }
        }
      });
    }, {
      threshold: 0.5, // Trigger when 50% of the video section is visible
      rootMargin: '-10% 0px' // Add some margin to trigger slightly before/after
    });

    observer.observe(reelSection);
  }

  handleVideoError() {
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer && !videoContainer.querySelector('.video-error')) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'video-error';
      errorDiv.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #000;
          color: #fff;
          text-align: center;
          padding: 2rem;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
        ">
          <div>
            <h3 style="margin-bottom: 1rem;">Error al cargar el video</h3>
            <p style="margin-bottom: 1rem;">No se pudo cargar el video de YouTube</p>
            <button onclick="location.reload()" style="
              padding: 0.5rem 1rem;
              background: var(--pink);
              border: none;
              border-radius: 4px;
              color: white;
              cursor: pointer;
              font-family: inherit;
            ">
              Reintentar
            </button>
          </div>
        </div>
      `;
      videoContainer.appendChild(errorDiv);
    }
  }

  // Lazy loading system
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img);
      });
    }
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.classList.add('image-loading');
    
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.classList.remove('image-loading');
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
    
    tempImg.onerror = () => {
      img.classList.remove('image-loading');
      this.showImageError(img);
    };
    
    tempImg.src = src;
  }

  showImageError(img) {
    const container = img.parentNode;
    const errorState = document.createElement('div');
    errorState.className = 'error-state';
    errorState.innerHTML = `
      <div class="error-icon">⚠</div>
      <div class="error-title">Error al cargar imagen</div>
      <div class="error-message">No se pudo cargar la imagen. Verifica tu conexión.</div>
      <button class="error-retry" onclick="location.reload()">Reintentar</button>
    `;
    
    container.replaceChild(errorState, img);
  }

  // Enhanced accessibility
  enhanceAccessibility() {
    // Add skip links if not present
    if (!document.querySelector('.skip-links')) {
      const skipLinks = document.createElement('div');
      skipLinks.className = 'skip-links';
      skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Ir al contenido principal</a>
        <a href="#contact" class="skip-link">Ir al formulario de contacto</a>
      `;
      document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    // Enhance focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });

    // Add ARIA labels to interactive elements without them
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
      if (!btn.textContent.trim()) {
        btn.setAttribute('aria-label', 'Botón');
      }
    });

    // Announce page navigation for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);
    this.announcer = announcer;
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
    }
  }

  // Performance optimizations
  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Setup performance monitoring
    this.monitorPerformance();
    
    // Optimize animations
    this.optimizeAnimations();
    
    // Setup network error handling
    this.setupNetworkErrorHandling();
  }

  preloadCriticalResources() {
    // Preload hero video poster
    const heroVideo = document.querySelector('.reel-video');
    if (heroVideo && heroVideo.poster) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroVideo.poster;
      document.head.appendChild(link);
    }

    // Preload critical fonts
    const fontFiles = [
      '/assets/fonts/StabilGrotesk-Black.otf',
      '/assets/fonts/StabilGrotesk-Regular.otf'
    ];

    fontFiles.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/otf';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  }

  monitorPerformance() {
    // Monitor network quality
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Reduce animation and heavy features for slow connections
        document.body.classList.add('slow-connection');
        this.showToast('Conexión lenta detectada. Algunas funciones pueden estar limitadas.', 'warning');
      }
    }

    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with a monitoring service
      console.log('Performance monitoring active');
    }
  }

  optimizeAnimations() {
    // Add will-change to elements that will animate
    const animatedElements = document.querySelectorAll('.fade-in-up, .carousel-btn, .hamburger');
    animatedElements.forEach(el => {
      el.classList.add('will-animate');
    });

    // Remove will-change after animation
    document.addEventListener('animationend', (e) => {
      e.target.classList.remove('will-animate');
    });

    // GPU acceleration for smooth animations
    document.querySelectorAll('.mobile-menu, .lightbox, .toast').forEach(el => {
      el.classList.add('gpu-accelerated');
    });
  }

  setupNetworkErrorHandling() {
    // Handle offline status
    window.addEventListener('online', () => {
      this.showToast('Conexión restaurada', 'success');
      this.retryFailedRequests();
    });

    window.addEventListener('offline', () => {
      this.showToast('Sin conexión a internet', 'warning', null, 0);
    });

    // Setup service worker for caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
      });
    }
  }

  retryFailedRequests() {
    // Retry any failed form submissions or API calls
    this.retryAttempts.forEach((attempts, key) => {
      if (attempts < 3) {
        // Implement retry logic based on the key
        console.log(`Retrying ${key}, attempt ${attempts + 1}`);
      }
    });
  }
}

// Global YouTube API Ready function
window.onYouTubeIframeAPIReady = function() {
  if (window.websiteApp && window.websiteApp.initializeYouTubePlayer) {
    window.websiteApp.initializeYouTubePlayer();
  }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  window.websiteApp = new WebsiteApp();
});
