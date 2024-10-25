import {LitElement, html, css} from 'lit';

class Facet {
  constructor(value, label, inputType) {
      this.value = value;
      this.label = label;
      this.inputType = inputType;
  }

  static fromObject(data, obj) {
    if (data) {
      obj = obj || new Facet();

      if (Object.hasOwn(data, 'value')) obj.value = data.value;
      if (Object.hasOwn(data, 'label')) obj.label = data.label;
      if (Object.hasOwn(data, 'inputType')) obj.inputType = data.inputType;
    }

    return obj;
  }

  static validate(facet) {
    return typeof facet.value === 'string' && typeof facet.label === 'string';
  }
}

class Value {
  constructor(value, label) {
    this.value = value;
    this.label = label;
  }

  static fromObject(data, obj) {
    if (data) {
      obj = obj || new Value();

      if (Object.hasOwn(data, 'value')) obj.value = data.value;
      if (Object.hasOwn(data, 'label')) obj.label = data.label;
    }

    return obj;
  }

  static validate(value) {
    return typeof value.value === 'string' && typeof value.label === 'string';
  }
}

export class VisualSearch extends LitElement {
  static get properties() {
    return {
      facets: {type: Array},
      values: {type: Array},

      selectedFacets: {type: Array},

      autocomplete: {type: Array, state: true},

      showDebugLog: {type: Boolean, attribute: 'debug'},
      nestedFacets: {type: Boolean, attribute: 'nested-facets'},

      search: {type: String, attribute: true},
      query: {type: Object, attribute: true},
      sorting: {type: Object, attribute: true},

      facetsAction: {type: String, attribute: 'facets-action'}, // autocomplete facet
      valueAction: {type: String, attribute: 'value-action'}, // autocomplete facet value
      queryAction: {type: String, attribute: 'query-action'}, // store query
    }
  };

  constructor() {
    super();

    this.facets = [];
    this.values = [];

    this.selectedFacets = [];

    this.autocomplete = [];

    this.showDebugLog = false;
    this.nestedFacets = false;

    this.query = null;
    this.sorting = null;

    // console.log(this);
    // console.log(this.search);

    // this.facetsAction = null;
    // this.facetsAction = document.getElementById('facets-action').innerText;

    // this.loadState(); // TODO legacy switch
  }

  connectedCallback() {
    super.connectedCallback()

    console.log(this.query)
    this.loadStateFromQuery(); // TODO load via html template instead of json object
  }

  static styles = css`
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--visual-search-color, black);
        background-color: var(--visual-search-background-color, white);
      }

      .vs-search__wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
        padding: 4px;
        border: 1px solid var(--visual-search-color, black);
      }

      .vs-search__facets {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .vs-search__input {
        box-sizing: border-box;
        flex-grow: 1;
        color: var(--visual-search-color, black);
        background-color: transparent;
        border: none;
      }

      .vs-search__dropdown {
        position: absolute;
        top: calc(100% - 1px);
        left: 0;
        z-index: 100; /* TODO add property */
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0;
        margin: 0;
        list-style: none;
        visibility: hidden;
        background-color: var(--visual-search-background-color, white);
        border: 1px solid var(--visual-search-color, black);
      }

      .vs-search__dropdown-item {
        width: 100%;
        padding: 4px;
        color: var(--visual-search-color, black);
        text-align: left;
        cursor: pointer;
        background: none;
        border: none;
      }

      .vs-search__dropdown-item:hover {
        color: var(--visual-search-color-focus, black);
        background-color: var(--visual-search-background-color-focus, lightgray);
      }

      .vs-search__dropdown-item:focus {
        color: var(--visual-search-color-focus, black);
        background-color: var(--visual-search-background-color-focus, lightgray);
      }

      .vs-search__dropdown li + li {
         border-top: 1px solid var(--visual-search-color, black);
      }

      .vs-search__input:focus + .vs-search__dropdown {
        visibility: visible;
      }

      .vs-search__dropdown:hover {
        visibility: visible;
      }

      .vs-search__dropdown:focus-within {
        visibility: visible;
      }

      .vs-search__debug {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 4px;
      }
    
      .vs-search__controls {
        display: flex;
        flex-wrap: nowrap;
        gap: 4px;
        padding: 0;
        margin: 0;
      }

      .select-button-wrapper {
        position: relative;
        display: inline-flex;
      }
      
      .select-native {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
      }
    
      .vs-search__controls button {
        padding: 4px;
        color: var(--visual-search-color, black);
        cursor: pointer;
        background-color: var(--visual-search-background-color, white);
        border: 1px solid var(--visual-search-color, black);
        border-radius: 4px;
      }

      .vs-search__controls button:hover, .select-button-wrapper:hover > button {
        color: var(--visual-search-color-focus, black);
        background-color: var(--visual-search-background-color-focus, lightgray);
      }
    `;

  render() {
    return html`
        ${this.showDebugLog ? html`<debug-log></debug-log>` : ''}
        <div class="vs-search__wrapper">
          ${this.selectedFacets.length > 0 ? html`
            <ul class="vs-search__facets">
              ${Array.from(this.selectedFacets).map((item, index) => html`
                <li>
                  <search-facet
                      facet-label="${item.facet.label}"
                      facet="${item.facet.value}"
                      value-label="${item.value ? item.value.label : ''}"
                      value="${item.value ? item.value.value : ''}"
                      ?disabled="${this.nestedFacets && (index < this.selectedFacets.length - 1)}"
                      @facet-delete="${() => this.deleteFacet(index)}">
                  </search-facet>
                </li>`)}
            </ul>
          ` : ''}
            <input class="vs-search__input"
                type="text"
                @focus='${this.handleFocus}'
                @blur='${this.handleBlur}'
                @keydown='${this.handleKeyDown}'
                @keyup='${this.handleKeyUp}'
                @input='${this.handleInput}'>
            <ul class="vs-search__dropdown">
              ${this.autocomplete.map((item, index) => html`
                <li>
                  <button
                      class="vs-search__dropdown-item"
                      tabindex="0"
                      @click='${() => this.complete(item)}'
                      @pointerdown=${(event) => event.preventDefault()}
                      @keydown="${index === this.autocomplete.length - 1 ? this.handleTab : null}">
                    ${item.label}
                  </button>
                </li>`)}
            </ul>
          <div class="vs-search__controls">
            <button @click="${this.submit}"><slot name="search-label">Search</slot></button>
            ${this.sorting ? html`
            <div class="select-button-wrapper">
              <button><slot name="sort-label">Sort</slot></button>
              <select id="sorting" class="select-native">
                <option value="" disabled ?selected="${!(this.query.sorting in this.sorting)}"></option>
                ${Object.keys(this.sorting).map((key) => html`
                  <option value="${key}" ?selected="${key === this.query.sorting}" >${this.sorting[key].label}</option>
                `)}
              </select>
            </div>
          `: ''}
            <button @click="${this.clear}"><slot name="clear-label">Clear</slot></button>
          </div>
        </div>
      `;
  }

  // TODO PUT storeQueryAction

  _mode() {
    return this.selectedFacets.length > 0 && this.selectedFacets.at(-1).value == null;
  }

  _input() {
    const input =  this.renderRoot ? this.renderRoot.querySelector('input') : null; // return dummy input?

    if (input === null) {
      this._log('input not found');
    }

    return input;
  }

  _sort() {
    return this.renderRoot.querySelector('#sorting');
  }

  _log(message) {
    const event = new CustomEvent('debug', {
      detail: {
        message: message,
      },
    });

    this.renderRoot.dispatchEvent(event);
  };

  complete(item) {
    this._log("complete: " + item.label)

    if (!this._mode()) {
      this.pushFacet(item.obj);
    } else {
      this.pushValue(item.obj);
    }

    // TODO handle value selection -> update input or push directly?
  }

  handleFocus(event) {
    if (event.target.value !== '') {
      return;
    }

    this.completeTerm('');
  }

  handleBlur() {
    // unused
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (this._mode()) {
        if (event.target.value === '') {
          return;
        }

        this.pushValue(new Value(event.target.value, event.target.value));
      } else {
        this.storeQuery(this.collectQuery()).then(() => {
          window.location.reload();
        });
      }
    }

    if (event.key === 'Backspace') {
      // TODO also deletes with 1 char left -> fix
      // after backspace target is empty? need value BEFORE backspace
      if (event.target.value === '') {
        /// this.selectedFacets.pop();
        /// this.requestUpdate();
        this.popFacet();
        // TODO reset autocomplete
      }
    }
  }

  handleKeyUp(event) {
    // unused
  }

  handleTab(event) {
    if (event.key !== 'Tab' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    this._input().focus();
  }

  handleInput(event) {
    this.completeTerm(event.target.value);

    // TODO remove

    // const data = this.collectData();

    // const query = data;
    // const encoded = this.encodeData(query);
    // console.log(data, query, encoded);

    // this.storeQuery(data.query);
  }

  focusInput() {
    this._input() ? this._input().focus() : null;
  }

  clearInput() {
    this._input() ? this._input().value = '' : null;
  }

  completeTerm(term) {
    const handle = (f, ...args) => {
      f(...args).then(() => {
        this.updateAutocomplete();
      }).catch(e => {
        this._log(e)
      });
    };

    this.storeQuery(this.collectQuery()).then(() => {
      if (!this._mode()) {
        handle(this.fetchFacets.bind(this), "", term);
      } else {
        handle(this.fetchValues.bind(this), this.selectedFacets.at(-1).facet.value, "", term);
      }
    });
  }

  loadStateFromQuery() {
    for (let facet of this.query.facets) {
      this.selectedFacets.push({
        facet: new Facet(facet.facet, facet.facetLabel),
        value: new Value(facet.value, facet.valueLabel),
      });
    }
  }

  updateAutocomplete() {
    if (!this._mode()) {
      this.autocomplete = this.facets.map(facet => {
        return {value: facet.value, label: facet.label, obj: facet}
      });
    } else {
      this.autocomplete = this.values.map(value => {
        return {value: value.value, label: value.label, obj: value}
      });
    }
  }

  pushFacet(facet) {
    this.selectedFacets.push({
        facet: facet,
        value: null
    });

    this.requestUpdate();

    if (facet.inputType) {
      this._input().type = facet.inputType;
    }

    this.clearInput();
    this.autocomplete = [];

    if (this.renderRoot.activeElement !== this._input()) {
        this.focusInput();
    } else {
        this.completeTerm('');
    }
  }

  pushValue(value) {
    this.selectedFacets.at(-1).value = value;

    this.requestUpdate();

    this._input().type = 'text';

    this.clearInput();
    this.autocomplete = [];

    if (this.renderRoot.activeElement !== this._input()) {
      this.focusInput();
    } else {
      this.completeTerm('');
    }
  }

  popFacet() {
    const facet = this.selectedFacets.pop();

    this.requestUpdate();

    this._input().type = 'text';

    this.completeTerm('')

    return facet;
  }

  popValue() {
    if (this.selectedFacets.length === 0) {
      return undefined;
    }

    const value = this.selectedFacets.at(-1).value;
    this.selectedFacets.at(-1).value = null;

    this.requestUpdate();

    this._input().type = 'text';

    this.completeTerm('')

    return value;
  }

  submit() {
    if (this._mode()) {
      this.popFacet();
    }

    this.storeQuery(this.collectQuery()).then(() => {
      window.location.reload();
    });
  }

  clear() {
    this._input().value = '';

    this._sort() ? this._sort().value = '' : null;

    this.selectedFacets = [];
    this.autocomplete = [];
  }

  deleteFacet(index) {
    this.selectedFacets.splice(index, 1);

    this.requestUpdate();

    this.completeTerm(this._input().value)
  }

  async fetchFacets(query, term) {
    let action = new URL(this.facetsAction, window.location.origin);

    action.searchParams.set('search', this.search);

    if (query === undefined) {
      query = '';
    }

    if (term === undefined) {
      term = '';
    }

    action.searchParams.set('query', query);
    action.searchParams.set('term', term);

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }

    return fetch(action, options).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }).then(data => {
      let facets = data.map(facet => Facet.fromObject(facet));

      if (!facets.every(Facet.validate)) {
        this._log('invalid facets');
      }

      this.facets = facets;
    });
  }

  async fetchValues(facet, query, term) {
    let action = new URL(this.valueAction, window.location.origin);

    action.searchParams.set('search', this.search);

    if (facet === undefined) {
      facet = '';
    }

    if (query === undefined) {
      query = '';
    }

    if (term === undefined) {
      term = '';
    }

    action.searchParams.set('facet', facet);
    action.searchParams.set('query', query);
    action.searchParams.set('term', term);

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }

    return fetch(action, options).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }).then(data => {
        let values = data.map(value => Value.fromObject(value));

        if (!values.every(Value.validate)) {
          this._log('invalid values');
        }

        this.values = values;
    });
  }

  async storeQuery(query) {
    let action = new URL(this.queryAction, window.location.origin);

    if (query === undefined) {
      query = {};
    }

    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    };

    return fetch(action, options).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    });
  }

  collectQuery() {
    let facets = this.selectedFacets.reduce((acc, item) => {
      if (item.value == null) {
        return acc;
      }

      acc.push({
        facetLabel: item.facet.label,
        facet: item.facet.value,
        valueLabel: item.value.label,
        value: item.value.value
      });

      return acc;
    }, []);

    return {
      identifier: this.search,
      sorting: this._sort() ? this._sort().value : '',
      facets: facets,
    };
  }

  encodeQuery(query) {
    return btoa(encodeURIComponent(JSON.stringify(this.collectQuery().facets)));
  }
}

customElements.define('visual-search', VisualSearch);
