# PhotoReborn AI - Next.js Landing Page

> Современная архитектура лендинга на Next.js 15, shadcn/ui и Framer Motion

## 🚀 Технологический стек

- **Next.js 15.5.4** - React framework с App Router
- **React 19** - Последняя версия React
- **TypeScript** - Типобезопасность
- **Tailwind CSS v4.1.14** - Utility-first CSS framework (новая мажорная версия)
- **shadcn/ui** - Коллекция переиспользуемых компонентов
- **Framer Motion** - Библиотека анимаций
- **Lucide Icons** - Современные иконки

## 📁 Структура проекта

```
new_landing/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Главный layout с Header/Footer
│   ├── page.tsx             # Главная страница
│   ├── globals.css          # Глобальные стили + Tailwind v4 theme
│   └── legal/               # Юридические страницы
│       ├── offer/
│       ├── privacy-policy/
│       ├── pd-consent/
│       └── marketing-consent/
├── components/
│   ├── layout/              # Layout компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Preloader.tsx
│   │   └── LegalLayout.tsx
│   ├── sections/            # Секции лендинга
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── GallerySection.tsx
│   │   └── FinalCTASection.tsx
│   ├── animations/          # Анимационные компоненты
│   │   ├── FadeIn.tsx
│   │   └── Stagger.tsx
│   └── ui/                  # UI компоненты (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       ├── VideoPlayer.tsx
│       └── BeforeAfterSlider.tsx
└── public/
    └── assets/              # Статические файлы
        ├── logo.svg
        ├── video/
        ├── before_after/
        └── law/
```

## 🎨 Ключевые особенности

### 1. Tailwind CSS v4 - Новый синтаксис
Проект использует Tailwind CSS v4 с **новым CSS-first подходом**:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: 258 88% 66%;
  --color-secondary: 258 50% 74%;
  /* ... */
}
```

**Важно:** Не используйте старый синтаксис `@tailwind base;` - это Tailwind v3!

### 2. Framer Motion анимации
Все анимации реализованы через Framer Motion для максимальной гибкости:

```tsx
<FadeIn direction="up" delay={0.2}>
  <h1>Заголовок</h1>
</FadeIn>
```

### 3. Before/After Slider с умной подсказкой
- ✅ Автоматическое движение ползунка (6 секунд)
- ✅ Анимированная рука-палец (полупрозрачная)
- ✅ Иконка `⇄` на ручке
- ✅ Без затемнения фона
- ✅ Останавливается при первом касании

### 4. Умный Preloader
- Показывается всегда (важно для загрузки видео)
- Черный экран с пульсирующим логотипом
- Плавное исчезновение после загрузки

### 5. Адаптивное видео
- Упрощенная версия без избыточной логики
- Автоматический выбор WebM/MP4
- HD для desktop, Light для mobile
- Fullscreen режим

## 🛠 Команды для разработки

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка production версии
npm run build

# Запуск production сервера
npm start

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

## 📱 Адаптивность

Проект полностью адаптивен для:
- ✅ iOS (iPhone, iPad)
- ✅ Android (все размеры)
- ✅ Desktop (все разрешения)
- ✅ Safe area insets для iPhone X+

## 🎯 Цветовая палитра

| Цвет | Значение | Использование |
|------|----------|---------------|
| Primary | `#8b5cf6` | Кнопки, акценты |
| Secondary | `#a78bfa` | Hover states |
| Background | `#000000` → `#1b0c2d` | Градиентный фон |
| Foreground | `#ffffff` | Основной текст |
| Muted | `rgba(255,255,255,0.05)` | Карточки, поверхности |

## ⚡ Производительность

- **First Load JS:** ~164 KB (главная страница)
- **Static Generation:** Все страницы pre-rendered
- **Image Optimization:** Автоматическая оптимизация через Next.js Image
- **Code Splitting:** Автоматический lazy loading компонентов

## 📝 Важные заметки для разработки

### Tailwind CSS v4
```css
/* ❌ Старый синтаксис (v3) - НЕ ИСПОЛЬЗОВАТЬ */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ Новый синтаксис (v4) */
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.72 0.11 178);
}
```

### shadcn/ui компоненты
```bash
# Добавление новых компонентов
npx shadcn@latest add [component-name]

# Список доступных компонентов
npx shadcn@latest add
```

### Framer Motion
```tsx
// Все анимации должны быть в "use client" компонентах
"use client";

import { motion } from "framer-motion";
```

## 🔗 UTM метки

Все ссылки на Telegram-бот содержат UTM метки:
- `utm_source=landing`
- `utm_medium=button`
- `utm_campaign=photoreborn_launch` (или `examples_section`)

## 🌐 Деплой

Проект готов для деплоя на:
- **Vercel** (рекомендуется)
- **Netlify**
- **Cloudflare Pages**
- Любой хостинг с поддержкой Node.js

## 📞 Контакты

- **Telegram бот:** @PhotoReborn_bot
- **Канал поддержки:** @PhotoReborn
- **Email:** alexander.kz.mail@gmail.com

---

**Последнее обновление:** 02.10.2025  
**Версия:** 2.0 (Next.js migration)
