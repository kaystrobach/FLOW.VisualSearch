import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class SearchFacet extends LitElement {
  static styles = css`
      span {
        // border: 1px solid white;
        // border-radius: 4px;
        // padding: 4px;
        // margin: 0;
        display: inline-block;
        white-space: nowrap;
        background-color: #333;
        border-radius: 4px;
        padding: 0 4px;
      }
    `;

  static get properties() {
    return {
      facetLabel: {type: String, attribute: 'facet-label'},
      facet: {type: String, attribute: true},
      valueLabel: {type: String, attribute: 'value-label'},
      value: {type: String, attribute: true},
    }
  }

  constructor() {
    super();
  }

  handleClick() {
    console.log('click');

    // TODO fire removal event
  }

  render() {
    return html`
        <span @click="${this.handleClick()}">${this.facetLabel}: ${this.valueLabel}</span>
      `;
  }
}

customElements.define('search-facet', SearchFacet);
