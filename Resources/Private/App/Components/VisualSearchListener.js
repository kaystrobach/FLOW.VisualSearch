export class VisualSearchListener extends HTMLElement {
  constructor() {
    super();
    this._active = false;
    this._handler = this.handleEvent.bind(this);
    this._observedElements = null;
    this._templateRendered = false;
    this._currentEvent = null;
  }

  static get observedAttributes() {
    return ['event', 'selector'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this._removeListeners();
      this._setupListeners();
    }
  }

  get event() {
    return this.getAttribute('event') || '';
  }

  set event(value) {
    this.setAttribute('event', value);
  }

  get selector() {
    return this.getAttribute('selector') || '';
  }

  set selector(value) {
    this.setAttribute('selector', value);
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = !!value;
    this._update();
  }

  connectedCallback() {
    this._setupListeners();
    this._update();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  _setupListeners() {
    const eventName = this.event;
    const selector = this.selector;
    if (!eventName) return;

    if (selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.addEventListener(eventName, this._handler));
      this._observedElements = elements;
    } else {
      // If no selector, listen on document for bubbled events from any visual-search
      window.addEventListener(eventName, this._handler);
      this._observedElements = null;
    }
    this._currentEvent = eventName;
  }

  _removeListeners() {
    const eventName = this._currentEvent;
    if (!eventName) return;

    if (this._observedElements) {
      this._observedElements.forEach(el => el.removeEventListener(eventName, this._handler));
      this._observedElements = null;
    } else {
      window.removeEventListener(eventName, this._handler);
    }
    this._currentEvent = null;
  }

  handleEvent(event) {
    // If we have a selector, we already filtered by adding listener to specific elements.
    // If we don't have a selector, we might want to ensure it's coming from a visual-search component,
    // but the requirement says "all searches", so we'll trust the event name.
    this.active = true;
  }

  _update() {
    this.hidden = !this._active;
    if (this._active && !this._templateRendered) {
      const template = this.querySelector('template');
      if (template) {
        this.appendChild(template.content.cloneNode(true));
        this._templateRendered = true;
      }
    }
  }
}

customElements.define('visual-search-listener', VisualSearchListener);
