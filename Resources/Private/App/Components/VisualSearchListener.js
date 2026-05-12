import {LitElement, html, css} from 'lit';

export class VisualSearchListener extends LitElement {
  static get properties() {
    return {
      event: {type: String},
      selector: {type: String},
      active: {type: Boolean, state: true}
    };
  }

  constructor() {
    super();
    this.event = '';
    this.selector = '';
    this.active = false;
    this._handler = this.handleEvent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeListeners();
  }

  updated(changedProperties) {
    if (changedProperties.has('event') || changedProperties.has('selector')) {
      this._removeListeners();
      this._setupListeners();
    }
  }

  _setupListeners() {
    if (!this.event) return;

    if (this.selector) {
      const elements = document.querySelectorAll(this.selector);
      elements.forEach(el => el.addEventListener(this.event, this._handler));
      this._observedElements = elements;
    } else {
      // If no selector, listen on document for bubbled events from any visual-search
      window.addEventListener(this.event, this._handler);
      this._observedElements = null;
    }
  }

  _removeListeners() {
    if (!this.event) return;

    if (this._observedElements) {
      this._observedElements.forEach(el => el.removeEventListener(this.event, this._handler));
    } else {
      window.removeEventListener(this.event, this._handler);
    }
  }

  handleEvent(event) {
    // If we have a selector, we already filtered by adding listener to specific elements.
    // If we don't have a selector, we might want to ensure it's coming from a visual-search component,
    // but the requirement says "all searches", so we'll trust the event name.
    this.active = true;
    this.requestUpdate();
  }

  render() {
    if (!this.active) {
      return html``;
    }

    const template = this.querySelector('template');

    if (template) {
      return html`${template.content.cloneNode(true)}`;
    }

    return html`<slot></slot>`;
  }
}

customElements.define('visual-search-listener', VisualSearchListener);
