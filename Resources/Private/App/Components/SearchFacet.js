import {LitElement, html, css} from 'lit';

export class SearchFacet extends LitElement {
  static styles = css`
      :host {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        background-color: var(--visual-search-facet-background-color, lightgray);
        color: var(--visual-search-facet-color, black);
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
        padding: 0;
        margin: 0;
        height: 16px;
        width: 16px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        color: black;
      }
    
      button:disabled {
        color: graytext;
      }

      .lock {
        box-sizing: border-box;
        position: relative;
        display: block;
        transform: scale(0.4);
        width: 12px;
        height: 11px;
        border: 2px solid;
        border-top-right-radius: 50%;
        border-top-left-radius: 50%;
        border-bottom: transparent;
        margin-top: calc(-8px * 0.6); // -12px;
        background: transparent;
        min-width: 12px;
        min-height: 11px;
      }

      .lock::after {
        content: "";
        display: block;
        box-sizing: border-box;
        position: absolute;
        width: 16px;
        height: 10px;
        border-radius: 2px;
        border: 2px solid transparent;
        box-shadow: 0 0 0 2px;
        left: -4px;
        top: 9px;
      }

      .close {
        box-sizing: border-box;
        position: relative;
        display: block;
        transform: scale(0.6);
        width: 22px;
        height: 22px;
        border: 2px solid transparent;
        border-radius: 40px;
        background: transparent;
        min-width: 22px;
        min-height: 22px;
      }
    
      .close::after,
      .close::before {
        content: "";
        display: block;
        box-sizing: border-box;
        position: absolute;
        width: 16px;
        height: 2px;
        background: currentColor;
        transform: rotate(45deg);
        border-radius: 5px;
        top: 8px;
        left: 1px;
      }
      
      .close::after {
        transform: rotate(-45deg);
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
      ${this.facetLabel}: ${this.valueLabel}
      ${this.value ? html`<button @click="${this._handleClick}" @pointerdown=${(event) => event.preventDefault()} ?disabled="${this.disabled}"><div class="${this.disabled ? 'lock' : 'close'}"></div></button>` : ''}
    `;
  }
}

customElements.define('search-facet', SearchFacet);
