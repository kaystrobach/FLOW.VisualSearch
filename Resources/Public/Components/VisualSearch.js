// import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {css, html, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class VisualSearch extends LitElement {
  static get properties() {
    return {
      _focus: {state: true},
      _mode: {state: true}, // mode: false -> facet, true -> value

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

    this._focus = false;
    this._mode = false;

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
        display: none;
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
        display: inline-flex;
      }

      .vs-search__dropdown:hover {
        display: inline-flex;
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
            ${Array.from(this.selectedFacets).map(facet => html`
              <li>
                <search-facet key="${facet.key}" value="${facet.value}" label="${facet.label}"></search-facet>
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

    if (!this._mode) {
      this.pushFacet({
        key: item.key,
        label: item.label,
      });

      this.updateAutocomplete();
    } else {
      this.pushValue(item.label); // TODO fix value data model
      this.updateAutocomplete();
    }

    // TODO handle value selection -> update input or push directly?
  }

  handleFocus() {
    this._focus = true;

    this._log('focus == true');

    // this.updateAutocomplete(); // TODO only if necessary
    this.completeTerm('');
  }

  handleBlur() {
    this._focus = false;

    this._log('focus == false');
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
        /// this._mode = false;
        this.popFacet();
        this.updateAutocomplete();
        // TODO reset autocomplete
      }
    }
  }

  handleKeyUp(event) {
    if (event.key === 'Enter') {
      if (this._mode) {
        // this.selectedFacets.at(-1).value = event.target.value;
        // this._mode = false;
        // this.clearInput();
        // this.focusInput();

        this.pushValue(event.target.value);
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
    if (this.renderRoot) {
      let input = this.renderRoot.querySelector('input');

      if (input) {
        input.focus();
      }

      // this.renderRoot.querySelector('input').focus(); // TODO update selector
    }
  }

  clearInput() {
    if (this.renderRoot) {
      let input = this.renderRoot.querySelector('input');

      if (input) {
        input.value = '';
      }

      // this.renderRoot.querySelector('input').value = ''; // TODO update selector
    }
  }

  completeTerm(term) {
    if (!this._mode) {
      this.fetchFacets("", term);
    } else {
      // this.fetchValue("height", "", term)
      // console.log(this.selectedFacets);

      // TODO remodel selected facets -> match api format for facets

      this.fetchValue(this.selectedFacets.at(-1).label, "", term);
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

      this.pushFacet({
        key: facet.facet,
        label: facet.facetLabel,
        value: facet.value,
      });
    }

    this._mode = false; // TODO not necessary
  }

  persistState() {
    // TODO persist query object vs selected facets + input text

    // TODO how t handle ul encoded data -> decode into data object?

    // const data = this.collectData()
  }

  updateAutocomplete() {
    // TODO via event

    this._log("updating auto complete (mode: " + this._mode + ")");
    // this._log("mode: " +  this._mode)

    // this.clearAutocomplete()

    if (!this._mode) {
      // for (let facet of this.facets) {
      //   // this.debug(facet.key + ' ' + facet.value)
      //
      //   this.autocomplete.push({
      //     key: facet.key,
      //     label: facet.value,
      //   });
      // }

      this.autocomplete = this.facets.map(facet => {
        return {key: facet.key, label: facet.value}
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
        return {key: value.key, label: value.value} // TODO track facet label
      });
    }

    if (this.autocomplete.length === 0) {
      this._log('no autocomplete results')
      // this.autocomplete.push({ key: 'no-results', label: 'no results' }); // TODO remove
    }

    // this.requestUpdate(); // TODO not triggering
  }

  pushFacet(facet) {
    this.selectedFacets.push(facet);

    this._mode = true;

    this.clearInput();
    this.focusInput(); // TODO probably not necessary

    // note that focus input triggers autocomplete which relies on mode
    // thus mode must be updated before refocusing
    // TODO use helper to determine mode based on selected facets

    this.requestUpdate();
  }

  pushValue(value) {
    this.selectedFacets.at(-1).value = value;

    this._mode = false;

    this.clearInput();
    this.focusInput(); // TODO probably not necessary

    this.requestUpdate();
  }

  popFacet() {
    const facet = this.selectedFacets.pop();

    this._mode = false;
    this.requestUpdate();

    this.updateAutocomplete();

    return facet;
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
      this.facets = data;
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
    let facets = this.selectedFacets.map(facet => {
      return {
        facetLabel: facet.label,
        facet: facet.label,
        valueLabel: facet.value,
        value: facet.value,
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
