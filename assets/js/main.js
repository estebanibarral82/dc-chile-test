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
    this.setupCacheManagement();
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

  // Cache Management for Development
  setupCacheManagement() {
    // Check for updates every 5 minutes
    setInterval(() => this.checkForUpdates(), 5 * 60 * 1000);
    
    // Clear cache on page load if in development
    if (this.isDevelopment()) {
      this.clearBrowserCache();
    }
    
    // Register service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.showToast('¡Sitio actualizado! Recargando...', 'info', 'Actualización');
        setTimeout(() => window.location.reload(), 1500);
      });
    }
  }

  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('github.io');
  }

  clearBrowserCache() {
    // Clear various browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('dc-chile')) {
            caches.delete(name);
            console.log('🗑️ Cleared cache:', name);
          }
        });
      });
    }

    // Force reload stylesheets with new timestamp
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      const href = link.href;
      if (href.includes('main.css')) {
        const newHref = href.split('?')[0] + '?v=' + Date.now();
        link.href = newHref;
        console.log('🔄 Reloaded stylesheet:', newHref);
      }
    });
  }

  checkForUpdates() {
    // Check if there's a new version by trying to fetch index.html
    fetch(window.location.href, { 
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .then(response => response.text())
    .then(html => {
      // Check if the HTML has changed by looking for version markers
      const currentVersion = document.querySelector('link[href*="main.css"]')?.href;
      const match = html.match(/main\.css\?v=([^"]*)/);
      const newVersion = match ? match[1] : null;
      
      if (newVersion && currentVersion && !currentVersion.includes(newVersion)) {
        this.showToast(
          'Hay una nueva versión disponible. Haz clic para actualizar.', 
          'info', 
          'Actualización disponible'
        );
        
        // Auto-reload after 3 seconds
        setTimeout(() => {
          window.location.reload(true);
        }, 3000);
      }
    })
    .catch(error => {
      console.log('No se pudo verificar actualizaciones:', error);
    });
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

  // Responsive handlers for mobile/desktop differences
  setupResponsiveHandlers() {
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateResponsiveElements();
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Initial setup
    this.updateResponsiveElements();
  }
  
  updateResponsiveElements() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // Update mobile menu behavior
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
      if (!isMobile && mobileMenu.classList.contains('active')) {
        // Close mobile menu on desktop
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    // Update video player sizing
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer && this.youtubePlayer) {
      if (isMobile) {
        videoContainer.style.paddingBottom = '50vh';
      } else {
        videoContainer.style.paddingBottom = '56.25%';
      }
    }
    
    // Update lightbox sizing for mobile
    const lightboxContent = document.querySelector('.lightbox-content');
    if (lightboxContent) {
      if (isMobile) {
        lightboxContent.style.width = '95vw';
        lightboxContent.style.height = '85vh';
      } else {
        lightboxContent.style.width = '90vw';
        lightboxContent.style.height = '80vh';
      }
    }
  }

  // Carousel functionality - disabled for 3 static cases
  setupCarousel() {
    console.log('Configurando carousel...');
    
    const track = document.getElementById('casos-track');
    const items = document.querySelectorAll('.caso-item');
    
    if (!track || items.length === 0) {
      console.log('No se encontró el carousel o no hay items');
      return;
    }
    
    let currentIndex = 0;
    let isTransitioning = false;
    const totalItems = items.length;
    
    // Función para actualizar la posición del carousel
    const updateCarousel = () => {
      if (isTransitioning) return;
      
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      
      let itemWidth, visibleItems;
      
      if (isMobile) {
        itemWidth = 100; // 100vw per item on mobile
        visibleItems = 1;
      } else if (isTablet) {
        itemWidth = 50; // 50vw per item on tablet
        visibleItems = 2;
      } else {
        itemWidth = 33.333333; // 33.33vw per item on desktop
        visibleItems = 3;
      }
      
      const offset = -(currentIndex * itemWidth);
      track.style.transform = `translateX(${offset}vw)`;
      
      console.log(`Carousel actualizado - Index: ${currentIndex}, Offset: ${offset}vw`);
    };
    
    // Funciones de navegación
    const nextSlide = () => {
      if (isTransitioning) return;
      
      const isMobile = window.innerWidth <= 768;
      const maxIndex = isMobile ? totalItems - 1 : totalItems - 3;
      
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop back to start
      }
      
      updateCarousel();
    };
    
    const prevSlide = () => {
      if (isTransitioning) return;
      
      const isMobile = window.innerWidth <= 768;
      const maxIndex = isMobile ? totalItems - 1 : totalItems - 3;
      
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex; // Loop to end
      }
      
      updateCarousel();
    };
    
    // Crear controles del carousel
    const createControls = () => {
      const carousel = document.querySelector('.casos-carousel');
      if (!carousel) return;
      
      // Remover controles existentes
      const existingControls = carousel.querySelector('.carousel-controls');
      if (existingControls) existingControls.remove();
      
      const controls = document.createElement('div');
      controls.className = 'carousel-controls';
      controls.innerHTML = `
        <button class="carousel-btn prev-btn" aria-label="Caso anterior">‹</button>
        <button class="carousel-btn next-btn" aria-label="Siguiente caso">›</button>
      `;
      
      carousel.appendChild(controls);
      
      // Event listeners para los controles
      const prevBtn = controls.querySelector('.prev-btn');
      const nextBtn = controls.querySelector('.next-btn');
      
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    };
    
    // Crear indicadores
    const createIndicators = () => {
      const carousel = document.querySelector('.casos-carousel');
      if (!carousel) return;
      
      // Remover indicadores existentes
      const existingIndicators = carousel.querySelector('.carousel-indicators');
      if (existingIndicators) existingIndicators.remove();
      
      const indicators = document.createElement('div');
      indicators.className = 'carousel-indicators';
      
      const isMobile = window.innerWidth <= 768;
      const totalIndicators = isMobile ? totalItems : totalItems - 2;
      
      for (let i = 0; i < totalIndicators; i++) {
        const indicator = document.createElement('button');
        indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
        indicator.setAttribute('aria-label', `Ir al caso ${i + 1}`);
        indicator.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          updateIndicators();
        });
        indicators.appendChild(indicator);
      }
      
      carousel.appendChild(indicators);
    };
    
    // Actualizar indicadores
    const updateIndicators = () => {
      const indicators = document.querySelectorAll('.carousel-indicator');
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    };
    
    // Soporte para gestos táctiles en móvil
    let startX = 0;
    let currentX = 0;
    let isDown = false;
    
    const handleTouchStart = (e) => {
      isDown = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      track.style.transition = 'none';
    };
    
    const handleTouchMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      
      currentX = e.touches ? e.touches[0].clientX : e.clientX;
      const diffX = currentX - startX;
      
      // Aplicar transformación temporal
      const currentOffset = -(currentIndex * (window.innerWidth <= 768 ? 100 : 33.333333));
      const newOffset = currentOffset + (diffX / window.innerWidth) * 100;
      track.style.transform = `translateX(${newOffset}vw)`;
    };
    
    const handleTouchEnd = () => {
      if (!isDown) return;
      isDown = false;
      
      track.style.transition = 'transform 0.5s ease';
      
      const diffX = currentX - startX;
      const threshold = window.innerWidth * 0.2; // 20% del ancho de pantalla
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      } else {
        updateCarousel(); // Volver a la posición original
      }
      
      updateIndicators();
    };
    
    // Event listeners para touch
    if (track) {
      track.addEventListener('touchstart', handleTouchStart, { passive: false });
      track.addEventListener('touchmove', handleTouchMove, { passive: false });
      track.addEventListener('touchend', handleTouchEnd);
      
      // También para mouse en desktop
      track.addEventListener('mousedown', handleTouchStart);
      track.addEventListener('mousemove', handleTouchMove);
      track.addEventListener('mouseup', handleTouchEnd);
      track.addEventListener('mouseleave', handleTouchEnd);
    }
    
    // Manejar cambios de tamaño de ventana
    const handleResize = () => {
      currentIndex = 0; // Reset al primer slide
      updateCarousel();
      createIndicators();
      updateIndicators();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Inicializar
    createControls();
    createIndicators();
    updateCarousel();
    updateIndicators();
    
    // Auto-play opcional (deshabilitado por defecto)
    const autoPlay = false;
    if (autoPlay) {
      setInterval(() => {
        nextSlide();
        updateIndicators();
      }, 5000);
    }
    
    console.log('Carousel configurado correctamente');
  }

    // Lightbox functionality
  setupLightbox() {
    console.log('Configurando lightbox...');
    const casoItems = document.querySelectorAll('.caso-item');
    console.log('Casos encontrados:', casoItems.length);
    
    casoItems.forEach((item, index) => {
      console.log(`Configurando caso ${index + 1}:`, item.dataset.video);
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Caso clickeado:', item.dataset.video);
        
        const videoUrl = item.dataset.video;
        const category = item.querySelector('.caso-category')?.textContent || 'Video';
        const title = item.querySelector('.caso-title')?.textContent || 'Título';
        const description = item.querySelector('.caso-description')?.textContent || 'Descripción';
        
        console.log('Datos del caso:', { videoUrl, category, title, description });
        
        this.showLightbox(videoUrl, category, title, description);
      });
    });

    // Setup "Nuestro Trabajo" button
    const trabajoBtn = document.getElementById('trabajo-btn');
    if (trabajoBtn) {
      trabajoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Botón Nuestro Trabajo clickeado');
        
        this.showVideoOnlyLightbox('https://www.youtube.com/watch?v=zoSeLSEFUrQ&t=8s');
      });
    }

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
    console.log('Mostrando lightbox con:', { videoUrl, category, title, description });
    
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      console.error('Lightbox no encontrado!');
      return;
    }
    
    const content = lightbox.querySelector('.lightbox-content');
    if (!content) {
      console.error('Lightbox content no encontrado!');
      return;
    }
    
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
    
    // Remove video-only class if present
    content.classList.remove('video-only');
    
    const videoContainer = content.querySelector('.lightbox-video-container');
    const closeBtn = content.querySelector('.lightbox-close');
    
    // Setup close button
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Cerrando lightbox por botón');
      this.closeLightbox();
    });
    
    // Extract YouTube ID
    const youtubeId = this.extractYouTubeId(videoUrl);
    console.log('YouTube ID extraído:', youtubeId);
    
    if (youtubeId) {
      // Create iframe for YouTube videos
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.className = 'lightbox-video';
      iframe.allowFullscreen = true;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      
      videoContainer.appendChild(iframe);
      console.log('Iframe de YouTube creado');
    } else {
      // Fallback for non-YouTube videos
      const video = document.createElement('video');
      video.src = videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.className = 'lightbox-video';
      
      videoContainer.appendChild(video);
      console.log('Video HTML5 creado');
    }
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Lightbox mostrado');
    
    // Focus management for accessibility
    closeBtn.focus();
  }

  showVideoOnlyLightbox(videoUrl) {
    console.log('Mostrando lightbox solo con video:', videoUrl);
    
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      console.error('Lightbox no encontrado!');
      return;
    }
    
    const content = lightbox.querySelector('.lightbox-content');
    if (!content) {
      console.error('Lightbox content no encontrado!');
      return;
    }
    
    // Clear content and create video-only structure
    content.innerHTML = `
      <button class="lightbox-close" aria-label="Cerrar video">&times;</button>
      <div class="lightbox-video-container"></div>
    `;
    
    // Add video-only class for styling
    content.classList.add('video-only');
    
    const videoContainer = content.querySelector('.lightbox-video-container');
    const closeBtn = content.querySelector('.lightbox-close');
    
    // Setup close button
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Cerrando lightbox por botón');
      this.closeLightbox();
    });
    
    // Extract YouTube ID
    const youtubeId = this.extractYouTubeId(videoUrl);
    console.log('YouTube ID extraído:', youtubeId);
    
    if (youtubeId) {
      // Create iframe for YouTube videos with autoplay
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&fs=1&iv_load_policy=3`;
      iframe.className = 'lightbox-video';
      iframe.allowFullscreen = true;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      
      videoContainer.appendChild(iframe);
      console.log('Iframe de YouTube creado para video solo');
    } else {
      // Fallback for non-YouTube videos
      const video = document.createElement('video');
      video.src = videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.className = 'lightbox-video';
      
      videoContainer.appendChild(video);
      console.log('Video HTML5 creado');
    }
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Lightbox con video solo mostrado');
    
    // Focus management for accessibility
    closeBtn.focus();
  }

  closeLightbox() {
    console.log('Cerrando lightbox...');
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      
      // Clear video content to stop playback
      const content = lightbox.querySelector('.lightbox-content');
      if (content) {
        // Remove video-only class
        content.classList.remove('video-only');
        
        const videoContainer = content.querySelector('.lightbox-video-container');
        if (videoContainer) {
          // Stop videos and iframes
          const videos = videoContainer.querySelectorAll('video');
          const iframes = videoContainer.querySelectorAll('iframe');
          
          videos.forEach(v => {
            v.pause();
            v.src = '';
          });
          
          iframes.forEach(i => {
            i.src = '';
          });
          
          videoContainer.innerHTML = '';
          console.log('Contenido de video limpiado');
        }
      }
      console.log('Lightbox cerrado');
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
