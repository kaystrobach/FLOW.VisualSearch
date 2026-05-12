import {LitElement, html, css} from 'lit';

export class VisualSearchSort extends LitElement {
  static get properties() {
    return {
      asc: {type: String},
      desc: {type: String},
      selector: {type: String},
      template: {type: String},
      _state: {type: String, state: true} // 'neutral', 'asc', 'desc'
    };
  }

  constructor() {
    super();
    this.asc = '';
    this.desc = '';
    this.selector = 'visual-search';
    this.template = '';
    this._state = 'neutral';
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateStateFromSearch();
    // Listen for search updates to keep state in sync
    window.addEventListener('search', this._boundUpdateState = this._updateStateFromSearch.bind(this));
    window.addEventListener('sorting', this._boundUpdateState);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('search', this._boundUpdateState);
    window.removeEventListener('sorting', this._boundUpdateState);
  }

  _updateStateFromSearch() {
    const search = document.querySelector(this.selector);
    if (!search || !search.query) return;

    const currentSort = search.query.sorting;
    if (currentSort === this.asc) {
      this._state = 'asc';
    } else if (this.desc && currentSort === this.desc) {
      this._state = 'desc';
    } else {
      this._state = 'neutral';
    }
  }

  _toggleSort() {
    const search = document.querySelector(this.selector);
    if (!search) return;

    let nextSort = '';
    if (this._state === 'neutral') {
      nextSort = this.asc;
    } else if (this._state === 'asc') {
      nextSort = this.desc ? this.desc : this.asc;
    } else if (this._state === 'desc') {
      nextSort = this.asc;
    }

    // Directly update the select if it exists in the shadow DOM of search
    // Or call a method on search.
    // VisualSearch uses this.collectQuery() which reads from this._sort() (the select element)
    // So we should ideally update the select element value and trigger its change event,
    // or better, add a method to VisualSearch to set sorting.

    if (typeof search.setSorting === 'function') {
        search.setSorting(nextSort);
    } else {
        // Fallback if we didn't update VisualSearch yet
        const sortSelect = search.renderRoot ? search.renderRoot.querySelector('#sorting') : null;
        if (sortSelect) {
            sortSelect.value = nextSort;
            sortSelect.dispatchEvent(new Event('change'));
        }
    }
  }

  static styles = css`
    :host {
      display: inline-block;
      cursor: pointer;
    }
  `;

  render() {
    if (this.template) {
      const templateEl = document.getElementById(this.template);
      if (templateEl && templateEl.tagName === 'TEMPLATE') {
        const content = templateEl.content.cloneNode(true);
        // Find elements with data-state attribute or similar?
        // Lit-html doesn't easily support dynamic template binding from DOM templates this way.
        // Let's use a simpler approach: the component will just render the template's content
        // and we can use CSS to show/hide parts based on the state.
        return html`
          <div @click="${this._toggleSort}" class="state-${this._state}">
            ${content}
          </div>
        `;
      }
    }

    return html`
      <div @click="${this._toggleSort}">
        <slot name="${this._state}">
          ${this._renderDefault()}
        </slot>
      </div>
    `;
  }

  _renderDefault() {
    switch (this._state) {
      case 'asc':
        return html`▲`;
      case 'desc':
        return html`▼`;
      default:
        return html`↕`;
    }
  }
}

customElements.define('visual-search-sort', VisualSearchSort);
