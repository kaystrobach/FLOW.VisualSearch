// import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {css, html, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

// [{"value":"expirationDateFrom","label":"Ablaufdatum ab einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"expirationDateUntil","label":"Ablaufdatum bis einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"creationDateFrom","label":"Anlegedatum ab einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"creationDateUntil","label":"Anlegendatum bis einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"account","label":"Anmeldename","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"role","label":"Benutzerrolle","configuration":{"conditions":{"once":true},"values":{"SBS.SingleSignOn:Student":"Student","SBS.SingleSignOn:Staff":"Staff","SBS.SingleSignOn:Teacher":"Teacher","SBS.SingleSignOn:Administrator":"Administrator","SBS.SingleSignOn:Secretary":"Secretary","SBS.SingleSignOn:SystemAdministrator":"SystemAdministrator","SBS.SingleSignOn:Rest":"Rest","SBS.SingleSignOn:FirstLogin":"FirstLogin","SBS.SingleSignOn:BetaTester":"BetaTester","SBS.SingleSignOn:TraineeTeacher":"TraineeTeacher"}}},{"value":"einrichtung","label":"Einrichtung","configuration":{"conditions":{"once":true},"labelProperty":"searchLabel","labelMatcher":"contains","orderBy":"searchLabel","limit":15,"repository":"SBS\\SingleSignOn\\Domain\\Repository\\Person\\EinrichtungRepository"}},{"value":"internalNotes","label":"Interne Notizen","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"legalStatus","label":"Juristischer Status der Einrichtung","configuration":{"conditions":{"once":true},"values":{"01":"\u00d6ffentliche Einrichtung","02":"Einrichtung in freier Tr\u00e4gerschaft","09":"Weitere Bildungseinrichtungen"}}},{"value":"lastLoginDateFrom","label":"Letztes Login ab einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"lastLoginDateUntil","label":"Letztes Login bis einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"nachname","label":"Nachname","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"fullname","label":"Name (komplett)","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"stammeinrichtung","label":"Stammeinrichtung","configuration":{"conditions":{"once":true},"labelProperty":"searchLabel","labelMatcher":"contains","orderBy":"searchLabel","limit":15,"repository":"SBS\\SingleSignOn\\Domain\\Repository\\Person\\EinrichtungRepository"}},{"value":"stammKlasse","label":"Stammklasse","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"stammKlassenstufe","label":"Stammklassenstufe","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"searchtext","label":"Suchtext","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"syncKey","label":"SyncKey","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"owner","label":"Tr\u00e4ger","configuration":{"conditions":{"once":true},"labelProperty":"name","labelMatcher":"contains","orderBy":"name","limit":15,"repository":"SBS\\SingleSignOn\\Domain\\Repository\\OwnerRepository"}},{"value":"firstname","label":"Vorname","configuration":{"conditions":{"once":true},"freeInput":true}}]
// [{"label":"Student","value":"SBS.SingleSignOn:Student"},{"label":"Staff","value":"SBS.SingleSignOn:Staff"},{"label":"Teacher","value":"SBS.SingleSignOn:Teacher"},{"label":"Administrator","value":"SBS.SingleSignOn:Administrator"},{"label":"Secretary","value":"SBS.SingleSignOn:Secretary"},{"label":"SystemAdministrator","value":"SBS.SingleSignOn:SystemAdministrator"},{"label":"Rest","value":"SBS.SingleSignOn:Rest"},{"label":"FirstLogin","value":"SBS.SingleSignOn:FirstLogin"},{"label":"BetaTester","value":"SBS.SingleSignOn:BetaTester"},{"label":"TraineeTeacher","value":"SBS.SingleSignOn:TraineeTeacher"}]

class Facet {
    constructor(value, label, inputType, onfiguration, values) {
        this.value = value; // this is actually the facet key
        this.label = label; // display label for facet
        this.inputType = inputType;
        // TODO track valueValue and valueLabel somewhere else
        // TODO update autocomplete function ??
        // this.configuration = configuration;
        // this.values = values.map(value => Value.fromObject(value)); // TODO different structure FacetValues
    }

  static fromObject(data, obj) {
    if (data) {
      obj = obj || new Facet();

      if (data.hasOwnProperty('value')) obj.value = data.value;
      if (data.hasOwnProperty('label')) obj.label = data.label;
      if (data.hasOwnProperty('inputType')) obj.inputType = data.inputType;
      // if (data.hasOwnProperty('configuration')) obj.configuration = data.configuration;
      // if (data.hasOwnProperty('values')) obj.values = data.values.map(value => Value.fromObject(value));
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

      if (data.hasOwnProperty('value')) obj.value = data.value;
      if (data.hasOwnProperty('label')) obj.label = data.label;
    }

    return obj;
  }

  static validate(value) {
    return typeof value.value === 'string' && typeof value.label === 'string';
  }
}

// TODO this might make sense
// TODO how to handle free text -> probably just another property?!
// class SelectedFacet {
//   constructor(facet, value) {
//     this.facet = facet;
//     this.value = value;
//   }
// }

// class Configuration {
//   constructor(conditions, freeInput, dateFormat, labelProperty, labelMatcher, orderBy, limit, repository) {
//     this.conditions = conditions;
//     this.freeInput = freeInput;
//     this.dateFormat = dateFormat;
//     this.labelProperty = labelProperty;
//     this.labelMatcher = labelMatcher;
//     this.orderBy = orderBy;
//     this.limit = limit;
//     this.repository = repository;
//   }
//
//   // TODO verify data model
//   // TODO implement
// }


export class VisualSearch extends LitElement {
  static get properties() {
    return {
      facets: {type: Array},
      values: {type: Array},

      selectedFacets: {type: Array},

      autocomplete: {type: Array, state: true},

      showDebugLog: {type: Boolean, attribute: 'debug'},

      search: {type: String, attribute: true},
      query: {type: Object, attribute: true},

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

    this.query = null;

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
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .vs-search__wrapper {
        display: flex;
        padding: 4px;
        border: 1px solid white;
        align-items: center;
      }

      .vs-search__facets {
        display: flex;
        flex-wrap: nowrap;
        list-style: none;
        padding: 0;
        margin: 0;
        // gap: 2px;
      }

      .vs-search__facets li {
        margin-right: 4px;
      }

      .vs-search {
        position: relative;
        width: 100%;
      }

      .vs-search__input {
        width: 100%;
        box-sizing: border-box;
        color: white;
        background-color: transparent;
        border: none;
      }

      .vs-search__dropdown {
        z-index: 100; // TODO add property
        display: inline-flex;
        visibility: hidden;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
        position: absolute;
        top: calc(100% + 4px);
        left: -5px;
        background-color: black;
        width: calc(100% + 8px);
        border: 1px solid white;
      }

      .vs-search__dropdown-item {
        padding: 4px;
        cursor: pointer;
      }

      .vs-search__dropdown-item:hover {
        background-color: #333;
      }

      .vs-search__dropdown-item + .vs-search__dropdown-item {
        border-top: 1px solid white;
      }

      .vs-search__input:focus + .vs-search__dropdown {
        visibility: visible;
      }

      .vs-search__dropdown:hover {
        visibility: visible;
      }

      .vs-search__debug {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 4px;
      }
    `;

  render() {
    return html`
        ${this.showDebugLog ? html`<debug-log></debug-log>` : ''}
        <div class="vs-search__wrapper">
          <ul class="vs-search__facets">
            ${Array.from(this.selectedFacets).map((item) => html`
              <li>
                <search-facet
                    facet-label="${item.facet.label}"
                    facet="${item.facet.value}"
                    value-label="${item.value ? item.value.label : ''}"
                    value="${item.value ? item.value.value : ''}">
                </search-facet>
              </li>`)}
          </ul>
          <div class="vs-search">
            <input class="vs-search__input"
                type="text"
                @focus='${this.handleFocus}'
                @blur='${this.handleBlur}'
                @keydown='${this.handleKeyDown}'
                @keyup='${this.handleKeyUp}'
                @input='${this.handleInput}'>
            <ul class="vs-search__dropdown">
            ${this.autocomplete.map(item => html`<li class="vs-search__dropdown-item" @click='${() => this.complete(item)}'>${item.label}</li>`)}
            </ul>
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
    // this.debug(event.key + ' pressed');
    // console.log(event.key, event.target.value);

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
    if (event.key === 'Enter') {
      if (this._mode()) {
        this.pushValue(new Value(event.target.value, event.target.value));
      } else {
        this.storeQuery(this.collectQuery()).then(() => {
          window.location.reload();
        });
      }
    }
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

    const query = btoa(encodeURIComponent(JSON.stringify(this.collectQuery())));

    if (!this._mode()) {
      handle(this.fetchFacets.bind(this), query, term);
    } else {
      handle(this.fetchValues.bind(this), this.selectedFacets.at(-1).facet.value, query, term);
    }
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

    if (facet.inputType) {
      this._input().type = facet.inputType;
    }

    this.clearInput();
    this.focusInput();

    this.completeTerm('');
  }

  pushValue(value) {
    this.selectedFacets.at(-1).value = value;

    this._input().type = 'text';

    this.clearInput();
    this.focusInput();

    this.completeTerm('');
  }

  popFacet() {
    const facet = this.selectedFacets.pop();

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

    this._input().type = 'text';

    this.completeTerm('')

    return value;
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
      sorting: 'identifier', // TODO add to state
      facets: facets,
    };
  }
}

customElements.define('visual-search', VisualSearch);
