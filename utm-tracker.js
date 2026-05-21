/**
 * 🔗 UTM Tracker для PhotoReborn AI Landing Page
 * 
 * Автоматически извлекает UTM-метки из URL, определяет источник трафика
 * и модифицирует все ссылки на Telegram-бот в формате для сквозной аналитики.
 * 
 * Формат для бота: utm_[source]_[id]_[medium]_[campaign]_[content]_[term]
 * Пустые поля заменяются на "_"
 * 
 * @version 1.0.0
 * @date 2025-10-07
 */

class UTMTracker {
    constructor() {
        this.botUsername = 'PhotoReborn_bot';
        this.storageKey = 'photoreborn_first_utm';
        this.storageDuration = 30 * 24 * 60 * 60 * 1000; // 30 дней
        this.storageVersion = 'v1'; // Версия для защиты от CI/CD сброса
        
        // Порядок полей строго фиксирован (как в боте)
        this.fieldOrder = ['source', 'id', 'medium', 'campaign', 'content', 'term'];
        
        this.init();
    }
    
    init() {
        console.log('🔗 UTM Tracker инициализирован');
        
        // Получаем UTM-метки
        const utmData = this.extractUTMData();
        
        // Сохраняем первый визит (если это первый раз)
        this.saveFirstVisit(utmData);
        
        // Формируем параметр для бота
        const botParam = this.formatForBot(utmData);
        
        // Модифицируем все ссылки на бота
        this.modifyBotLinks(botParam);
        
        console.log('✅ UTM Tracker завершил работу');
        console.log(`📊 Параметр бота: ${botParam}`);
    }
    
    /**
     * Извлекает UTM-метки из URL или определяет источник автоматически
     */
    extractUTMData() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Пытаемся извлечь классические UTM-параметры
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmTerm = urlParams.get('utm_term');
        const utmContent = urlParams.get('utm_content');
        const utmId = urlParams.get('utm_id');
        
        // Если есть хотя бы один UTM - используем их
        if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent || utmId) {
            return {
                source: utmSource || '',
                id: utmId || '',
                medium: utmMedium || '',
                campaign: utmCampaign || '',
                content: utmContent || '',
                term: utmTerm || ''
            };
        }
        
        // Иначе - автоопределение источника
        return this.detectTrafficSource();
    }
    
    /**
     * Автоматически определяет источник трафика
     */
    detectTrafficSource() {
        const referrer = document.referrer;
        const hostname = referrer ? new URL(referrer).hostname : '';
        
        // Прямой заход (пользователь набрал URL)
        if (!referrer) {
            return {
                source: 'direct',
                id: '',
                medium: 'organic',
                campaign: '',
                content: '',
                term: ''
            };
        }
        
        // Яндекс поиск
        if (hostname.includes('yandex.ru') || hostname.includes('yandex.com')) {
            return {
                source: 'yandex',
                id: '',
                medium: 'organic',
                campaign: '',
                content: '',
                term: ''
            };
        }
        
        // Google поиск
        if (hostname.includes('google.')) {
            return {
                source: 'google',
                id: '',
                medium: 'organic',
                campaign: '',
                content: '',
                term: ''
            };
        }
        
        // VK
        if (hostname.includes('vk.com')) {
            return {
                source: 'vk',
                id: '',
                medium: 'social',
                campaign: '',
                content: '',
                term: ''
            };
        }
        
        // Telegram (если переход из веб-версии)
        if (hostname.includes('t.me') || hostname.includes('telegram.')) {
            return {
                source: 'telegram',
                id: '',
                medium: 'messenger',
                campaign: '',
                content: '',
                term: ''
            };
        }
        
        // Реферальная ссылка (другой сайт)
        const simplifiedDomain = hostname.replace(/^www\./, '').replace(/\./g, '-');
        return {
            source: 'referral',
            id: '',
            medium: simplifiedDomain,
            campaign: '',
            content: '',
            term: ''
        };
    }
    
    /**
     * Форматирует UTM-данные для бота
     * Добавляет маркер "landing" в content
     * Формат: utm_[source]_[id]_[medium]_[campaign]_[content]_[term]
     */
    formatForBot(utmData) {
        // Добавляем "landing" в content
        const contentValue = utmData.content ? `${utmData.content}-landing` : 'landing';
        
        // Собираем все поля в строгом порядке
        const values = [
            utmData.source || '',
            utmData.id || '',
            utmData.medium || '',
            utmData.campaign || '',
            contentValue,
            utmData.term || ''
        ];
        
        // Заменяем пустые значения на "_"
        const formatted = values.map(val => val || '').join('_');
        
        // Добавляем префикс "utm_"
        return `utm_${formatted}`;
    }
    
    /**
     * Модифицирует все ссылки на Telegram-бот
     */
    modifyBotLinks(botParam) {
        // Находим все ссылки на наш бот
        const botLinks = document.querySelectorAll(`a[href*="t.me/${this.botUsername}"]`);
        
        let modifiedCount = 0;
        botLinks.forEach(link => {
            const baseUrl = `https://t.me/${this.botUsername}`;
            const newUrl = `${baseUrl}?start=${botParam}`;
            
            // Обновляем ссылку
            link.href = newUrl;
            modifiedCount++;
            
            console.log(`🔗 Ссылка обновлена: ${newUrl}`);
        });
        
        console.log(`✅ Обновлено ссылок: ${modifiedCount}`);
    }
    
    /**
     * Сохраняет данные первого визита в localStorage
     * С защитой от сброса при CI/CD деплое
     */
    saveFirstVisit(utmData) {
        try {
            const stored = localStorage.getItem(this.storageKey);
            
            if (stored) {
                const parsed = JSON.parse(stored);
                
                // Проверяем версию и срок годности
                if (parsed.version === this.storageVersion) {
                    const age = Date.now() - parsed.timestamp;
                    
                    if (age < this.storageDuration) {
                        console.log('📦 Используем сохраненные UTM первого визита');
                        console.log(`📅 Возраст данных: ${Math.floor(age / (24 * 60 * 60 * 1000))} дней`);
                        return; // Уже сохранено и актуально
                    }
                }
            }
            
            // Сохраняем новые данные
            const dataToStore = {
                version: this.storageVersion,
                timestamp: Date.now(),
                utm: utmData
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
            console.log('💾 UTM первого визита сохранены в localStorage');
            
        } catch (error) {
            console.warn('⚠️ Не удалось сохранить в localStorage:', error);
        }
    }
    
    /**
     * Получает сохраненные UTM первого визита
     */
    getFirstVisitUTM() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return null;
            
            const parsed = JSON.parse(stored);
            
            // Проверяем версию
            if (parsed.version !== this.storageVersion) {
                return null;
            }
            
            // Проверяем срок годности
            const age = Date.now() - parsed.timestamp;
            if (age >= this.storageDuration) {
                localStorage.removeItem(this.storageKey);
                return null;
            }
            
            return parsed.utm;
            
        } catch (error) {
            console.warn('⚠️ Не удалось прочитать localStorage:', error);
            return null;
        }
    }
    
    /**
     * Очищает сохраненные данные (для тестирования)
     */
    clearStorage() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ localStorage очищен');
    }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.utmTracker = new UTMTracker();
});

// Глобальная утилита для отладки
window.debugUTM = {
    getFirstVisit: () => window.utmTracker?.getFirstVisitUTM(),
    clearStorage: () => window.utmTracker?.clearStorage(),
    reinit: () => {
        window.utmTracker = new UTMTracker();
    }
};

console.log('💡 Debug UTM доступен через window.debugUTM');
console.log('  - debugUTM.getFirstVisit() - получить сохраненные UTM');
console.log('  - debugUTM.clearStorage() - очистить localStorage');
console.log('  - debugUTM.reinit() - переинициализировать трекер');
