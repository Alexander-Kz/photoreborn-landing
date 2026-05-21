# Заметки по миграции на Next.js

## 🎯 Что было улучшено

### 1. Архитектура
**Было:** Монолитные файлы (index.html, styles.css, script.js)  
**Стало:** Модульная компонентная архитектура

**Преимущества:**
- ✅ Каждый компонент — отдельный файл
- ✅ Легко находить и редактировать код
- ✅ Переиспользование компонентов
- ✅ TypeScript для предотвращения ошибок

### 2. Before/After Slider
**Было:** Затемнение блокировало взаимодействие  
**Стало:** Анимированная рука без затемнения

**Улучшения:**
- ✅ Полупрозрачная рука-палец следует за ползунком
- ✅ Иконка `⇄` на ручке слайдера
- ✅ Автоматическое движение 6 секунд
- ✅ Останавливается при первом касании
- ✅ Ничего не блокирует просмотр

### 3. Видео-плеер
**Было:** 400+ строк сложной логики VideoOptimizer  
**Стало:** 60 строк простого адаптивного плеера

**Сохранено:**
- ✅ WebM + MP4 fallback
- ✅ HD для desktop, Light для mobile
- ✅ Fullscreen режим
- ✅ Poster image

**Упрощено:**
- ❌ Убрана детекция battery (избыточно)
- ❌ Убрана детекция data saver (браузер сам решает)
- ❌ Убрано ручное переключение quality

### 4. Preloader
**Было:** Показывался с задержкой  
**Стало:** Всегда показывается до загрузки видео

**Причина:** Видео — критически важный элемент, должен загрузиться полностью

### 5. Анимации
**Было:** Intersection Observer + CSS transitions  
**Стало:** 100% Framer Motion

**Преимущества:**
- ✅ Единый подход к анимациям
- ✅ Более мощные возможности
- ✅ Gesture поддержка (drag, swipe)
- ✅ Automatic prefers-reduced-motion
- ✅ Staggered анимации из коробки

### 6. Legal страницы
**Было:** Отдельные HTML файлы, разный дизайн  
**Стало:** Единый LegalLayout компонент

**Улучшения:**
- ✅ Консистентный дизайн всех страниц
- ✅ Кнопка "Назад" на все страницы
- ✅ Адаптивная типографика
- ✅ Сохранен весь юридический текст

## 🔧 Технические детали

### Tailwind CSS v4 - Критические изменения

#### ❌ Старый синтаксис (НЕ РАБОТАЕТ):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #8b5cf6;
}

@layer base {
  * {
    @apply border-border; /* ОШИБКА! */
  }
}
```

#### ✅ Новый синтаксис (v4):
```css
@import "tailwindcss";

@theme {
  --color-primary: 258 88% 66%;
}

@layer base {
  html {
    /* Обычный CSS, не @apply */
    background: #000000;
  }
}
```

### Переменные цветов

В Tailwind v4 переменные называются с префиксом `--color-`:

```css
@theme {
  --color-primary: 258 88% 66%;     /* → bg-primary */
  --color-secondary: 258 50% 74%;   /* → bg-secondary */
  --color-muted: 0 0% 7%;          /* → bg-muted */
}
```

Использование в HTML:
```tsx
<div className="bg-primary text-primary-foreground">
  Текст
</div>
```

### Framer Motion - Паттерны

#### FadeIn компонент:
```tsx
<FadeIn direction="up" delay={0.2}>
  <h1>Заголовок появляется снизу вверх</h1>
</FadeIn>
```

#### Stagger анимации:
```tsx
<Stagger staggerDelay={0.15}>
  <StaggerItem>
    <Card>Первая карточка</Card>
  </StaggerItem>
  <StaggerItem>
    <Card>Вторая карточка (задержка 0.15s)</Card>
  </StaggerItem>
</Stagger>
```

#### Motion hover эффекты:
```tsx
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  whileTap={{ scale: 0.95 }}
>
  <Card />
</motion.div>
```

## 🎨 Компоненты

### Header
- Sticky header с glass-effect при скролле
- Адаптивное мобильное меню
- Анимированный hamburger → X
- Backdrop blur overlay

### VideoPlayer
- Автоматический выбор формата (WebM → MP4)
- Media queries для quality (HD/Light)
- Fullscreen button с hover эффектом
- Качество badge

### BeforeAfterSlider
- Drag & touch поддержка
- Автодемонстрация 6 секунд
- Анимированная рука-подсказка
- Плавное переключение между примерами

### Footer
- Responsive grid layout (1/2/3 колонки)
- Telegram CTA с gradient
- Все legal ссылки
- Disclaimer + Copyright

## 🚀 Запуск проекта

### Development:
```bash
npm run dev
```
Откройте http://localhost:3000

### Production build:
```bash
npm run build
npm start
```

### Проверка типов:
```bash
npm run type-check
```

## 📝 Добавление нового функционала

### Новая секция:
1. Создайте файл `components/sections/NewSection.tsx`
2. Используйте `FadeIn` и `Stagger` для анимаций
3. Импортируйте в `app/page.tsx`

### Новый UI компонент:
```bash
# Добавить компонент из shadcn/ui
npx shadcn@latest add dialog

# Использовать в коде
import { Dialog } from "@/components/ui/dialog";
```

### Новая legal страница:
1. Создайте папку `app/legal/new-page/`
2. Создайте `page.tsx` с `LegalLayout`
3. Добавьте ссылку в Footer

## ⚠️ Важные моменты

### 1. "use client" директива
Все компоненты с:
- Framer Motion
- useState, useEffect
- Event handlers

Должны начинаться с `"use client";`

### 2. Next.js Image
Всегда используйте `next/image`:
```tsx
import Image from "next/image";

<Image
  src="/assets/logo.svg"
  alt="Logo"
  width={32}
  height={32}
  priority  // Для критичных изображений
/>
```

### 3. Ссылки
```tsx
// Внутренние
<Link href="/legal/offer">Оферта</Link>

// Внешние
<a
  href="https://t.me/PhotoReborn_bot"
  target="_blank"
  rel="noopener noreferrer"
>
  Открыть бот
</a>
```

## 🐛 Troubleshooting

### Ошибка: "Cannot apply unknown utility class"
**Причина:** Используете старый Tailwind v3 синтаксис  
**Решение:** Используйте `@import "tailwindcss"` и `@theme {}`

### Ошибка: "border-border is not defined"
**Причина:** В v4 нельзя `@apply` переменные так просто  
**Решение:** Используйте прямые классы: `border border-white/10`

### Компонент не анимируется
**Причина:** Забыли `"use client"`  
**Решение:** Добавьте в начало файла:
```tsx
"use client";
```

### Видео не воспроизводится
**Проверьте:**
1. Файлы в `public/assets/video/`
2. Правильные пути (без `/public` в src)
3. Формат WebM + MP4 fallback

## 📦 Структура package.json

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.0.0",
    "framer-motion": "^11.x",
    "tailwindcss": "4.1.14",
    "lucide-react": "^0.x",
    "@tailwindcss/typography": "^0.x"
  }
}
```

## 🎓 Полезные ссылки

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## 🔄 Миграция с оригинального лендинга

### Сохранено 100%:
- ✅ Весь контент и тексты
- ✅ Цветовая палитра
- ✅ UTM метки
- ✅ Все 6 примеров before/after
- ✅ Юридические документы
- ✅ Логотип и assets

### Улучшено:
- ⭐ Модульная архитектура
- ⭐ TypeScript типизация
- ⭐ Лучшая адаптивность
- ⭐ Оптимизация производительности
- ⭐ SEO meta tags
- ⭐ Accessibility

### Упрощено:
- 🎯 Видео-плеер (60 строк вместо 400)
- 🎯 Единый подход к анимациям
- 🎯 Консистентные legal страницы

---

**Автор миграции:** Claude (Cursor AI Agent)  
**Дата:** 02.10.2025  
**Версия:** 2.0

