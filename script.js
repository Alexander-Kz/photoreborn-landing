document.addEventListener('DOMContentLoaded', () => {

    // Advanced Video Management System
    const preloader = document.getElementById('preloader');
    const heroVideo = document.querySelector('.hero-video');
    const telegramHandles = document.querySelectorAll('[data-telegram-handle]');
    
    const TELEGRAM_HANDLE = '@PhotoReborn_bot';

    const shouldHideTelegramHandles = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /android|iphone|ipad|ipod|windows phone|blackberry|mobile/i.test(userAgent);
        const isTouchOnlyDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        return isMobileUA || isTouchOnlyDevice;
    };

    function initTelegramHandles() {
        if (!telegramHandles.length) return;

        if (shouldHideTelegramHandles()) {
            telegramHandles.forEach(handle => handle.classList.add('telegram-inline-note--hidden'));
            return;
        }
    }

    // Fullscreen Video Manager
    class FullscreenVideoManager {
        constructor(videoElement) {
            this.video = videoElement;
            this.wrapper = videoElement.closest('.hero-video-wrapper');
            this.isFullscreen = false;
            this.isIOSDevice = this.detectIOS();
            this.setupFullscreenCapabilities();
        }
        
        // Детектирование iOS устройств
        detectIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        }
        
        setupFullscreenCapabilities() {
            if (!this.wrapper) return;
            
            // Create fullscreen button
            const fullscreenBtn = document.createElement('button');
            fullscreenBtn.className = 'video-fullscreen-trigger';
            fullscreenBtn.setAttribute('aria-label', 'Развернуть видео на весь экран');
            fullscreenBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
            `;
            
            this.wrapper.appendChild(fullscreenBtn);
            
            // Hover effects
            this.wrapper.addEventListener('mouseenter', () => {
                fullscreenBtn.style.opacity = '1';
            });
            
            this.wrapper.addEventListener('mouseleave', () => {
                if (!this.isFullscreen) {
                    fullscreenBtn.style.opacity = '0';
                }
            });
            
            // Click handlers
            this.wrapper.addEventListener('click', (e) => {
                if (e.target === this.wrapper || e.target === this.video) {
                    this.toggleFullscreen(e);
                }
            });
            
            fullscreenBtn.addEventListener('click', (e) => this.toggleFullscreen(e));
            
            // Fullscreen change listener
            document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
            
            // Специальные события для iOS
            if (this.isIOSDevice) {
                this.video.addEventListener('webkitbeginfullscreen', () => {
                    this.isFullscreen = true;
                    this.wrapper.classList.add('fullscreen-active');
                    console.log('🎬 iOS fullscreen начался');
                });
                
                this.video.addEventListener('webkitendfullscreen', () => {
                    this.isFullscreen = false;
                    this.wrapper.classList.remove('fullscreen-active');
                    console.log('🎬 iOS fullscreen завершился');
                });
            }
        }
        
        async toggleFullscreen(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (!this.isFullscreen) {
                try {
                    await this.enterFullscreen();
                } catch (err) {
                    console.warn('Fullscreen не поддерживается:', err);
                }
            } else {
                await this.exitFullscreen();
            }
        }
        
        async enterFullscreen() {
            try {
                // КРИТИЧНО: iOS требует webkitEnterFullScreen на video элементе
                if (this.isIOSDevice && this.video.webkitEnterFullScreen) {
                    // Проверяем поддержку перед вызовом
                    if (typeof this.video.webkitSupportsFullscreen === 'undefined' || this.video.webkitSupportsFullscreen) {
                        this.video.webkitEnterFullScreen();
                        this.isFullscreen = true;
                        this.wrapper.classList.add('fullscreen-active');
                        console.log('🎬 iOS Fullscreen режим активирован');
                    } else {
                        throw new Error('iOS fullscreen не поддерживается для этого видео');
                    }
                }
                // Стандартный Fullscreen API для других браузеров
                else if (this.wrapper.requestFullscreen) {
                    await this.wrapper.requestFullscreen();
                    this.isFullscreen = true;
                    this.wrapper.classList.add('fullscreen-active');
                    console.log('🎬 Fullscreen режим активирован');
                } else if (this.wrapper.webkitRequestFullscreen) {
                    await this.wrapper.webkitRequestFullscreen();
                    this.isFullscreen = true;
                    this.wrapper.classList.add('fullscreen-active');
                    console.log('🎬 Fullscreen режим активирован');
                } else if (this.wrapper.mozRequestFullScreen) {
                    await this.wrapper.mozRequestFullScreen();
                    this.isFullscreen = true;
                    this.wrapper.classList.add('fullscreen-active');
                    console.log('🎬 Fullscreen режим активирован');
                } else if (this.wrapper.msRequestFullscreen) {
                    await this.wrapper.msRequestFullscreen();
                    this.isFullscreen = true;
                    this.wrapper.classList.add('fullscreen-active');
                    console.log('🎬 Fullscreen режим активирован');
                } else {
                    throw new Error('Fullscreen не поддерживается');
                }
            } catch (err) {
                console.error('Ошибка входа в fullscreen:', err);
            }
        }
        
        async exitFullscreen() {
            try {
                // На iOS выход из fullscreen происходит автоматически при взаимодействии пользователя
                if (this.isIOSDevice && this.video.webkitExitFullScreen) {
                    try {
                        this.video.webkitExitFullScreen();
                    } catch (err) {
                        // Игнорируем ошибку - пользователь выйдет сам кнопкой Done
                        console.log('iOS fullscreen выход через системную кнопку');
                    }
                } else {
                    // Стандартные методы выхода для других браузеров
                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        await document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        await document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        await document.msExitFullscreen();
                    }
                }
            } catch (err) {
                console.error('Ошибка выхода из fullscreen:', err);
            }
        }
        
        handleFullscreenChange() {
            // Проверяем различные способы определения fullscreen состояния
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                // Для iOS используем другую проверку
                (this.isIOSDevice && this.video.webkitDisplayingFullscreen)
            );
            
            if (!isCurrentlyFullscreen) {
                this.isFullscreen = false;
                this.wrapper.classList.remove('fullscreen-active');
                console.log('🎬 Fullscreen режим деактивирован');
            }
        }
    }
    
    // Video optimization manager
    class VideoOptimizer {
        constructor(videoElement) {
            this.video = videoElement;
            this.isInitialized = false;
            this.currentQuality = 'light';
            this.hdPreloaded = false;
            this.autoplayAttempted = false;
            this.wasPlayingBeforeHidden = false;
            this.lowPowerMode = false;
            
            // Initialize performance monitor
            this.perfMonitor = window.VideoPerformanceMonitor ? new VideoPerformanceMonitor() : null;
            
            this.init();
        }
        
        init() {
            if (!this.video || this.isInitialized) return;
            
            // Device and connection detection
            this.deviceInfo = this.getDeviceInfo();
            this.connectionInfo = this.getConnectionInfo();
            
            // Check for low power and data saver modes
            this.optimizeForLowPower();
            this.optimizeForDataSaver();
            
            // Set optimal initial video source
            this.setOptimalVideoSource();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup video recovery system для Safari iOS
            this.setupVideoRecovery();
            
            this.isInitialized = true;
        }
        
        getDeviceInfo() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const pixelRatio = window.devicePixelRatio || 1;
            const isMobile = width <= 768;
            const isTablet = width > 768 && width <= 1024;
            const isHighDPI = pixelRatio > 1.5;
            
            return {
                width,
                height,
                pixelRatio,
                isMobile,
                isTablet,
                isHighDPI,
                supportsWebM: this.video.canPlayType('video/webm') !== '',
                isSlowDevice: navigator.hardwareConcurrency < 4
            };
        }
        
        getConnectionInfo() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const saveData = navigator.connection?.saveData;
            
            return {
                effectiveType: connection?.effectiveType || '4g',
                downlink: connection?.downlink || 10,
                saveData: saveData || false,
                isSlow: connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g' || saveData
            };
        }
        
        setOptimalVideoSource() {
            const { isMobile, supportsWebM } = this.deviceInfo;
            const { isSlow } = this.connectionInfo;
            
            // Always start with light version for fast loading
            let videoSrc;
            
            if (supportsWebM) {
                videoSrc = this.video.dataset.lightWebm;
            } else {
                videoSrc = this.video.dataset.lightMp4;
            }
            
            // Preload strategy: metadata first, then auto
            this.video.preload = 'metadata';
            this.video.src = videoSrc;
            this.updateQualityIndicator('light');
            
            console.log(`📱 Устройство: ${isMobile ? 'Мобильное' : 'Десктоп'}, WebM: ${supportsWebM ? 'Да' : 'Нет'}, Соединение: ${this.connectionInfo.effectiveType}`);
            console.log(`🎬 Загружаю: ${videoSrc}`);
        }
        
        setupEventListeners() {
            // Show loading indicator initially
            this.showLoadingIndicator();
            
            // When metadata is loaded, start playing immediately
            this.video.addEventListener('loadedmetadata', () => {
                this.video.preload = 'auto';
                this.attemptAutoplay();
            });
            
            // When enough data is loaded, attempt play
            this.video.addEventListener('canplay', () => {
                this.hideLoadingIndicator();
                if (!this.autoplayAttempted) {
                    this.attemptAutoplay();
                }
            });
            
            // When can play through, preload HD if conditions are met
            this.video.addEventListener('canplaythrough', () => {
                this.scheduleHDPreload();
            });
            
            // Handle loading states
            this.video.addEventListener('loadstart', () => {
                console.log('🎬 Начинаю загрузку видео...');
                this.showLoadingIndicator();
            });
            
            this.video.addEventListener('progress', () => {
                if (this.video.buffered.length > 0) {
                    const buffered = (this.video.buffered.end(0) / this.video.duration) * 100;
                    if (buffered >= 25 && !this.hdPreloaded && this.shouldPreloadHD()) {
                        this.preloadHD();
                    }
                }
            });
            
            // Handle play/pause states
            this.video.addEventListener('playing', () => {
                this.hideLoadingIndicator();
                if (this.perfMonitor) {
                    this.perfMonitor.recordFirstFrame();
                }
                console.log('✅ Видео воспроизводится');
            });
            
            this.video.addEventListener('waiting', () => {
                this.showLoadingIndicator();
                if (this.perfMonitor) {
                    this.perfMonitor.recordBuffering();
                }
            });
            
            // Error handling
            this.video.addEventListener('error', (e) => {
                console.error('❌ Ошибка загрузки видео:', e);
                this.hideLoadingIndicator();
                if (this.perfMonitor) {
                    this.perfMonitor.recordError(e);
                }
                this.handleVideoError();
            });
            
            // Optimize on visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Page is hidden, pause video to save resources
                    if (!this.video.paused) {
                        this.video.pause();
                        this.wasPlayingBeforeHidden = true;
                    }
                } else {
                    // Page is visible again, resume if it was playing
                    if (this.wasPlayingBeforeHidden) {
                        this.video.play().catch(() => {});
                        this.wasPlayingBeforeHidden = false;
                    }
                }
            });
        }
        
        attemptAutoplay() {
            if (this.autoplayAttempted) return;
            this.autoplayAttempted = true;
            
            this.video.play().then(() => {
                console.log('✅ Видео запущено автоматически');
            }).catch(err => {
                console.log('⚠️ Автовоспроизведение заблокировано:', err.message);
                this.setupUserInteractionFallback();
            });
        }
        
        setupUserInteractionFallback() {
            const playOnInteraction = () => {
                this.video.play().catch(() => {});
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
                console.log('🎬 Видео запущено после взаимодействия');
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
        }
        
        shouldPreloadHD() {
            const { isMobile, isSlowDevice } = this.deviceInfo;
            const { isSlow, saveData } = this.connectionInfo;
            
            // Don't preload HD if:
            // - Mobile device
            // - Slow connection
            // - Data saver is on
            // - Slow device
            // - Low power mode
            if (isMobile || isSlow || saveData || isSlowDevice || this.lowPowerMode) {
                return false;
            }
            
            return true;
        }
        
        scheduleHDPreload() {
            if (!this.shouldPreloadHD() || this.hdPreloaded) return;
            
            // Delay HD preload to prioritize current video
            setTimeout(() => {
                this.preloadHD();
            }, 2000);
        }
        
        preloadHD() {
            if (this.hdPreloaded || this.currentQuality === 'hd') return;
            
            const { supportsWebM } = this.deviceInfo;
            const hdSrc = supportsWebM ? this.video.dataset.hdWebm : this.video.dataset.hdMp4;
            
            // Create hidden video element for preloading
            const hdVideo = document.createElement('video');
            hdVideo.style.display = 'none';
            hdVideo.preload = 'auto';
            hdVideo.src = hdSrc;
            
            hdVideo.addEventListener('canplaythrough', () => {
                this.hdPreloaded = true;
                console.log('🎬 HD версия предзагружена');
                
                // Switch to HD if user hasn't scrolled away
                if (this.isVideoInViewport() && !this.deviceInfo.isMobile) {
                    this.switchToHD(hdSrc);
                }
                
                // Clean up preload element
                setTimeout(() => {
                    hdVideo.remove();
                }, 1000);
            });
            
            document.body.appendChild(hdVideo);
            console.log('🎬 Предзагружаю HD версию...');
        }
        
        switchToHD(hdSrc) {
            if (this.currentQuality === 'hd') return;
            
            const currentTime = this.video.currentTime;
            const wasPlaying = !this.video.paused;
            
            this.showLoadingIndicator();
            this.video.src = hdSrc;
            this.currentQuality = 'hd';
            
            if (this.perfMonitor) {
                this.perfMonitor.recordQualitySwitch();
            }
            
            this.video.addEventListener('loadedmetadata', () => {
                this.video.currentTime = currentTime;
                if (wasPlaying) {
                    this.video.play().catch(() => {});
                }
                this.updateQualityIndicator('hd');
            }, { once: true });
            
            console.log('🎬 Переключено на HD качество');
        }
        
        isVideoInViewport() {
            const rect = this.video.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }
        
        handleVideoError() {
            // Fallback to MP4 if WebM fails
            if (this.video.src.includes('.webm')) {
                const fallbackSrc = this.currentQuality === 'hd' 
                    ? this.video.dataset.hdMp4 
                    : this.video.dataset.lightMp4;
                    
                console.log('🔄 Переключаюсь на MP4 fallback');
                this.video.src = fallbackSrc;
                this.video.load();
            } else {
                // Если и MP4 не работает, пробуем перезагрузить
                console.warn('⚠️ Видео ошибка, пробуем восстановить');
                const currentSrc = this.video.src;
                const currentTime = this.video.currentTime;
                
                setTimeout(() => {
                    this.video.src = currentSrc;
                    this.video.currentTime = currentTime;
                    this.video.load();
                }, 100);
            }
        }
        
        setupVideoRecovery() {
            // Мониторинг состояния видео для Safari iOS
            this.videoCheckInterval = setInterval(() => {
                if (this.video && this.video.readyState === 0 && this.video.src) {
                    console.warn('🔧 Видео выгружено Safari, восстанавливаем');
                    this.handleVideoError();
                }
            }, 3000); // Проверяем каждые 3 секунды
            
            // Слушаем события видимости страницы
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.video.readyState === 0 && this.video.src) {
                    console.warn('🔄 Страница снова видима, восстанавливаем видео');
                    setTimeout(() => {
                        if (this.video.readyState === 0) {
                            this.handleVideoError();
                        }
                    }, 200);
                }
            });
        }
        
        // UI Management Methods
        showLoadingIndicator() {
            const wrapper = this.video.closest('.hero-video-wrapper');
            if (wrapper) {
                wrapper.setAttribute('data-loading', 'true');
                this.video.setAttribute('data-loading', 'true');
            }
        }
        
        hideLoadingIndicator() {
            const wrapper = this.video.closest('.hero-video-wrapper');
            if (wrapper) {
                wrapper.removeAttribute('data-loading');
                this.video.removeAttribute('data-loading');
            }
        }
        
        updateQualityIndicator(quality) {
            this.video.setAttribute('data-quality', quality);
            console.log(`📊 Качество видео: ${quality.toUpperCase()}`);
        }
        
        // Debug Methods (доступны в консоли)
        getPerformanceStats() {
            if (this.perfMonitor) {
                return this.perfMonitor.getSummary();
            }
            return 'Performance monitor не инициализирован';
        }
        
        forceQualitySwitch(quality) {
            if (!['light', 'hd'].includes(quality)) {
                console.error('Допустимые качества: light, hd');
                return;
            }
            
            const { supportsWebM } = this.deviceInfo;
            let videoSrc;
            
            if (quality === 'hd') {
                videoSrc = supportsWebM ? this.video.dataset.hdWebm : this.video.dataset.hdMp4;
                this.switchToHD(videoSrc);
            } else {
                videoSrc = supportsWebM ? this.video.dataset.lightWebm : this.video.dataset.lightMp4;
                this.video.src = videoSrc;
                this.currentQuality = 'light';
                this.updateQualityIndicator('light');
            }
        }
        
        getVideoInfo() {
            return {
                currentSrc: this.video.src,
                quality: this.currentQuality,
                readyState: this.video.readyState,
                buffered: this.video.buffered.length > 0 ? Math.round((this.video.buffered.end(0) / this.video.duration) * 100) + '%' : '0%',
                deviceInfo: this.deviceInfo,
                connectionInfo: this.connectionInfo,
                lowPowerMode: this.lowPowerMode
            };
        }
        
        // Low power and data saver optimizations
        optimizeForLowPower() {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    if (battery.level < 0.2 && !battery.charging) {
                        this.lowPowerMode = true;
                        this.video.playbackRate = 1; // Keep normal rate but skip HD
                        console.log('🔋 Low power mode: HD отключен');
                    }
                    
                    // Monitor battery changes
                    battery.addEventListener('levelchange', () => {
                        if (battery.level < 0.2 && !battery.charging && !this.lowPowerMode) {
                            this.lowPowerMode = true;
                            console.log('🔋 Батарея низкая: переключаюсь в экономичный режим');
                        }
                    });
                });
            }
        }
        
        optimizeForDataSaver() {
            if (this.connectionInfo.saveData) {
                // Block HD loading entirely for data saver
                this.hdPreloaded = true; // Trick to prevent HD preload
                console.log('📶 Data saver режим: HD отключен');
            }
        }
    }
    
    // Initialize video optimizer and fullscreen manager
    let videoOptimizer;
    let fullscreenManager;
    if (heroVideo) {
        videoOptimizer = new VideoOptimizer(heroVideo);
        fullscreenManager = new FullscreenVideoManager(heroVideo);
    }
    
    initTelegramHandles();

    // Функция предзагрузки критичного контента
    async function preloadCriticalContent() {
        const promises = [];
        
        // 1. Предзагружаем первые 3 примера работ before/after
        const firstExamples = [
            'assets/before_after/IMG_0380.jpg',
            'assets/before_after/IMG_0380_restored.jpg',
            'assets/before_after/2.jpg',
            'assets/before_after/2_restored.jpg',
            'assets/before_after/IMG_0377.jpg',
            'assets/before_after/IMG_0377_restored.jpg'
        ];
        
        firstExamples.forEach(src => {
            promises.push(preloadImage(src));
        });
        
        // 2. Предзагружаем видео метаданные (если еще не загружено)
        if (heroVideo && heroVideo.readyState < 1) {
            promises.push(loadVideoMetadata(heroVideo));
        }
        
        try {
            await Promise.allSettled(promises); // Не прерываем выполнение при ошибках
            console.log('✅ Критичный контент предзагружен');
        } catch (error) {
            console.warn('⚠️ Частичная предзагрузка:', error);
        }
    }
    
    function preloadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null); // Не прерываем цепочку при ошибке
            img.src = src;
            
            // Таймаут для медленных соединений
            setTimeout(() => resolve(null), 2000);
        });
    }
    
    function loadVideoMetadata(video) {
        return new Promise((resolve) => {
            if (video.readyState >= 1) {
                resolve(video);
                return;
            }
            
            const onLoadedMetadata = () => {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                resolve(video);
            };
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            
            // Таймаут на случай проблем
            setTimeout(() => {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                resolve(video);
            }, 1500);
        });
    }
    
    // Preloader management
    if (preloader) {
        const hidePreloader = async () => {
            // СНАЧАЛА предзагружаем критичный контент
            await preloadCriticalContent();
            
            preloader.classList.add('hidden');
            
            // Trigger video optimization after preloader
            if (videoOptimizer && !videoOptimizer.isInitialized) {
                videoOptimizer.init();
            }
            
            console.log('🎬 Прелоадер скрыт, контент предзагружен, видео система активирована');
        };
        
        // Check if page is already loaded
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
        
        // Fallback: hide after 2 seconds max (увеличено для предзагрузки)
        setTimeout(hidePreloader, 2000);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.header__menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('is-open');
            navMenu.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Открыть меню');
                document.body.style.overflow = '';
            });
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Открыть меню');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Открыть меню');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================================================
    // ADAPTIVE SCROLL ANIMATION SYSTEM - Velocity-Based with Cross-Platform Support
    // ============================================================================
    
    /**
     * Адаптивный наблюдатель прокрутки с детекцией скорости
     * Автоматически подстраивается под скорость скролла пользователя
     */
    class AdaptiveScrollObserver {
        constructor() {
            this.observers = new Map();
            this.scrollVelocity = 0;
            this.lastScrollY = window.pageYOffset;
            this.lastScrollTime = Date.now();
            this.isScrolling = false;
            this.scrollTimeout = null;
            this.rafId = null;
            
            // Настройки для разных скоростей прокрутки
            this.thresholds = {
                slow: { threshold: 0.15, rootMargin: '50px 0px' },
                medium: { threshold: 0.08, rootMargin: '150px 0px' },
                fast: { threshold: 0.02, rootMargin: '300px 0px' },
                extreme: { threshold: 0.001, rootMargin: '500px 0px' }
            };
            
            this.initScrollListener();
        }
        
        // Детекция типа устройства
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
        
        isIOSSafari() {
            const ua = navigator.userAgent;
            return /iPad|iPhone|iPod/.test(ua) && /Safari/i.test(ua) && !/Chrome|CriOS|OPiOS|FxiOS/i.test(ua);
        }
        
        initScrollListener() {
            // Пассивный слушатель для лучшей производительности
            window.addEventListener('scroll', this.handleScroll.bind(this), { 
                passive: true 
            });
            
            // Используем requestAnimationFrame для плавности
            this.updateVelocity();
        }
        
        handleScroll() {
            if (!this.isScrolling) {
                this.isScrolling = true;
            }
            
            // Сброс таймера остановки скролла
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.scrollVelocity = 0;
            }, 100);
        }
        
        updateVelocity() {
            const now = Date.now();
            const currentScrollY = window.pageYOffset;
            
            if (this.isScrolling) {
                const deltaY = Math.abs(currentScrollY - this.lastScrollY);
                const deltaTime = now - this.lastScrollTime;
                
                if (deltaTime > 0) {
                    this.scrollVelocity = deltaY / deltaTime;
                }
            }
            
            this.lastScrollY = currentScrollY;
            this.lastScrollTime = now;
            
            this.rafId = requestAnimationFrame(() => this.updateVelocity());
        }
        
        getOptimalSettings() {
            // Адаптивные настройки в зависимости от устройства и скорости
            const baseSettings = this.getMobileOptimizedSettings();
            
            if (this.scrollVelocity > 3) {
                return { ...baseSettings, ...this.thresholds.extreme };
            }
            if (this.scrollVelocity > 2) {
                return { ...baseSettings, ...this.thresholds.fast };
            }
            if (this.scrollVelocity > 1) {
                return { ...baseSettings, ...this.thresholds.medium };
            }
            return { ...baseSettings, ...this.thresholds.slow };
        }
        
        getMobileOptimizedSettings() {
            if (this.isIOSSafari()) {
                // Специальные настройки для iOS Safari с множественными порогами
                return {
                    threshold: [0, 0.05, 0.1, 0.2, 0.5],
                    rootMargin: '200px 0px'
                };
            }
            
            if (this.isMobile()) {
                // Настройки для Android и других мобильных браузеров
                return {
                    threshold: 0.05,
                    rootMargin: '150px 0px'
                };
            }
            
            // Настройки для десктопа
            return {
                threshold: 0.1,
                rootMargin: '50px 0px'
            };
        }
        
        observe(element, callback, options = {}) {
            const settings = this.getOptimalSettings();
            const finalOptions = {
                ...settings,
                ...options
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    callback(entry, this.scrollVelocity);
                });
            }, finalOptions);
            
            observer.observe(element);
            this.observers.set(element, observer);
        }
        
        destroy() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            clearTimeout(this.scrollTimeout);
            this.observers.forEach(observer => observer.disconnect());
            this.observers.clear();
        }
    }
    
    /**
     * Контроллер улучшенных анимаций с поддержкой адаптивности
     */
    class EnhancedAnimationController {
        constructor() {
            this.scrollObserver = new AdaptiveScrollObserver();
            this.animatedElements = new Set();
            this.preloadedElements = new Set();
            this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.debugMode = false;
            
            this.initAnimations();
        }
        
        initAnimations() {
            // Ждем полной загрузки DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupElements());
            } else {
                this.setupElements();
            }
        }
        
        setupElements() {
            const elements = document.querySelectorAll('.animate-on-scroll');
            
            elements.forEach((element, index) => {
                this.setupElement(element, index);
            });
            
            console.log(`🎬 Инициализировано ${elements.length} анимированных элементов`);
        }
        
        setupElement(element, index) {
            // Добавляем data-атрибуты для контроля
            element.dataset.animationIndex = index;
            element.dataset.animationState = 'pending';
            
            // Специальная обработка для мобильных и features section
                const isMobile = window.innerWidth <= 768;
                const isInFeaturesSection = element.closest('.features-section');
                
                if (isMobile && isInFeaturesSection) {
                // На мобильных features показываем сразу
                this.triggerImmediateAnimation(element);
                return;
            }
            
            // Предзагрузка элементов, которые близко к viewport
            this.preloadNearElements(element);
            
            // Настройка наблюдения с адаптивными параметрами
            this.scrollObserver.observe(element, (entry, velocity) => {
                this.handleIntersection(entry, velocity);
            });
        }
        
        preloadNearElements(element) {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Предзагрузка элементов в пределах 2 экранов
            if (rect.top < viewportHeight * 2 && rect.bottom > -viewportHeight) {
                this.preloadElement(element);
            }
        }
        
        preloadElement(element) {
            if (this.preloadedElements.has(element)) return;
            
            // Добавляем класс для CSS препарации (аппаратное ускорение)
            element.classList.add('animation-ready');
            this.preloadedElements.add(element);
        }
        
        handleIntersection(entry, scrollVelocity) {
            const element = entry.target;
            
            if (entry.isIntersecting && !this.animatedElements.has(element)) {
                this.triggerAnimation(element, scrollVelocity);
            }
        }
        
        triggerAnimation(element, velocity) {
            if (this.animatedElements.has(element)) return;
            
            // Учитываем настройки пользователя
            if (this.isReducedMotion) {
                this.triggerReducedMotionAnimation(element);
                return;
            }
            
            // Адаптируем анимацию под скорость скролла
            const duration = this.calculateAnimationDuration(velocity);
            const delay = this.calculateAnimationDelay(element, velocity);
            
            // Применяем анимацию
            this.applyAnimation(element, duration, delay);
            
            if (this.debugMode) {
                console.log(`✨ Анимация элемента #${element.dataset.animationIndex}, velocity: ${velocity.toFixed(2)}, duration: ${duration}s, delay: ${delay}ms`);
            }
        }
        
        triggerImmediateAnimation(element) {
                    element.classList.add('is-visible');
            element.dataset.animationState = 'completed';
            this.animatedElements.add(element);
        }
        
        calculateAnimationDuration(velocity) {
            // Чем быстрее скролл, тем быстрее анимация
            if (velocity > 3) return 0.2;  // Очень быстро
            if (velocity > 2) return 0.35; // Быстро
            if (velocity > 1) return 0.5;  // Средне
            return 0.6;                    // Нормально (было 0.8, уменьшил для быстродействия)
        }
        
        calculateAnimationDelay(element, velocity) {
            const index = parseInt(element.dataset.animationIndex) || 0;
            
            // При быстром скролле убираем задержки
            if (velocity > 2) return 0;
            
            // Уменьшенные задержки для более быстрой реакции
            const baseDelay = velocity > 1 ? 30 : 50;
            
            // Специальная обработка для comparison gallery
                    if (element.closest('.comparison-gallery-section')) {
                return velocity > 1 ? 0 : index * 80;
            }
            
            // Стандартные задержки для групп элементов
            const siblings = element.parentElement.querySelectorAll('.animate-on-scroll');
            if (siblings.length > 1) {
                const localIndex = Array.from(siblings).indexOf(element);
                return localIndex * baseDelay;
            }
            
            return 0;
        }
        
        applyAnimation(element, duration, delay) {
            element.style.setProperty('--animation-duration', `${duration}s`);
            element.style.setProperty('--animation-delay', `${delay}ms`);
            
            // Используем setTimeout для delay, чтобы не блокировать основной поток
            setTimeout(() => {
                element.classList.add('is-visible');
                element.dataset.animationState = 'completed';
                this.animatedElements.add(element);
            }, delay);
        }
        
        triggerReducedMotionAnimation(element) {
            // Мгновенное появление без анимации
            element.classList.add('is-visible-no-animation');
            element.dataset.animationState = 'completed';
            this.animatedElements.add(element);
        }
        
        // Методы отладки
        enableDebugMode() {
            this.debugMode = true;
            console.log('🎬 Animation Debug Mode enabled');
            console.log('📊 Используйте window.animationController.getStats() для статистики');
        }
        
        getStats() {
            return {
                totalElements: document.querySelectorAll('.animate-on-scroll').length,
                animatedElements: this.animatedElements.size,
                preloadedElements: this.preloadedElements.size,
                currentScrollVelocity: this.scrollObserver.scrollVelocity.toFixed(2),
                isScrolling: this.scrollObserver.isScrolling,
                reducedMotion: this.isReducedMotion,
                isMobile: this.scrollObserver.isMobile(),
                isIOSSafari: this.scrollObserver.isIOSSafari()
            };
        }
        
        destroy() {
            this.scrollObserver.destroy();
            this.animatedElements.clear();
            this.preloadedElements.clear();
        }
    }
    
    // Инициализация улучшенной системы анимаций
    let animationController;
    
    if ('IntersectionObserver' in window) {
        animationController = new EnhancedAnimationController();
        
        // Глобальная переменная для отладки
        window.animationController = animationController;
        
        console.log('✅ Adaptive Scroll Animation System активирована');
        console.log('💡 Для отладки: window.animationController.enableDebugMode()');
    } else {
        // Fallback для старых браузеров
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('is-visible');
        });
        console.log('⚠️ IntersectionObserver не поддерживается, используется fallback');
    }

    // Feature cards hover effect (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Advanced viewport-based video management
    const setupVideoViewportObserver = () => {
        if (!('IntersectionObserver' in window)) return;
        
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                
                if (entry.isIntersecting) {
                    // Video entered viewport
                    if (video.classList.contains('hero-video') && videoOptimizer) {
                        // Hero video gets special treatment
                        if (!videoOptimizer.autoplayAttempted) {
                            videoOptimizer.attemptAutoplay();
                        }
                    } else {
                        // Regular videos
                        video.play().catch(() => {});
                    }
                } else {
                    // Video left viewport
                    if (!video.classList.contains('hero-video')) {
                        video.pause();
                    }
                }
            });
        }, { 
            threshold: 0.25,
            rootMargin: '50px 0px'
        });
        
        // Observe all videos
        document.querySelectorAll('video').forEach(video => {
            videoObserver.observe(video);
        });
    };
    
    // Initialize viewport observer
    setupVideoViewportObserver();
    
    // ============================================================================
    // MODERN COMPARISON GALLERY - Универсальный слайдер для всех платформ
    // ============================================================================
    
    /**
     * Управление галереей сравнения с автодемонстрацией
     * Работает на всех платформах через img-comparison-slider компонент
     */
    class ModernComparisonGallery {
        constructor() {
            this.currentIndex = 0;
            this.isLoading = false;
            this.hasUserInteracted = false;
            this.tutorialShown = false;
            this.autoSlideInterval = null;
            this.animationFrameId = null;
            
            // Примеры изображений
            this.examples = [
                { before: 'assets/before_after/IMG_0380.jpg', after: 'assets/before_after/IMG_0380_restored.jpg' },
                { before: 'assets/before_after/2.jpg', after: 'assets/before_after/2_restored.jpg' },
                { before: 'assets/before_after/IMG_0377.jpg', after: 'assets/before_after/IMG_0377_restored.jpg' },
                { before: 'assets/before_after/IMG_0381.jpg', after: 'assets/before_after/IMG_0381_restored.jpg' },
                { before: 'assets/before_after/IMG_0398.jpg', after: 'assets/before_after/IMG_0398_restored.jpg' },
                { before: 'assets/before_after/IMG_0552.jpg', after: 'assets/before_after/IMG_0552_restored.jpg' },
                { before: 'assets/before_after/IMG_0371.jpg', after: 'assets/before_after/IMG_0371_restored.jpg' },
                { before: 'assets/before_after/IMG_0390.jpg', after: 'assets/before_after/IMG_0390_restored.jpg' }
            ];
            
            // DOM элементы
            this.slider = document.getElementById('modern-comparison-slider');
            this.beforeImage = document.getElementById('before-image');
            this.afterImage = document.getElementById('after-image');
            this.thumbnails = document.querySelectorAll('.thumbnail-btn');
            this.loader = document.getElementById('comparison-loader');
            this.tutorialOverlay = document.getElementById('tutorial-overlay');
            this.tutorialHand = this.tutorialOverlay?.querySelector('.tutorial-hand');
            
            if (!this.slider) {
                console.warn('⚠️ Comparison slider не найден');
                return;
            }
            
            this.init();
        }
        
        init() {
            // 🍎 Safari-specific initialization (должно быть первым)
            this.initSafariFixes();
            
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.adjustContainerAspectRatio();
            this.preloadNextImages();
            console.log('✅ Modern Comparison Gallery инициализирована');
        }
        
        // Умная подстройка контейнера - использует ФИКСИРОВАННЫЕ стандарты (1:1, 3:4, 4:3)
        async adjustContainerAspectRatio() {
            if (!this.beforeImage || !this.afterImage) return;
            
            try {
                // 📏 Получаем реальные размеры изображений
                const beforeImg = await this.getImageDimensions(this.beforeImage.src);
                const afterImg = await this.getImageDimensions(this.afterImage.src);
                
                // 🍎 SAFARI CRITICAL: Explicit width/height attributes
                this.beforeImage.setAttribute('width', beforeImg.width.toString());
                this.beforeImage.setAttribute('height', beforeImg.height.toString());
                this.afterImage.setAttribute('width', afterImg.width.toString());
                this.afterImage.setAttribute('height', afterImg.height.toString());
                
                // 📐 Определяем aspect ratio
                const realAspectRatio = beforeImg.width / beforeImg.height;
                let targetAspectRatio;
                let orientationType;
                
                // 🎯 Стандартизированные форматы
                if (realAspectRatio >= 0.95 && realAspectRatio <= 1.05) {
                    targetAspectRatio = 1.0; // 1:1 квадрат
                    orientationType = 'квадратное (1:1)';
                } else if (realAspectRatio < 0.95) {
                    targetAspectRatio = 0.75; // 3:4 вертикальное
                    orientationType = 'вертикальное (3:4)';
                } else {
                    targetAspectRatio = 1.333; // 4:3 горизонтальное
                    orientationType = 'горизонтальное (4:3)';
                }
                
                if (this.slider) {
                    // 🍎 SAFARI CRITICAL: Multi-step sizing approach
                    
                    // Шаг 1: Сброс всех размеров
                    this.slider.style.aspectRatio = '';
                    this.slider.style.height = '';
                    this.slider.style.minHeight = '';
                    this.slider.style.maxHeight = '';
                    
                    // Шаг 2: Force reflow
                    void this.slider.offsetHeight;
                    void this.slider.offsetWidth;
                    
                    // Шаг 3: Рассчитываем точные размеры
                    const containerWidth = this.slider.offsetWidth;
                    const calculatedHeight = containerWidth / targetAspectRatio;
                    
                    // 🍎 SAFARI: Применяем размеры в строгом порядке
                    this.slider.style.width = '100%';
                    this.slider.style.height = `${calculatedHeight}px`;
                    this.slider.style.minHeight = `${calculatedHeight}px`;
                    this.slider.style.maxHeight = `${calculatedHeight}px`;
                    this.slider.style.aspectRatio = targetAspectRatio.toFixed(4);
                    
                    // Шаг 4: Double reflow для WebKit
                    setTimeout(() => {
                        void this.slider.offsetHeight;
                        void this.beforeImage.offsetHeight;
                        void this.afterImage.offsetHeight;
                        
                        // 🍎 Safari: Принудительная перерисовка изображений
                        [this.beforeImage, this.afterImage].forEach(img => {
                            const currentSrc = img.src;
                            img.src = '';
                            void img.offsetHeight;
                            img.src = currentSrc;
                        });
                    }, 16); // 16ms = 1 frame at 60fps
                    
                    console.log(`🍎 Safari Fix Applied: ${orientationType}`);
                    console.log(`📐 Container: ${containerWidth}x${calculatedHeight}px`);
                    console.log(`🎯 Aspect Ratio: ${targetAspectRatio}`);
                    console.log(`   Оригинал: ${beforeImg.width}×${beforeImg.height}`);
                    console.log(`   Восстановленное: ${afterImg.width}×${afterImg.height}`);
                }
                
            } catch (error) {
                console.error('❌ Aspect ratio adjustment failed:', error);
                
                // 🍎 Safari: Graceful fallback
                if (this.slider) {
                    this.slider.style.aspectRatio = '0.75';
                    this.slider.style.minHeight = '300px';
                    this.slider.style.height = 'auto';
                    this.slider.style.maxHeight = '70vh';
                }
            }
        }
        
        // Вспомогательный метод для получения размеров изображения
        getImageDimensions(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                };
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
                img.src = src;
            });
        }
        
        // 🍎 Safari detection and specific fixes
        detectSafari() {
            const ua = navigator.userAgent.toLowerCase();
            const isSafari = ua.indexOf('safari') !== -1 && 
                           ua.indexOf('chrome') === -1 && 
                           ua.indexOf('chromium') === -1;
            return isSafari;
        }
        
        // 🍎 Safari-specific initialization
        initSafariFixes() {
            if (!this.detectSafari()) return;
            
            console.log('🍎 Safari detected - applying WebKit fixes');
            
            // Force composite layer on container
            if (this.slider) {
                this.slider.style.transform = 'translateZ(0)';
                this.slider.style.willChange = 'auto';
                this.slider.style.contain = 'layout style';
            }
            
            // Enhanced image loading for Safari
            [this.beforeImage, this.afterImage].forEach((img, index) => {
                if (img) {
                    // Force hardware acceleration
                    img.style.transform = 'translateZ(0) scale(1.0001)';
                    img.style.willChange = 'transform';
                    
                    // Ensure proper loading
                    if (img.complete) {
                        this.handleImageLoad(img, index);
                    } else {
                        img.addEventListener('load', () => this.handleImageLoad(img, index));
                    }
                }
            });
        }
        
        // 🍎 Safari image load handler
        handleImageLoad(img, index) {
            // 🍎 Safari: Force re-render after load
            setTimeout(() => {
                const currentTransform = img.style.transform;
                img.style.transform = '';
                void img.offsetHeight;
                img.style.transform = currentTransform;
                
                console.log(`🍎 Safari image ${index} loaded and optimized`);
            }, 10);
        }
        
        setupEventListeners() {
            // Переключение между примерами через превью
            this.thumbnails.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    this.hasUserInteracted = true;
                    this.stopAutoSlideDemo();
                    this.loadExample(index);
                });
            });
            
            // Отслеживание взаимодействия со слайдером
            this.slider.addEventListener('mousedown', () => {
                this.hasUserInteracted = true;
                this.stopAutoSlideDemo();
            });
            
            this.slider.addEventListener('touchstart', () => {
                this.hasUserInteracted = true;
                this.stopAutoSlideDemo();
            }, { passive: true });
            
            // Prevent image dragging
            [this.beforeImage, this.afterImage].forEach(img => {
                if (img) {
                    img.addEventListener('dragstart', (e) => e.preventDefault());
                }
            });
        }
        
        setupIntersectionObserver() {
            if (!('IntersectionObserver' in window)) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasUserInteracted) {
                        // Запускаем анимацию с минимальной задержкой для быстрого старта
                        setTimeout(() => {
                            this.startAutoSlideDemo();
                        }, 200); // Уменьшено с 500ms до 200ms
                    } else if (!entry.isIntersecting) {
                        // Останавливаем анимацию если пользователь ушел
                        this.stopAutoSlideDemo();
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(this.slider);
        }
        
        startAutoSlideDemo() {
            if (this.hasUserInteracted || !this.tutorialOverlay) return;
            
            // Показываем оверлей и убираем display:none
            this.tutorialOverlay.style.display = ''; // Сбрасываем display:none
            this.tutorialOverlay.classList.add('active');
            this.tutorialOverlay.classList.remove('hidden');
            
            let cycles = 0;
            const maxCycles = 2;
            
            // Программно двигаем слайдер через API компонента
            const animateSlider = () => {
                if (this.hasUserInteracted || cycles >= maxCycles) {
                    this.stopAutoSlideDemo();
                    return;
                }
                
                // Анимация: 50% -> 25% -> 75% -> 50% (более выразительная)
                const positions = [50, 25, 75, 50];
                let stepIndex = 0;
                
                const step = () => {
                    if (this.hasUserInteracted || stepIndex >= positions.length) {
                        cycles++;
                        if (cycles < maxCycles) {
                            setTimeout(animateSlider, 300);
                        } else {
                            this.stopAutoSlideDemo();
                        }
                        return;
                    }
                    
                    const targetValue = positions[stepIndex];
                    
                    // Первое движение быстрее для мгновенного отклика
                    const duration = stepIndex === 0 ? 700 : 900; // Первое движение 700ms, остальные 900ms
                    const delay = stepIndex === 0 ? 900 : 1100; // Уменьшенные задержки
                    
                    // Синхронно двигаем слайдер и руку
                    this.animateSliderTo(targetValue, duration);
                    this.animateHandTo(targetValue);
                    
                    stepIndex++;
                    setTimeout(step, delay);
                };
                
                step();
            };
            
            animateSlider();
            console.log('🎪 Автодемонстрация слайдера началась (2 цикла)');
        }
        
        // Синхронное движение руки со слайдером через CSS переменную
        animateHandTo(targetPosition) {
            if (!this.tutorialHand) return;
            
            // Используем CSS переменную для плавной синхронизации
            this.tutorialHand.style.setProperty('--hand-position', `${targetPosition}%`);
            
            // Альтернативный способ через style.left (фоллбек)
            this.tutorialHand.style.left = `${targetPosition}%`;
        }
        
        animateSliderTo(targetValue, duration = 800) {
            if (!this.slider) return;
            
            const currentValue = parseFloat(this.slider.value) || 50;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeInOutCubic = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                const newValue = currentValue + (targetValue - currentValue) * easeInOutCubic;
                this.slider.value = newValue;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        stopAutoSlideDemo() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
            
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            if (this.tutorialOverlay) {
                this.tutorialOverlay.classList.remove('active');
                this.tutorialOverlay.classList.add('hidden');
                
                // Полное скрытие через анимацию
                setTimeout(() => {
                    if (this.tutorialOverlay && !this.tutorialOverlay.classList.contains('active')) {
                        this.tutorialOverlay.style.display = 'none';
                    }
                }, 600);
            }
            
            // Вернуть слайдер на 50% плавно
            setTimeout(() => {
                if (this.slider && !this.hasUserInteracted) {
                    this.animateSliderTo(50, 400);
                    this.animateHandTo(50);
                }
            }, 200);
            
            console.log('🎪 Автодемонстрация завершена');
        }
        
        async loadExample(index) {
            if (index === this.currentIndex || this.isLoading) {
                console.log('⏳ Пример уже загружен или загружается');
                return;
            }
            
            this.isLoading = true;
            this.showLoader();
            
            // Обновить активную кнопку
            this.thumbnails.forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
            
            const example = this.examples[index];
            
            try {
                // Предзагрузить оба изображения
                await Promise.all([
                    this.loadImage(example.before),
                    this.loadImage(example.after)
                ]);
                
                // Плавная смена с opacity
                this.beforeImage.style.opacity = '0';
                this.afterImage.style.opacity = '0';
                
                setTimeout(() => {
                    this.beforeImage.src = example.before;
                    this.afterImage.src = example.after;
                    
                    this.beforeImage.style.opacity = '1';
                    this.afterImage.style.opacity = '1';
                    
                    this.currentIndex = index;
                    
                    // Подстроить контейнер под новые пропорции
                    this.adjustContainerAspectRatio();
                    
                    // Сбросить позицию слайдера
                    if (this.slider) {
                        this.slider.value = 50;
                    }
                    
                    this.hideLoader();
                    this.isLoading = false;
                    
                    console.log(`✅ Загружен пример ${index + 1}/${this.examples.length}`);
                }, 150);
                
            } catch (error) {
                console.error('❌ Ошибка загрузки примера:', error);
                this.hideLoader();
                this.isLoading = false;
            }
        }
        
        loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
                img.src = src;
            });
        }
        
        showLoader() {
            if (this.loader) {
                this.loader.classList.add('active');
            }
        }
        
        hideLoader() {
            if (this.loader) {
                this.loader.classList.remove('active');
            }
        }
        
        preloadNextImages() {
            // Предзагрузка следующих 3 примеров в фоне
            this.examples.slice(1, 4).forEach((example, index) => {
                setTimeout(() => {
                    const beforeImg = new Image();
                    const afterImg = new Image();
                    beforeImg.src = example.before;
                    afterImg.src = example.after;
                }, (index + 1) * 500);
            });
            
            console.log('📸 Предзагрузка следующих примеров началась');
        }
    }
    
    // Инициализация галереи
    let modernGallery;
    if (document.querySelector('.comparison-container')) {
        modernGallery = new ModernComparisonGallery();
        window.modernGallery = modernGallery; // Для отладки
    }

    // ============================================================================
    // SCROLL HINT MANAGER - Улучшенная видимость прокрутки на мобильных
    // ============================================================================
    
    /**
     * Управляет скролл-подсказкой для лучшего UX на мобильных устройствах
     * Автоматически скрывает индикатор после начала прокрутки
     */
    class ScrollHintManager {
        constructor() {
            this.scrollHint = document.getElementById('scrollHint');
            this.heroSection = document.querySelector('.hero-section');
            this.featuresSection = document.querySelector('.features-section');
            this.hasScrolled = false;
            this.scrollThreshold = window.innerHeight * 0.1; // 10% от высоты экрана
            this.isVisible = false;
            
            this.init();
        }
        
        init() {
            if (!this.scrollHint || !this.heroSection) return;
            
            // Клик по стрелке - плавная прокрутка к следующей секции
            this.scrollHint.addEventListener('click', this.scrollToContent.bind(this));
            
            // Поддержка клавиатуры (Enter и Space)
            this.scrollHint.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToContent();
                }
            });
            
            // Отслеживание прокрутки для скрытия индикатора
            let scrollTimer = null;
            window.addEventListener('scroll', () => {
                if (scrollTimer) clearTimeout(scrollTimer);
                scrollTimer = setTimeout(this.handleScroll.bind(this), 10);
            }, { passive: true });
            
            // Показать индикатор через небольшую задержку после загрузки
            setTimeout(() => {
                if (window.pageYOffset < this.scrollThreshold) {
                    this.showHint();
                }
            }, 1500);
            
            console.log('📍 Scroll Hint Manager активирован');
        }
        
        showHint() {
            if (this.scrollHint && !this.isVisible && !this.hasScrolled) {
                this.scrollHint.style.opacity = '0.9';
                this.scrollHint.style.visibility = 'visible';
                this.isVisible = true;
            }
        }
        
        hideHint() {
            if (!this.hasScrolled) {
                this.hasScrolled = true;
                this.heroSection?.classList.add('scrolled');
                
                // Скрыть с анимацией
                if (this.scrollHint) {
                    this.scrollHint.style.opacity = '0';
                    this.scrollHint.style.visibility = 'hidden';
                    this.isVisible = false;
                }
            }
        }
        
        handleScroll() {
            const scrollY = window.pageYOffset;
            
            if (scrollY > this.scrollThreshold) {
                this.hideHint();
            } else if (!this.hasScrolled && !this.isVisible) {
                this.showHint();
            }
        }
        
        scrollToContent() {
            const targetSection = this.featuresSection || document.querySelector('.features-section');
            
            if (targetSection) {
                const headerHeight = 80; // Высота header
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Добавить визуальную обратную связь
                this.scrollHint.style.transform = 'translateX(-50%) scale(0.9)';
                setTimeout(() => {
                    if (this.scrollHint) {
                        this.scrollHint.style.transform = 'translateX(-50%) scale(1)';
                    }
                }, 150);
                
                // Скрыть после клика
                setTimeout(() => {
                    this.hideHint();
                }, 300);
            }
        }
    }
    
    // Инициализация Scroll Hint Manager
    let scrollHintManager;
    if (document.querySelector('.hero-section')) {
        scrollHintManager = new ScrollHintManager();
        window.scrollHintManager = scrollHintManager; // Для отладки
    }

    // Performance monitoring
    if (window.performance && window.performance.getEntriesByType) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navEntries = performance.getEntriesByType('navigation')[0];
                const loadTime = navEntries.loadEventEnd - navEntries.loadEventStart;
                console.log(`📊 Время загрузки страницы: ${Math.round(loadTime)}мс`);
                
                // Log video loading performance
                if (heroVideo) {
                    console.log(`📊 Видео готовность: ${heroVideo.readyState}/4`);
                    console.log(`📊 Видео загружено: ${Math.round((heroVideo.buffered.length > 0 ? heroVideo.buffered.end(0) / heroVideo.duration : 0) * 100)}%`);
                }
                
                // Setup global debug utilities
                window.debugVideo = {
                    stats: () => videoOptimizer?.getPerformanceStats(),
                    info: () => videoOptimizer?.getVideoInfo(),
                    switchQuality: (quality) => videoOptimizer?.forceQualitySwitch(quality),
                    optimizer: videoOptimizer
                };
                
                console.log('🛠 Debug утилиты доступны через window.debugVideo');
                console.log('  - debugVideo.stats() - статистика производительности');
                console.log('  - debugVideo.info() - информация о видео');
                console.log('  - debugVideo.switchQuality("hd") - принудительное переключение качества');
            }, 100);
        });
    }

});
