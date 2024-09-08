// import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {css, html, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

// [{"value":"expirationDateFrom","label":"Ablaufdatum ab einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"expirationDateUntil","label":"Ablaufdatum bis einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"creationDateFrom","label":"Anlegedatum ab einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"creationDateUntil","label":"Anlegendatum bis einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"account","label":"Anmeldename","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"role","label":"Benutzerrolle","configuration":{"conditions":{"once":true},"values":{"SBS.SingleSignOn:Student":"Student","SBS.SingleSignOn:Staff":"Staff","SBS.SingleSignOn:Teacher":"Teacher","SBS.SingleSignOn:Administrator":"Administrator","SBS.SingleSignOn:Secretary":"Secretary","SBS.SingleSignOn:SystemAdministrator":"SystemAdministrator","SBS.SingleSignOn:Rest":"Rest","SBS.SingleSignOn:FirstLogin":"FirstLogin","SBS.SingleSignOn:BetaTester":"BetaTester","SBS.SingleSignOn:TraineeTeacher":"TraineeTeacher"}}},{"value":"einrichtung","label":"Einrichtung","configuration":{"conditions":{"once":true},"labelProperty":"searchLabel","labelMatcher":"contains","orderBy":"searchLabel","limit":15,"repository":"SBS\\SingleSignOn\\Domain\\Repository\\Person\\EinrichtungRepository"}},{"value":"internalNotes","label":"Interne Notizen","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"legalStatus","label":"Juristischer Status der Einrichtung","configuration":{"conditions":{"once":true},"values":{"01":"\u00d6ffentliche Einrichtung","02":"Einrichtung in freier Tr\u00e4gerschaft","09":"Weitere Bildungseinrichtungen"}}},{"value":"lastLoginDateFrom","label":"Letztes Login ab einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"lastLoginDateUntil","label":"Letztes Login bis einschlie\u00dflich (dd.mm.yyyy)","configuration":{"conditions":{"once":true},"freeInput":true,"dateFormat":"d.m.Y"}},{"value":"nachname","label":"Nachname","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"fullname","label":"Name (komplett)","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"stammeinrichtung","label":"Stammeinrichtung","configuration":{"conditions":{"once":true},"labelProperty":"searchLabel","labelMatcher":"contains","orderBy":"searchLabel","limit":15,"repository":"SBS\\SingleSignOn\\Domain\\Repository\\Person\\EinrichtungRepository"}},{"value":"stammKlasse","label":"Stammklasse","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"stammKlassenstufe","label":"Stammklassenstufe","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"searchtext","label":"Suchtext","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"syncKey","label":"SyncKey","configuration":{"conditions":{"once":true},"freeInput":true}},{"value":"owner","label":"Tr\u00e4ger","configuration":{"conditions":{"once":true},"labelProperty":"name","labelMatcher":"contains","orderBy":"name","limit":15,"repository":"SBS\\SingleSignOn\\Domain\\Repository\\OwnerRepository"}},{"value":"firstname","label":"Vorname","configuration":{"conditions":{"once":true},"freeInput":true}}]
// [{"label":"Student","value":"SBS.SingleSignOn:Student"},{"label":"Staff","value":"SBS.SingleSignOn:Staff"},{"label":"Teacher","value":"SBS.SingleSignOn:Teacher"},{"label":"Administrator","value":"SBS.SingleSignOn:Administrator"},{"label":"Secretary","value":"SBS.SingleSignOn:Secretary"},{"label":"SystemAdministrator","value":"SBS.SingleSignOn:SystemAdministrator"},{"label":"Rest","value":"SBS.SingleSignOn:Rest"},{"label":"FirstLogin","value":"SBS.SingleSignOn:FirstLogin"},{"label":"BetaTester","value":"SBS.SingleSignOn:BetaTester"},{"label":"TraineeTeacher","value":"SBS.SingleSignOn:TraineeTeacher"}]

class Facet {
    constructor(value, label, configuration, values) {
        this.value = value; // this is actually the facet key
        this.label = label; // display label for facet
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
      // if (data.hasOwnProperty('configuration')) obj.configuration = data.configuration;
      // if (data.hasOwnProperty('values')) obj.values = data.values.map(value => Value.fromObject(value));
    }

    return obj;
  }

  static validate(facet) {
    return typeof facet.value === 'number' && typeof facet.label === 'string'; // facets.every(Facet.validate);
    // TODO validate configuration and values -> just call their validators
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
                <search-facet key="${item.facet.value}" value="${item.value ? item.value.value : ''}" label="${item.facet.label}"></search-facet>
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
      this.updateAutocomplete();
    } else {
      this.pushValue(item.obj); // TODO fix value data model
      this.updateAutocomplete();
    }

    // TODO handle value selection -> update input or push directly?
  }

  handleFocus(event) {
    if (this.selectedFacets.length !== 0 || event.target.value !== '') {
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
        this.updateAutocomplete();
        // TODO reset autocomplete
      }
    }
  }

  handleKeyUp(event) {
    if (event.key === 'Enter') {
      if (this._mode()) {
        // this.selectedFacets.at(-1).value = event.target.value;
        // this.clearInput();
        // this.focusInput();

        this.pushValue(new Value(event.target.value, event.target.value));
        this.updateAutocomplete();
      } else {
        // TODO store state in local storage?
        // TODO submit query then refresh?

        this._log("searching")

        // TODO move into persist state -> base64 encode query

        let data = this.collectData()
        this.storeQuery(data.query, true); // TODO pass complete data object

        // let url = new URL(window.location.href);
        //
        // let foo = this.encodeData(this.collectData());
        //
        // console.log(foo);
        //
        // // url.searchParams.set('foo', 'bar');
        //
        // // delete all query params
        // for (let key of url.searchParams.keys()) {
        //   if (!key.startsWith('query')) {
        //     // continue; // TODO preserve non search related?
        //     // TODO reset pagination
        //   }
        //
        //   url.searchParams.delete(key);
        // }
        //
        // for (let [key, value] of Object.entries(foo)) {
        //   url.searchParams.set(key, value);
        // }

        // window.location.href = url.href;
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
    if (!this._mode()) {
      this.fetchFacets("", term);
    } else {
      // this.fetchValue("height", "", term)
      // console.log(this.selectedFacets);

      // TODO remodel selected facets -> match api format for facets

      this.fetchValue(this.selectedFacets.at(-1).facet.value, "", term);
    }

    this.updateAutocomplete()
    this.requestUpdate(); // necessary
  }

  // clearInput() {
  //   // this.shadowRoot.querySelector('input').value = '';
  // }

  // storeQuery() {
  //   const data = this.collectData();
  //
  //   // TODO implement
  //   // problem -> GET request with standard lib encoding not possible because nested too deep?!
  //
  //   const params = this.encodeData(data);
  //
  //   // send request like autocomplete
  // }

  loadState() {
    let url = new URL(window.location.href);

    let queryParams = [];

    url.searchParams.forEach((value, key) => {
      if (key.startsWith('query')) {
        queryParams.push({
          key: key,
          value: value,
        });
      }
    });

    if (queryParams.length === 0) {
      return;
    }

    function unflattenObject(queryParams) {
      const result = {};

      queryParams.forEach(param => {
        const { key, value } = param;
        if (key.startsWith('query')) {
          const keys = key.replace('query[', '').slice(0, -1).split('][');
          let currentLevel = result;

          for (let i = 0; i < keys.length; i++) {
            const nestedKey = keys[i];

            if (i === keys.length - 1) {
              currentLevel[nestedKey] = value;
            } else {
              if (!currentLevel[nestedKey]) {
                currentLevel[nestedKey] = isNaN(Number(keys[i + 1])) ? {} : [];
              }
              currentLevel = currentLevel[nestedKey];
            }
          }
        }
      });

      return result;
    }

    let state = unflattenObject(queryParams);

    console.log(state)


    for (let facet of state.facets) {
      this.pushFacet({
        key: facet.facet,
        label: facet.facetLabel,
        value: facet.value,
      });
    }
  }

  loadStateFromQuery() {
    for (let facet of this.query.facets) {
      // TODO dont try to clear input

      this.selectedFacets.push({
        facet: new Facet(facet.facet, facet.facetLabel),
        value: new Value(facet.value, facet.valueLabel),
      });
    }
  }

  persistState() {
    // TODO persist query object vs selected facets + input text

    // TODO how t handle ul encoded data -> decode into data object?

    // const data = this.collectData()
  }

  updateAutocomplete() {
    // TODO via event

    this._log("updating auto complete");

    // this.clearAutocomplete()

    if (!this._mode()) {
      // for (let facet of this.facets) {
      //   // this.debug(facet.key + ' ' + facet.value)
      //
      //   this.autocomplete.push({
      //     key: facet.key,
      //     label: facet.value,
      //   });
      // }

      this.autocomplete = this.facets.map(facet => {
        return {value: facet.value, label: facet.label, obj: facet}
      });

    } else {
      // for (let value of this.values) {
      //   // this.debug(value.key + ' ' + value.value)
      //
      //   this.autocomplete.push({
      //     key: value.key,
      //     label: value.value,
      //   });
      // }

      this.autocomplete = this.values.map(value => {
        return {value: value.value, label: value.label, obj: value} // TODO track facet label
      });
    }

    if (this.autocomplete.length === 0) {
      this._log('no autocomplete results')
      // this.autocomplete.push({ key: 'no-results', label: 'no results' }); // TODO remove
    }

    // this.requestUpdate(); // TODO not triggering
  }

  pushFacet(facet) {
    this.selectedFacets.push({
        facet: facet,
        value: null
    });

    this.clearInput();
    this.focusInput();

    this.completeTerm('');
  }

  pushValue(value) {
    this.selectedFacets.at(-1).value = value;

    this.clearInput();
    this.focusInput();

    this.completeTerm('');
  }

  popFacet() {
    const facet = this.selectedFacets.pop();

    this.completeTerm('')

    return facet;
  }

  popValue() {
    if (this.selectedFacets.length === 0) {
      return undefined;
    }

    const value = this.selectedFacets.at(-1).value;
    this.selectedFacets.at(-1).value = null;

    this.completeTerm('')

    return value;
  }

  fetchFacets(query, term) {
    this._log('fetching facets')

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

    fetch(action).then(response => {
      if (!response.ok) {
        throw new Error(''); // TODO implement
      }
      return response.json();
    }).then(data => {
      let facets = data.map(facet => Facet.fromObject(facet));
      facets.every(Facet.validate);
      this.facets = facets;
      this.updateAutocomplete();
      console.log(data);
    }).catch(error => {
      console.error('', error); // TODO implement
    });
  }

  fetchValue(facet, query, term) {
    let action = new URL(this.valueAction, window.location.origin);

    action.searchParams.set('search', this.search);

    if (facet === undefined) {
      // TODO handle
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

    fetch(action).then(response => {
      if (!response.ok) {
        throw new Error(''); // TODO implement
      }
      return response.json();
    }).then(data => {
      this.values = data;
      this.updateAutocomplete();
      console.log(data);
    }).catch(error => {
      console.error('', error); // TODO implement
    });
  }

  storeQuery(query, refresh = false) {
    this._log('storing query')

    let action = new URL(this.queryAction, window.location.origin);

    // if (query === undefined) {
    //   query = '';
    // }
    //
    // action.searchParams.set('query', query);

    // TODO use PUT method with json body
    // TODO session is fine but get rid of widget?
    // TODO get rid of pagination widget by using pagination http headers??

    // const formData = new FormData();
    //
    // Object.keys(this.encodeData(query)).forEach(key => {
    //   formData.append(key, query[key]);
    // });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    };

    fetch(action, options).then(response => {
      if (!response.ok) {
        throw new Error(''); // TODO implement
      }
      return response.json();
    }).then(data => {
      console.log(data);
      if (refresh) {
        // let url = new URL(window.location.href);
        // window.location.href = url.href;
        // window.location.reload();
        this._log('reloading page');
        // setTimeout(() => {
        //   window.location.reload();
        // }, 5000);

        window.location.reload();


        // TODO query does not seem to be persisted correctly -> only first facet is saved -> query is saved error during facet reload
      }
    }).catch(error => {
      console.error('', error); // TODO implement
    });
  }

  collectData() {
    let facets = this.selectedFacets.map(item => {
      return {
        facetLabel: item.facet.label,
        facet: item.facet.value,
        valueLabel: item.value.label,
        value: item.value.value,
      }
    });


    let data = {
      query: {
        identifier: this.search,
        sorting: 'identifier', // TODO add to state
        // facets: [
        //   {
        //     facetLabel: 'Height',
        //     facet: 'height',
        //     valueLabel: '50',
        //     value: '50',
        //   },
        //   {
        //     facetLabel: 'Identifier',
        //     facet: 'identifier',
        //     valueLabel: 'a',
        //     value: 'a',
        //   }
        // ], // TODO implement
        facets: facets,
      }
    }

    return data;
  }

  // TODO native JS helper for url encoding nested objects

  encodeData(data) {
    function flattenObject(obj, parentKey = '', result = {}) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = parentKey ? `${parentKey}[${key}]` : key;

          if (Array.isArray(obj[key])) {
            obj[key].forEach((item, index) => {
              if (typeof item === 'object') {
                flattenObject(item, `${newKey}[${index}]`, result);
              } else {
                result[`${newKey}[${index}]`] = item;
              }
            });
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            flattenObject(obj[key], newKey, result);
          } else {
            result[newKey] = obj[key];
          }
        }
      }
      return result;
    }

    return flattenObject(data);
  }
}

// data-search
// data-valueAction
// data-facetsAction
// data-storeQueryAction
// data-query

// query
// function getTerm(element) {
//   var query = {
//     identifier: $(settings['container']).attr('data-search'),
//     sorting: $(element.nextElementSibling).find('[name=sorting]:checked').val(),
//     facets: []
//   };
//   $.each($(element).find('.label'), function(key, value) {
//     query.facets.push(
//       {
//         facetLabel: $(value).children('.token-facet').text(),
//         facet: $(value).children('.token-facet').attr('data-facet'),
//         valueLabel: $(value).children('.token-value').text(),
//         value: $(value).children('.token-value').attr('data-value')
//       }
//     )
//   });
//   return query;
// }

// TODO create facet component to display inside input field??

customElements.define('visual-search', VisualSearch);

// animate border for search

// [{"value":"name","label":"Name","configuration":{"conditions":{"once":true},"freeInput":true,"labelProperty":"name"}}]
