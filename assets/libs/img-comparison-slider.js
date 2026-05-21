/**
 * img-comparison-slider v8.0.6
 * Локальная копия для проекта PhotoReborn AI
 * https://github.com/sneas/img-comparison-slider
 * MIT License
 */
(function() {
  'use strict';

  // Утилиты
  const inBetween = (value, min, max) => Math.max(min, Math.min(max, value));
  
  const isElementAffected = (element, event) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const getTouchPagePoint = (e) => ({
    x: e.touches[0].pageX,
    y: e.touches[0].pageY,
  });

  const getMousePagePoint = (e) => ({
    x: e.pageX,
    y: e.pageY,
  });

  // Стили компонента
  const styles = `
:host {
  --divider-width: 1px;
  --divider-color: #fff;
  --divider-shadow: none;
  --default-handle-width: 50px;
  --default-handle-color: #fff;
  --default-handle-opacity: 1;
  --default-handle-shadow: none;
  --handle-position-start: 50%;
  position: relative;
  display: inline-block;
  overflow: hidden;
  line-height: 0;
  direction: ltr;
}

:host(:focus) {
  outline: 2px solid -webkit-focus-ring-color;
  outline-offset: 1px;
}

::slotted(*) {
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

::slotted(img) {
  /* 🍎 SAFARI CRITICAL FIX: Explicit sizing + composite layer */
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  
  /* 🔧 CORE: object-fit с fallback для Safari */
  object-fit: contain !important;
  object-position: center center !important;
  
  /* 🍎 WebKit-specific overrides */
  -webkit-object-fit: contain !important;
  -webkit-object-position: center center !important;
  
  /* 🚀 CRITICAL: Force composite layer (fixes clip-path timing) */
  transform: translateZ(0) scale(1.0001) !important;
  -webkit-transform: translateZ(0) scale(1.0001) !important;
  will-change: transform !important;
  
  /* 🍎 Safari: Additional containment */
  contain: layout style paint !important;
  
  /* 🎯 Safari: Prevent stretching */
  max-width: 100% !important;
  max-height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  
  /* 🍎 Safari: Box model fixes */
  box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
  
  /* 🔄 Safari: Image rendering optimization */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.first {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  line-height: normal;
  font-size: 100%;
  max-height: 100%;
  height: 100%;
  width: 100%;
  --exposure: 50%;
  --keyboard-transition-time: 0ms;
  --default-transition-time: 0ms;
  --transition-time: var(--default-transition-time);
  
  /* 🍎 SAFARI: Enhanced flexbox centering */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  
  /* 🚀 Force composite layer for both containers */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: auto;
  
  /* 🍎 Safari: Containment for performance */
  contain: layout style;
  
  /* 🍎 Safari: Prevent flex item collapse */
  flex-shrink: 0;
  
  /* WebKit/iOS Safari: Принудительная GPU акселерация */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  perspective: 1000;
}

.first .first-overlay-container {
  position: relative;
  clip-path: inset(0 var(--exposure) 0 0);
  transition: clip-path var(--transition-time);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* iOS Safari: Улучшенная обработка clip-path + flexbox */
  -webkit-clip-path: inset(0 var(--exposure) 0 0);
  overflow: hidden;
  
  /* Исправление timing issue в Safari для clip-path + object-fit */
  will-change: clip-path;
  contain: layout style paint;
}

.first .first-overlay {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.first.focused {
  will-change: clip-path;
}

.first.focused .first-overlay-container {
  will-change: clip-path;
}

.second {
  position: relative;
  width: 100%;
  height: 100%;
  
  /* 🍎 SAFARI: Enhanced flexbox centering */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  
  /* 🚀 Force composite layer for both containers */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: auto;
  
  /* 🍎 Safari: Containment for performance */
  contain: layout style;
  
  /* 🍎 Safari: Prevent flex item collapse */
  flex-shrink: 0;
  
  /* WebKit/iOS Safari: Симметричная обработка как у .first */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  perspective: 1000;
}

.handle-container {
  transform: translateX(50%);
  position: absolute;
  top: 0;
  right: var(--exposure);
  height: 100%;
  transition: right var(--transition-time), bottom var(--transition-time);
}

.focused .handle-container {
  will-change: right;
}

.divider {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.divider:after {
  content: ' ';
  display: block;
  height: 100%;
  border-left-width: var(--divider-width);
  border-left-style: solid;
  border-left-color: var(--divider-color);
  box-shadow: var(--divider-shadow);
}

.handle {
  position: absolute;
  top: var(--handle-position-start);
  pointer-events: none;
  box-sizing: border-box;
  margin-left: 1px;
  transform: translate(calc(-50% - 0.5px), -50%);
  line-height: 0;
}

.default-handle {
  width: var(--default-handle-width);
  opacity: var(--default-handle-opacity);
  transition: all 1s;
  filter: drop-shadow(var(--default-handle-shadow));
}

.default-handle path {
  stroke: var(--default-handle-color);
}

.vertical .first-overlay-container {
  clip-path: inset(0 0 var(--exposure) 0);
}

.vertical .handle-container {
  transform: translateY(50%);
  height: auto;
  top: unset;
  bottom: var(--exposure);
  width: 100%;
  left: 0;
  flex-direction: row;
}

.vertical .divider:after {
  height: 1px;
  width: 100%;
  border-top-width: var(--divider-width);
  border-top-style: solid;
  border-top-color: var(--divider-color);
  border-left: 0;
}

.vertical .handle {
  top: auto;
  left: var(--handle-position-start);
  transform: translate(calc(-50% - 0.5px), -50%) rotate(90deg);
}
`;

  // Template HTML
  const templateHtml = `
<div class="second" id="second">
  <slot name="second"><slot name="before"></slot></slot>
</div>
<div class="first" id="first">
  <div class="first-overlay">
    <div class="first-overlay-container" id="firstImageContainer">
      <slot name="first"><slot name="after"></slot></slot>
    </div>
  </div>
  <div class="handle-container">
    <div class="divider"></div>
    <div class="handle" id="handle">
      <slot name="handle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="default-handle"
          viewBox="-8 -3 16 6"
        >
          <path
            d="M -5 -2 L -7 0 L -5 2 M 5 -2 L 7 0 L 5 2"
            fill="none"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </slot>
    </div>
  </div>
</div>
`;

  // Константы
  const TABINDEX = 0;
  const RENDERED_CLASS = 'rendered';
  const slideAnimationPeriod = 1000 / 60;

  const KeySlideOffset = {
    ArrowLeft: -1,
    ArrowRight: 1,
  };

  const slideDirections = ['horizontal', 'vertical'];

  // Web Component класс
  class HTMLImgComparisonSliderElement extends HTMLElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const styleEl = document.createElement('style');
      styleEl.innerHTML = styles;
      
      if (this.getAttribute('nonce')) {
        styleEl.setAttribute('nonce', this.getAttribute('nonce'));
      }
      shadowRoot.appendChild(styleEl);

      const template = document.createElement('template');
      template.innerHTML = templateHtml;
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.firstElement = shadowRoot.getElementById('first');
      this.handleElement = shadowRoot.getElementById('handle');

      this.exposure = this.hasAttribute('value') ? parseFloat(this.getAttribute('value')) : 50;
      this.slideOnHover = false;
      this.slideDirection = 'horizontal';
      this.keyboard = 'enabled';
      this.isMouseDown = false;
      this.animationDirection = 0;
      this.transitionTimer = null;
      this.isFocused = false;
      this.dragByHandle = false;
      this.touchStartPoint = null;
      this.isTouchComparing = false;
      this.hasTouchMoved = false;
      this.imageWidth = 0;
      this.imageHeight = 0;
    }

    static get observedAttributes() {
      return ['hover', 'direction', 'keyboard'];
    }

    get value() {
      return this.exposure;
    }

    set value(newValue) {
      const newExposure = parseFloat(newValue);
      if (newExposure === this.exposure) return;
      this.exposure = newExposure;
      this.enableTransition();
      this.setExposure();
    }

    get hover() {
      return this.slideOnHover;
    }

    set hover(newValue) {
      this.slideOnHover = newValue.toString().toLowerCase() !== 'false';
      this.removeEventListener('mousemove', this.onMouseMove);
      if (this.slideOnHover) {
        this.addEventListener('mousemove', this.onMouseMove);
      }
    }

    get direction() {
      return this.slideDirection;
    }

    set direction(newValue) {
      this.slideDirection = newValue.toString().toLowerCase();
      this.slide(0);
      this.firstElement.classList.remove(...slideDirections);
      if (slideDirections.includes(this.slideDirection)) {
        this.firstElement.classList.add(this.slideDirection);
      }
    }

    get handle() {
      return this.dragByHandle;
    }

    set handle(newValue) {
      this.dragByHandle = newValue.toString().toLowerCase() !== 'false';
    }

    connectedCallback() {
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = TABINDEX;
      }

      this.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });

      const resizeObserver = new ResizeObserver(this.resetDimensions);
      resizeObserver.observe(this);

      this.setExposure(0);

      this.keyboard = this.hasAttribute('keyboard') && this.getAttribute('keyboard') === 'disabled' ? 'disabled' : 'enabled';

      this.addEventListener('keydown', this.onKeyDown);
      this.addEventListener('keyup', this.onKeyUp);
      this.addEventListener('focus', this.onFocus);
      this.addEventListener('blur', this.onBlur);
      this.addEventListener('touchstart', this.onTouchStart, { passive: true });
      this.addEventListener('touchmove', this.onTouchMove, { passive: false });
      this.addEventListener('touchend', this.onTouchEnd);
      this.addEventListener('mousedown', this.onMouseDown);

      this.handle = this.hasAttribute('handle') ? this.getAttribute('handle') : this.dragByHandle;
      this.hover = this.hasAttribute('hover') ? this.getAttribute('hover') : this.slideOnHover;
      this.direction = this.hasAttribute('direction') ? this.getAttribute('direction') : this.slideDirection;

      this.resetDimensions();
      if (!this.classList.contains(RENDERED_CLASS)) {
        this.classList.add(RENDERED_CLASS);
      }
    }

    disconnectedCallback() {
      if (this.transitionTimer) {
        window.clearTimeout(this.transitionTimer);
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'hover') this.hover = newValue;
      if (name === 'direction') this.direction = newValue;
      if (name === 'keyboard') this.keyboard = newValue === 'disabled' ? 'disabled' : 'enabled';
    }

    setExposure(increment = 0) {
      this.exposure = inBetween(this.exposure + increment, 0, 100);
      this.firstElement.style.setProperty('--exposure', `${100 - this.exposure}%`);
    }

    slide(increment = 0) {
      this.setExposure(increment);
      const event = new Event('slide');
      this.dispatchEvent(event);
    }

    onMouseMove = (e) => {
      if (this.isMouseDown || this.slideOnHover) {
        const currentPoint = getMousePagePoint(e);
        this.slideToPage(currentPoint);
      }
    };

    onMouseDown = (e) => {
      if (this.slideOnHover) return;
      if (this.handle && !isElementAffected(this.handleElement, e)) return;

      e.preventDefault();

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onWindowMouseUp);
      this.isMouseDown = true;
      this.enableTransition();

      const currentPoint = getMousePagePoint(e);
      this.slideToPage(currentPoint);

      this.focus();
      this.bodyUserSelectStyle = window.document.body.style.userSelect;
      this.bodyWebkitUserSelectStyle = window.document.body.style.webkitUserSelect;
      window.document.body.style.userSelect = 'none';
      window.document.body.style.webkitUserSelect = 'none';
    };

    onWindowMouseUp = () => {
      this.isMouseDown = false;
      window.document.body.style.userSelect = this.bodyUserSelectStyle;
      window.document.body.style.webkitUserSelect = this.bodyWebkitUserSelectStyle;
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onWindowMouseUp);
    };

    onTouchStart = (e) => {
      if (this.dragByHandle && !isElementAffected(this.handleElement, e)) return;

      this.touchStartPoint = getTouchPagePoint(e);

      if (this.isFocused) {
        this.enableTransition();
        this.slideToPage(this.touchStartPoint);
      }
    };

    onTouchMove = (e) => {
      if (this.touchStartPoint === null) return;

      const currentPoint = getTouchPagePoint(e);

      if (this.isTouchComparing) {
        this.slideToPage(currentPoint);
        e.preventDefault();
        return false;
      }

      if (!this.hasTouchMoved) {
        const offsetY = Math.abs(currentPoint.y - this.touchStartPoint.y);
        const offsetX = Math.abs(currentPoint.x - this.touchStartPoint.x);

        if (
          (this.slideDirection === 'horizontal' && offsetY < offsetX) ||
          (this.slideDirection === 'vertical' && offsetY > offsetX)
        ) {
          this.isTouchComparing = true;
          this.focus();
          this.slideToPage(currentPoint);
          e.preventDefault();
          return false;
        }

        this.hasTouchMoved = true;
      }
    };

    onTouchEnd = () => {
      this.isTouchComparing = false;
      this.hasTouchMoved = false;
      this.touchStartPoint = null;
    };

    onBlur = () => {
      this.stopSlideAnimation();
      this.isFocused = false;
      this.firstElement.classList.remove('focused');
    };

    onFocus = () => {
      this.isFocused = true;
      this.firstElement.classList.add('focused');
    };

    onKeyDown = (e) => {
      if (this.keyboard === 'disabled') return;

      const direction = KeySlideOffset[e.key];
      if (this.animationDirection === direction || direction === undefined) return;

      this.animationDirection = direction;
      this.startSlideAnimation();
    };

    onKeyUp = (e) => {
      if (this.keyboard === 'disabled') return;

      const direction = KeySlideOffset[e.key];
      if (direction === undefined || this.animationDirection !== direction) return;

      this.stopSlideAnimation();
    };

    slideToPage(currentPoint) {
      if (this.slideDirection === 'horizontal') {
        this.slideToPageX(currentPoint.x);
      }
      if (this.slideDirection === 'vertical') {
        this.slideToPageY(currentPoint.y);
      }
    }

    slideToPageX(pageX) {
      const x = pageX - this.getBoundingClientRect().left - window.scrollX;
      this.exposure = (x / this.imageWidth) * 100;
      this.slide(0);
    }

    slideToPageY(pageY) {
      const y = pageY - this.getBoundingClientRect().top - window.scrollY;
      this.exposure = (y / this.imageHeight) * 100;
      this.slide(0);
    }

    enableTransition() {
      const transitionTime = 100;
      this.firstElement.style.setProperty('--transition-time', `${transitionTime}ms`);

      this.transitionTimer = window.setTimeout(() => {
        this.firstElement.style.setProperty('--transition-time', `var(--default-transition-time)`);
        this.transitionTimer = null;
      }, transitionTime);
    }

    startSlideAnimation() {
      let lastTimestamp = null;
      let initialDirection = this.animationDirection;
      this.firstElement.style.setProperty('--transition-time', `var(--keyboard-transition-time)`);
      
      const slide = (now) => {
        if (this.animationDirection === 0 || initialDirection !== this.animationDirection) return;

        if (lastTimestamp === null) lastTimestamp = now;

        const interval = now - lastTimestamp;
        const distance = (interval / slideAnimationPeriod) * this.animationDirection;
        this.slide(distance);

        setTimeout(() => window.requestAnimationFrame(slide), 0);
        lastTimestamp = now;
      };

      window.requestAnimationFrame(slide);
    }

    stopSlideAnimation() {
      this.animationDirection = 0;
      this.firstElement.style.setProperty('--transition-time', `var(--default-transition-time)`);
    }

    resetDimensions = () => {
      this.imageWidth = this.offsetWidth;
      this.imageHeight = this.offsetHeight;
    };
  }

  // Регистрация Web Component
  if (typeof window !== 'undefined' && window.customElements) {
    window.customElements.define('img-comparison-slider', HTMLImgComparisonSliderElement);
    console.log('✅ img-comparison-slider компонент зарегистрирован');
  }
})();

