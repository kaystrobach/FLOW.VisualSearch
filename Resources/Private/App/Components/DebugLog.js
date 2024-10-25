import {LitElement, html, css} from 'lit';

// TODO rename to debug log
export class DebugLog extends LitElement {
  static get properties() {
    return {
      _log: {type: Array}
    };
  }

  constructor() {
    super();

    this._log = [];
  }

  connectedCallback() {
    super.connectedCallback();

    this.parentNode.addEventListener('debug', (event) => this._debug(event.detail));
  }

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
      height: min-content;
    }

    ul {
      display: flex;
      flex-direction: column-reverse;
      height: 80px;
      padding: 8px;
      margin: 0;
      overflow-y: scroll;
      border: 1px solid white;
    }

    li {
      list-style: none;
    }
  `;

  render() {
    return html`
      <ul>
        ${this._log.reverse().map((item) => html`<li>${item.time} ${item.message}</li>`)}
      </ul>
    `;
  }

  _debug(detail) {
    this._log.push({
      time: new Date().toLocaleTimeString(undefined, {
        hour12: false
      }),
      message: detail.message,
    });

    this.requestUpdate(); // TODO verify this is working
  }
}

customElements.define('debug-log', DebugLog);
