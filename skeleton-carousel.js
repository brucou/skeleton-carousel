/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
/* eslint-disable max-len */
/* eslint-disable-next-line max-len */
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {IronA11yKeysBehavior} from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './icons/carousel.js';
import {FlattenedNodesObserver} from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

/**
 * `skeleton-carousel`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SkeletonCarousel extends mixinBehaviors([
  IronA11yKeysBehavior,
  GestureEventListeners,
], PolymerElement) {
  /**
   * Template element
   * @return {!HTMLTemplateElement}
   */
  static get template() {
    return html`
    <!--suppress CssInvalidPseudoSelector -->
    <!--suppress CssUnresolvedCustomProperty -->
    <!--suppress CssUnresolvedCustomPropertySet -->
    <style>
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        contain: content;
        box-sizing: border-box;
        @apply --layout-flex-auto;
        @apply --skeleton-carousel;
        min-height: var(--skeleton-carousel-min-height, 300px);
      }

      :host([direction="horizontal"]) {
        @apply --layout-vertical;
      }

      :host([alt][direction="horizontal"]) {
        @apply --layout-vertical-reverse;
      }

      :host([direction="vertical"]) {
        @apply --layout-inline;
        @apply --layout-horizontal;
      }

      :host([alt][direction="vertical"]) {
        @apply --layout-horizontal-reverse;
      }

      :host,
      #carousel *,
      #container ::slotted(*) {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      }

      #carousel,
      #items,
      #container {
        display: block;
        position: relative;
        width: 100%;
        @apply --layout-flex-auto;
      }

      #carousel,
      #container {
        @apply --layout-vertical;
      }

      #carousel {
        overflow: hidden;
        z-index: 0;
      }

      #items {
        position: relative;
        transform: translate3d(0%, 0%, 0);
        will-change: transform;
      }

      :host([direction="horizontal"]) #items {
        @apply --layout-vertical;
      }

      :host([direction="vertical"]) #items {
        @apply --layout-fit;
      }

      #container {
        @apply --layout-inline;
        @apply --skeleton-carousel-container;
      }

      :host([direction="horizontal"]) #container {
        @apply --layout-horizontal;
        @apply --skeleton-carousel-container-horizontal;
      }

      :host([direction="vertical"]) #container {
        @apply --layout-vertical;
        @apply --layout-wrap;
        @apply --skeleton-carousel-container-vertical;
      }

      #container ::slotted(*) {
        display: block;
        position: relative;
        overflow: hidden;
        @apply --layout-vertical;
        @apply --layout-flex-auto;
        min-width: 100%;
        max-width: 100%;
        width: 100%;
        will-change: auto;
        opacity: .8;
        @apply --skeleton-carousel-item;
      }

      #container ::slotted(.selected) {
        opacity: 1;
        @apply --skeleton-carousel-item-selected;
      }

      /*
      * Controls
      */
      #controls {
        display: block;
        padding: .5rem;
        z-index: 1;
        @apply --layout-center-center;
        @apply --layout-center-justified;
        @apply --skeleton-carousel-controls;
      }

      :host([direction="horizontal"]) #controls {
        @apply --skeleton-carousel-controls-horizontal;
      }

      :host([direction="vertical"]) #controls {
        @apply --skeleton-carousel-controls-vertical;
      }

      :host([direction="horizontal"]) #controls,
      :host([direction="horizontal"]) #dots {
        @apply --layout-horizontal;
      }

      :host([direction="vertical"]) #controls,
      :host([direction="vertical"]) #dots {
        @apply --layout-vertical;
      }

      paper-icon-button {
        border-radius: 50%;
      }

      #dots {
        @apply --layout-flex-auto;
        @apply --layout-center-center;
        @apply --skeleton-carousel-dots;
      }

      #dots paper-icon-button {
        color: var(--skeleton-carousel-dot-color, var(--paper-grey-900));
        opacity: .4;
        @apply --skeleton-carousel-dot;
      }

      #dots paper-icon-button.selected {
        opacity: 1;
        @apply --skeleton-carousel-dot-selected;
      }

      #dots paper-icon-button[disabled] {
        opacity: .4;
        @apply --skeleton-carousel-dot-disabled;
      }

      #prev,
      #next {
        color: var(--skeleton-carousel-nav-color, var(--paper-grey-900));
      }

      #prev,
      #next {
        @apply --skeleton-carousel-nav;
      }

      #prev[disabled],
      #next[disabled] {
        color: var(--skeleton-carousel-nav-disabled-color, var(--paper-grey-600));
        @apply --skeleton-carousel-nav-disabled;
      }

      #prev {
        @apply --skeleton-carousel-nav-prev;
      }

      #next {
        @apply --skeleton-carousel-nav-next;
      }

      [hidden] {
        display: none !important;
      }

      /* Apply transition */
      #items,
      #container ::slotted(*),
      paper-icon-button {
        // -webkit-transition: all 300ms cubic-bezier(.51, .92, .24, 1);
        // -moz-transition: all 300ms cubic-bezier(.51, .92, .24, 1);
        // -ms-transition: all 300ms cubic-bezier(.51, .92, .24, 1);
        // -o-transition: all 300ms cubic-bezier(.51, .92, .24, 1);
        // transition: all 300ms cubic-bezier(.51, .92, .24, 1);
        @apply --skeleton-carousel-transition;
      }

      :host[swiping] #items {
        // -webkit-transition: all 300ms linear;
        // -moz-transition: all 300ms linear;
        // -ms-transition: all 300ms linear;
        // -o-transition: all 300ms linear;
        // transition: all 300ms linear;
      }
    </style>

    <div id="carousel">
      <div id="items">
        <iron-selector id="container" selected="{{selected}}" fallback-selection="0" selected-class="selected" style$="[[_containerHeight]]">
          <slot></slot>
        </iron-selector>
      </div>
    </div>
    <nav id="controls" hidden$="[[!_controls]]">
      <paper-icon-button icon$="[[_iconPrev]]" id="prev" on-tap="prev" disabled$="[[!showPrev]]" hidden$="[[!nav]]"></paper-icon-button>
      <iron-selector id="dots" selected="{{selected}}" fallback-selection="0" selected-class="selected" hidden$="[[!dots]]" tabindex="-1">
        <template is="dom-repeat" items="[[_dots]]">
          <paper-icon-button icon="[[_iconDot(item, selected)]]" disabled$="[[disabled]]"></paper-icon-button>
        </template>
      </iron-selector>
      <paper-icon-button icon$="[[_iconNext]]" id="next" on-tap="next" disabled$="[[!showNext]]" hidden$="[[!nav]]"></paper-icon-button>
    </nav>
`;
  }

  /**
   * @return {string}
   */
  static get is() {
    return 'skeleton-carousel';
  }

  /**
   * @return {object}
   */
  static get properties() {
    return {
      /**
       * Indicates if the carousel is been animated (Transition)
       */
      animating: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * Change slides automatically
       */
      auto: {
        type: Boolean,
        value: false,
        observer: '_autoAnimate',
      },
      /**
       * Carousel direction (horizontal or vertical)
       */
      direction: {
        type: String,
        value: 'horizontal',
        reflectToAttribute: true,
      },
      /**
       * Disables component
       */
      disabled: {
        type: Boolean,
        value: false,
      },
      /**
       * Show navigation dots
       */
      dots: {
        type: Boolean,
        value: false,
      },
      /**
       * Disable swipe functionality
       */
      disableSwipe: {
        type: Boolean,
        value: false,
      },
      /**
       * Disable keyboard navigation
       */
      disableKeys: {
        type: Boolean,
        value: false,
      },
      /**
       * Auto play interval time in milliseconds
       */
      duration: {
        type: Number,
        value: 4000,
      },
      /**
       * Determines if the carousel should be looped.
       * This affects the controls and the drag and drop functionality.
       * Set to `true` if you need to loop the slides.
       */
      loop: {
        type: Boolean,
        value: false,
      },
      /**
       * Show navigation next/prev buttons
       */
      nav: {
        type: Boolean,
        value: false,
      },
      /**
       * Selected slide index
       */
      selected: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true,
        observer: '_selectedObserver',
      },
      /**
       * Selected item
       */
      selectedItem: {
        type: Object,
        notify: true,
        readOnly: true,
        computed: '_computeSelectedItem(selected, _children)',
      },
      /**
       * The user is swiping
       */
      swiping: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true,
        reflectToAttribute: true,
      },
      /**
       * tabindex
       */
      tabindex: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      /**
       * Total number of slides
       */
      total: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true,
        readOnly: true,
      },
      /**
       * Returns true when the carousel has reached the last slide.
       */
      end: {
        type: Boolean,
        value: false,
        notify: true,
        readOny: true,
        reflectToAttribute: true,
        computed: '_computeEnd(total, selected)',
      },
      /**
       * Determines if the next button should be displayed.
       */
      showNext: {
        type: Boolean,
        value: false,
        computed: '_computeShowNext(disabled, total, selected, loop)',
        notify: true,
        reflectToAttribute: true,
        readOnly: true,
      },
      /**
       * Determines if the previous button should be displayed.
       */
      showPrev: {
        type: Boolean,
        value: false,
        computed: '_computeShowPrev(disabled, selected, loop)',
        notify: true,
        reflectToAttribute: true,
        readOnly: true,
      },
      /**
       * Auto interval
       */
      _autoInterval: {
        type: Object,
      },
      /**
       * Children elements
       */
      _children: {
        type: Array,
        value: [],
        observer: '_childrenObserver',
      },
      /**
       * Show navigation controls
       */
      _controls: {
        type: Boolean,
        value: false,
        readOnly: true,
        computed: '_computeControls(dots, nav, total)',
      },
      /**
       * Returns an array with the slides.
       * This will be used to create the dot controls.
       */
      _dots: {
        type: Array,
        computed: '_computeDots(total)',
        readOnly: true,
        value: [],
      },
      /**
       * Icon for the previous button
       */
      _iconPrev: {
        type: String,
        value: 'carousel:arrow-back',
        readOnly: true,
        computed: '_computeIconPrev(direction)',
      },
      /**
       * Icon for the next button
       */
      _iconNext: {
        type: String,
        value: 'carousel:arrow-forward',
        readOnly: true,
        computed: '_computeIconNext(direction)',
      },
      /**
       * Icon for the next button
       */
      _containerHeight: {
        type: String,
        value: 'height: 100%;',
        computed: '_computeContainerHeight(direction, total)',
        readOnly: true,
      },
      /**
       * X Axis position (0 - 1)
       */
      _x: {
        type: Number,
        value: 0,
      },
      /**
       * Y Axis position (0 - 1)
       */
      _y: {
        type: Number,
        value: 0,
      },
    };
  }

  /**
   * Ready event
   */
  connectedCallback() {
    super.connectedCallback();
    const container = this.shadowRoot.querySelector('slot');

    // Allow vertical scrolling
    const carousel = this.shadowRoot.querySelector('#carousel');
    Gestures.addListener(carousel, 'track', this._drag.bind(this));
    this.setScrollDirection('all', carousel);

    new FlattenedNodesObserver(container, () => {
      this._children = FlattenedNodesObserver.getFlattenedNodes(this)
        .filter((n) =>
          n.nodeType === Node.ELEMENT_NODE
          && n.nodeName !== 'DOM-REPEAT'
          && n.nodeName !== 'TEMPLATE');
    });
    // Handle transition end
    const items = this.shadowRoot.querySelector('#items');
    items.addEventListener('transitionend', (e) => {
      e.preventDefault();
      if (this.swiping || e.propertyName !== 'transform') {
        return;
      }
      this._setAnimating(false);
    });
  }

  /**
   * @return {Array}
   */
  static get observers() {
    return [
      '_translateObserver(direction, selected, _x, _y)',
    ];
  }

  /**
   * Key bindings
   * @return {object}
   */
  get keyBindings() {
    return {
      'left up': '_prevKey',
      'right down': '_nextKey',
    };
  }

  /**
   * Computed the selected item
   *
   * @param {number} selected
   * @param {array} children
   * @return {object}
   * @private
   */
  _computeSelectedItem(selected, children) {
    return children[selected];
  }

  /**
   * Children change observer
   *
   * @param {array} children
   * @private
   */
  _childrenObserver(children) {
    this._setTotal(children.length);
    this._lazyContent(0);
    if (children.length >= 1) this._lazyContent(1);
  }

  /**
   * Go to the previous slide with keybindings
   *
   * @param {object} event
   * @private
   * @return {*}
   */
  _prevKey(event) {
    if (this.disableKeys || this.disabled) return;
    event.preventDefault();
    return this.prev();
  }

  /**
   * Go to the next slide with keybindings
   *
   * @param {object} event
   * @private
   * @return {*}
   */
  _nextKey(event) {
    if (this.disableKeys || this.disabled) return;
    event.preventDefault();
    return this.next();
  }

  /**
   * Observer on auto to turn on and off the feature
   *
   * @param {boolean} auto
   * @private
   */
  _autoAnimate(auto) {
    if (auto) {
      this._autoInterval = setInterval(() => {
        this.next();
      }, this.duration);
    } else {
      clearInterval(this._autoInterval);
    }
  }

  /**
   * Go to next slide
   */
  next() {
    if (this.disabled) return;
    const element = this.shadowRoot.querySelector('#container');
    let total = this.total;
    if (this.selected < --total || this.loop) {
      this._setAnimating(true);
      element.selectNext();
    }
  }

  /**
   * Go to previous slide
   */
  prev() {
    if (this.disabled) return;
    const element = this.shadowRoot.querySelector('#container');
    if (this.selected > 0 || this.loop) {
      this._setAnimating(true);
      element.selectPrevious();
    }
  }

  /**
   * Switch the icon if the item is selected
   *
   * @param {number} item
   * @param {number} selected
   * @return {string}
   * @private
   */
  _iconDot(item, selected) {
    item--;
    let icon = 'carousel:radio-button-unchecked';
    if (Number(item) === Number(selected)) icon = 'carousel:radio-button-checked';
    return icon;
  }

  /**
   * Listen for changes on the selected item
   *
   * @param {number} newValue
   * @param {number} oldValue
   * @private
   */
  _selectedObserver(newValue, oldValue) {
    this._lazyContent(newValue);
    let total = this.total;
    if (newValue < --total) {
      this._lazyContent(++newValue);
    }
    // Reset auto
    this._autoAnimate(false);
    this._autoAnimate(this.auto);
  }

  /**
   * Lazy load content for the given slider number
   * Replaces 'data-src' attribute to 'src'.
   *
   * @param {number} selected
   * @private
   */
  _lazyContent(selected) {
    const child = this._children[selected];
    if (!child) return;
    // lazy load first level content
    if (child.hasAttribute('data-src')) {
      child.src = child.getAttribute('data-src');
      child.removeAttribute('data-src');
    }
    // Lazy load child content
    const content = child.querySelectorAll('[data-src]');
    if (content.length <= 0) return;
    let i = 0;
    for (i; i < content.length; ++i) {
      content[i].src = content[i].getAttribute('data-src');
      content[i].removeAttribute('data-src');
    }
  }

  /**
   * Determine if it should show the next button
   *
   * @param {boolean} disabled
   * @param {number} total
   * @param {number} selected
   * @param {boolean} loop
   * @return {boolean}
   * @private
   */
  _computeShowNext(disabled, total, selected, loop) {
    if (disabled) return false;
    if (loop) return true;
    return selected < --total;
  }

  /**
   * Determine if it should show the next button
   *
   * @param {boolean} disabled
   * @param {number} selected
   * @param {boolean} loop
   * @return {boolean}
   * @private
   */
  _computeShowPrev(disabled, selected, loop) {
    if (disabled) return false;
    if (loop) return true;
    return selected > 0;
  }

  /**
   * Returns the dots array
   *
   * @param {number} total
   * @return {Array}
   * @private
   */
  _computeDots(total) {
    let array = [];
    if (total <= 0) return array;
    let i = 1;
    total = ++total;
    for (i; i < total; ++i) {
      array.push(i);
    }
    return array;
  }

  /**
   * Determines if the current item is the last one on the list
   *
   * @param {number} total
   * @param {number} selected
   * @return {boolean}
   * @private
   */
  _computeEnd(total, selected) {
    const status = selected === --total;
    if (status) this._event('end');
    return status;
  }

  /**
   * Returns a valid value
   *
   * @param {number} value
   * @return {*}
   * @private
   */
  _normalize(value) {
    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }
    return value;
  }

  /**
   * Returns the percentage that will to position the icon
   *
   * @param {number|string} value
   * @return {string}
   * @private
   */
  _calcPercentage(value) {
    value = value.toFixed(2);
    return `${value * 100}%`;
  }

  /**
   * Listen for track and move the container
   *
   * @param {object} event
   * @private
   */
  _drag(event) {
    if (this.disableSwipe || this.disabled) {
      // Reset selected to original in case is changed while dragging
      this._x = 0;
      this._y = 0;
      this._setSwiping(false);
      return;
    }
    const width = this.offsetWidth;
    const height = this.offsetHeight;
    const x = event.detail.ddx ? event.detail.ddx : 0;
    const y = event.detail.ddy ? event.detail.ddy : 0;
    let finalX = x / width;
    let finalY = y / height;
    let finalLeft = 0;
    let finalTop = 0;

    if (this.direction === 'horizontal') finalLeft = this._x + finalX;
    if (this.direction === 'vertical') finalTop = this._y + finalY;

    let finalPositionLeft = Number(finalLeft);
    let finalPositionTop = Number(finalTop);
    // Prevent drag to the wrong direction if is not available
    if (!this.showPrev) {
      if (finalPositionLeft > 0) {
        finalPositionLeft = 0;
      }
      if (finalPositionTop > 0) {
        finalPositionTop = 0;
      }
    }
    if (!this.showNext) {
      if (finalPositionLeft < 0) {
        finalPositionLeft = 0;
      }
      if (finalPositionTop < 0) {
        finalPositionTop = 0;
      }
    }
    switch (event.detail.state) {
      case 'track':
        this._autoAnimate(false);
        this._x = finalPositionLeft;
        this._y = finalPositionTop;
        this._setSwiping(true);
        break;
      case 'end':
        this._autoAnimate(this.auto);
        this._x = 0;
        this._y = 0;
        this._setSwiping(false);
        if (finalPositionLeft >= 0.1 || finalPositionTop >= 0.1) {
          this.prev();
        }
        else if (finalPositionLeft <= -0.1 || finalPositionTop <= -0.1) {
          this.next();
        }
        break;
    }
  }

  /**
   * Compute icon previews
   *
   * @param {string|null} direction
   * @return {string}
   * @private
   */
  _computeIconPrev(direction) {
    if (direction === 'vertical') return 'carousel:arrow-upward';
    return 'carousel:arrow-back';
  }

  /**
   * Compute icon next
   *
   * @param {string|null} direction
   * @return {string}
   * @private
   */
  _computeIconNext(direction) {
    if (direction === 'vertical') return 'carousel:arrow-downward';
    return 'carousel:arrow-forward';
  }

  /**
   * Translate swipe observer
   *
   * @param {string} direction
   * @param {number} selected
   * @param {number} _x
   * @param {number} _y
   * @private
   */
  _translateObserver(direction, selected, _x, _y) {
    if (_x !== 0 || _y !== 0) {
      this._setAnimating(true);
    }
    let finalX = 0;
    let finalY = 0;
    let baseSelected = -Math.abs(selected);
    if (selected <= 0) baseSelected = 0;
    if (_x === 0 && _y === 0) {
      const percentage = this._calcPercentage(baseSelected);
      if (direction === 'horizontal') finalX = percentage;
      if (direction === 'vertical') finalY = percentage;
    } else {
      // add baseSelected to the original value of the drag value
      _x = baseSelected + _x;
      _y = baseSelected + _y;
      if (direction === 'horizontal') {
        finalX = this._calcPercentage(_x);
      }
      if (direction === 'vertical') {
        finalY = this._calcPercentage(_y);
      }
    }

    const element = this.shadowRoot.querySelector('#items');
    let transform = '';
    if (direction === 'horizontal') {
      transform = `translateX(${finalX})`;
    }
    if (direction === 'vertical') {
      transform = `translateY(${finalY})`;
    }
    element.style.transform = transform;
  }

  /**
   * Compute translate swipe
   *
   * @param {number} position
   * @param {number} selected
   * @return {number}
   * @private
   */
  _returnDragPosition(position, selected) {
    return position - selected;
  }

  /**
   * Compute items container height
   *
   * @param {string} direction
   * @param {number} total
   * @return {string}
   * @private
   */
  _computeContainerHeight(direction, total) {
    let height = 'auto';
    if (direction === 'vertical') height = this._calcPercentage(total);
    return `height: ${height};`;
  }

  /**
   * Compute Controls
   * Returns true if needs to display the control.s
   *
   * @param {boolean} dots
   * @param {boolean} nav
   * @param {number} total
   * @return {boolean}
   * @private
   */
  _computeControls(dots, nav, total) {
    return total > 1 && (dots || nav);
  }

  /**
   * Fire event
   *
   * @param {string} name
   * @param {null|string|boolean} detail
   * @private
   */
  _event(name, detail = '') {
    this.dispatchEvent(new CustomEvent(name, {
      detail: detail, bubbles: true, composed: true,
    }));
  }
}

window.customElements.define('skeleton-carousel', SkeletonCarousel);
