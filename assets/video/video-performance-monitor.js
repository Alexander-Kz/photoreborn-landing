/**
 * Video Performance Monitor
 * Отслеживает производительность загрузки и воспроизведения видео
 */

class VideoPerformanceMonitor {
    constructor() {
        this.metrics = {
            loadStart: null,
            firstFrame: null,
            totalLoadTime: null,
            bufferingEvents: 0,
            qualitySwitches: 0,
            errors: []
        };
        
        this.init();
    }
    
    init() {
        // Начальная отметка времени
        this.metrics.loadStart = performance.now();
        
        // Мониторинг сетевых ресурсов
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.initiatorType === 'video') {
                        this.logVideoResource(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }
    
    logVideoResource(entry) {
        console.log(`📊 Видео ресурс загружен:`, {
            name: entry.name.split('/').pop(),
            size: Math.round(entry.transferSize / 1024) + ' КБ',
            loadTime: Math.round(entry.duration) + ' мс',
            fromCache: entry.transferSize === 0
        });
    }
    
    recordFirstFrame() {
        if (!this.metrics.firstFrame) {
            this.metrics.firstFrame = performance.now();
            const timeToFirstFrame = this.metrics.firstFrame - this.metrics.loadStart;
            
            console.log(`🎬 Время до первого кадра: ${Math.round(timeToFirstFrame)}мс`);
        }
    }
    
    recordBuffering() {
        this.metrics.bufferingEvents++;
        console.log(`⏳ Событие буферизации #${this.metrics.bufferingEvents}`);
    }
    
    recordQualitySwitch() {
        this.metrics.qualitySwitches++;
        console.log(`📊 Переключение качества #${this.metrics.qualitySwitches}`);
    }
    
    recordError(error) {
        this.metrics.errors.push({
            timestamp: performance.now(),
            error: error.toString()
        });
        console.error(`❌ Ошибка видео:`, error);
    }
    
    getSummary() {
        return {
            ...this.metrics,
            totalLoadTime: this.metrics.firstFrame - this.metrics.loadStart
        };
    }
}

// Экспорт для использования в основном скрипте
window.VideoPerformanceMonitor = VideoPerformanceMonitor;
