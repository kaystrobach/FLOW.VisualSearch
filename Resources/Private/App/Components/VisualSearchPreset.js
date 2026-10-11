export class VisualSearchPreset extends HTMLElement {
  constructor() {
    super();
    this._search = null;
    this._clickHandler = this.handleClick.bind(this);
    this._updateHandler = this._scheduleUpdate.bind(this);
  }

  static get observedAttributes() {
    return ['query', 'selector', 'active-class', 'match'];
  }

  static get searchEvents() {
    return ['VisualSearchRequestUpdateSelectedFacets', 'VisualSearchRequestUpdateQuery', 'sorting'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) {
      return;
    }

    if (name === 'selector') {
      this._disconnectSearch();
      this._connectSearch();

      return;
    }

    if (name === 'active-class') {
      this._toggleChildClass(oldValue || 'active', false);
    }

    this._scheduleUpdate();
  }

  get query() {
    try {
      return JSON.parse(this.getAttribute('query') || '{}');
    } catch (e) {
      console.error('visual-search-preset: invalid query', e);

      return {};
    }
  }

  set query(value) {
    this.setAttribute('query', JSON.stringify(value));
  }

  get selector() {
    return this.getAttribute('selector') || 'visual-search';
  }

  set selector(value) {
    this.setAttribute('selector', value);
  }

  get activeClass() {
    return this.getAttribute('active-class') || 'active';
  }

  get match() {
    return this.getAttribute('match') === 'partial' ? 'partial' : 'exact';
  }

  set match(value) {
    this.setAttribute('match', value);
  }

  get active() {
    return this.hasAttribute('data-active');
  }

  connectedCallback() {
    this.addEventListener('click', this._clickHandler);
    this._connectSearch();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._clickHandler);
    this._disconnectSearch();
  }

  _connectSearch() {
    customElements.whenDefined('visual-search').then(() => {
      if (!this.isConnected || this._search) {
        return;
      }

      this._search = document.querySelector(this.selector);

      if (!this._search) {
        return;
      }

      VisualSearchPreset.searchEvents.forEach(name => this._search.addEventListener(name, this._updateHandler));
      this._scheduleUpdate();
    });
  }

  _disconnectSearch() {
    if (!this._search) {
      return;
    }

    VisualSearchPreset.searchEvents.forEach(name => this._search.removeEventListener(name, this._updateHandler));
    this._search = null;
  }

  handleClick(event) {
    if (!this._search) {
      return;
    }

    event.preventDefault();

    this._search.applyQuery(this.query);
  }

  _scheduleUpdate() {
    if (!this._search) {
      return;
    }

    // wait for the search to render, as the sorting is read from the rendered select
    this._search.updateComplete.then(() => this._update());
  }

  _update() {
    if (!this._search) {
      return;
    }

    const active = VisualSearchPreset.matches(this.query, this._search.collectQuery(), this.match === 'partial');

    this.toggleAttribute('data-active', active);
    this._toggleChildClass(this.activeClass, active);
  }

  _toggleChildClass(name, active) {
    Array.from(this.children).forEach(child => child.classList.toggle(name, active));
  }

  static matches(preset, current, partial = false) {
    if (Object.hasOwn(preset, 'sorting') && (preset.sorting || '') !== (current.sorting || '')) {
      return false;
    }

    const key = facet => JSON.stringify([facet.facet, String(facet.value)]);
    const presetFacets = (preset.facets || []).map(key);
    const currentFacets = (current.facets || []).map(key);

    if (!partial && presetFacets.length !== currentFacets.length) {
      return false;
    }

    // every preset facet has to consume a distinct facet of the search
    return presetFacets.every(facet => {
      const index = currentFacets.indexOf(facet);

      if (index === -1) {
        return false;
      }

      currentFacets.splice(index, 1);

      return true;
    });
  }
}

customElements.define('visual-search-preset', VisualSearchPreset);
