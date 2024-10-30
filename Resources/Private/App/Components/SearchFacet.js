import {LitElement, html, css} from 'lit';

export class SearchFacet extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      gap: 4px;
      align-items: center;
      height: 18px;
      padding: 0 4px;
      color: var(--visual-search-facet-color, black);
      white-space: nowrap;
      user-select: none;
      background-color: var(--visual-search-facet-background-color, lightgray);
      border-radius: 4px;
    }

    button {
      display: inline-flex;
      place-content: center center;
      place-items: center center;
      width: 16px;
      height: 16px;
      padding: 0;
      margin: 0;
      color: black;
      cursor: pointer;
      background-color: white;
      border: none;
      border-radius: 8px;
    }

    button:disabled {
      color: graytext;
    }

    .lock {
      position: relative;
      box-sizing: border-box;
      display: block;
      width: 12px;
      min-width: 12px;
      height: 11px;
      min-height: 11px;
      margin-top: calc(-8px * 0.6); /* -12px; */
      background: transparent;
      border: 2px solid;
      border-bottom: transparent;
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
      transform: scale(0.4);
    }

    .lock::after {
      position: absolute;
      top: 9px;
      left: -4px;
      box-sizing: border-box;
      display: block;
      width: 16px;
      height: 10px;
      content: "";
      border: 2px solid transparent;
      border-radius: 2px;
      box-shadow: 0 0 0 2px;
    }

    .close {
      position: relative;
      box-sizing: border-box;
      display: block;
      width: 22px;
      min-width: 22px;
      height: 22px;
      min-height: 22px;
      background: transparent;
      border: 2px solid transparent;
      border-radius: 40px;
      transform: scale(0.6);
    }

    .close::after,
    .close::before {
      position: absolute;
      top: 8px;
      left: 1px;
      box-sizing: border-box;
      display: block;
      width: 16px;
      height: 2px;
      content: "";
      background: currentcolor;
      border-radius: 5px;
      transform: rotate(45deg);
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
    this.dispatchEvent(new CustomEvent('facet-delete', {bubbles: true, composed: true}));
  }

  render() {
    return html`
      ${this.facetLabel}: ${this.valueLabel}
      ${this.value ? html`
        <button @click="${this._handleClick}" @pointerdown=${(event) => event.preventDefault()} ?disabled="${this.disabled}">
          <div class="${this.disabled ? 'lock' : 'close'}"></div>
        </button>
      ` : ''}
    `;
  }
}

customElements.define('search-facet', SearchFacet);
