import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class SearchFacet extends LitElement {
  static styles = css`
      div {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        background-color: #333;
        border-radius: 4px;
        padding: 0 4px;
        user-select: none;
        height: 18px;
        gap: 4px;
      }

      button {
        background-color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        margin: 0;
        height: 16px;
        width: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 8px;
      }
    `;

  static get properties() {
    return {
      facetLabel: {type: String, attribute: 'facet-label'},
      facet: {type: String, attribute: true},
      valueLabel: {type: String, attribute: 'value-label'},
      value: {type: String, attribute: true},
      disabled: {type: Boolean, attribute: true},
    }
  }

  constructor() {
    super();

    this.disabled = false;
  }

  _handleClick() {
    this.dispatchEvent(new CustomEvent('facet-delete', { bubbles: true, composed: true }));
  }

  render() {
    return html`
        <div>
          ${this.facetLabel}: ${this.valueLabel}
          ${this.value ? html`<button @click="${this._handleClick}" @pointerdown=${(event) => event.preventDefault()} ?disabled="${this.disabled}">x</button>` : ''}
        </div>
      `;
  }
}

customElements.define('search-facet', SearchFacet);
