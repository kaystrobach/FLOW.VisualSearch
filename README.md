# FLOW.VisualSearch

[![StyleCI](https://github.styleci.io/repos/34098471/shield?branch=master)](https://github.styleci.io/repos/34098471)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/187a572c4b314a868532dca36ae79fac)](https://www.codacy.com/app/github_130/FLOW.VisualSearch?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kaystrobach/FLOW.VisualSearch&amp;utm_campaign=Badge_Grade)

This package provides a powerful search component for Flow ecosystem. Any search repository can be made searchable by
extending `SearchableRepository` and providing an appropriate configuration. The front-end component is provided as a
Fluid partial.

![Demo](demo.gif)

## Installation

```sh
composer require kaystrobach/visualsearch:^3.0.0
```

## Usage

To make a repository searchable, extend `SearchableRepository` or implement the `SearchableRepositoryInterface`.
Note that the `defaultSearchName` property should set to the name of the corresponding search configuration.

```php
<?php

namespace Poke\Search\Domain\Repository;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\Repository;

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepository;

/**
 * @Flow\Scope("singleton")
 */
class PokemonRepository extends SearchableRepository
{
    /**
     * @var string
     */
    protected $defaultSearchName = 'pokemon';

    public function findByName(string $name)
    {
        ...
    }
}
```

The repository can now be queried using the `findByDefaultQuery` method, e.g., from inside a controller action.

```php
public function indexAction() {
    $this->view->assign('pokemon', $this->pokemonRepository->findByDefaultQuery());
}
```

To actually display the search component, include the search partial in your template.

```html
<f:render partial="Visualsearch/Search" arguments="{searchName:'pokemon', pokemon:pokemon}" contentAs="value">
    ...
</f:render>
```

### Listening to Events

You can use the `visual-search-listener` component to react to search events.

```html
<visual-search-listener event="VisualSearchRequestUpdateChanged">
    <template>
        A change has happened, so the search results are not accurate anymore. Hit enter to trigger an update.
    </template>
</visual-search-listener>
```

### Events

The `visual-search` component fires the following events. All of them are `CustomEvent`s that bubble and are
`composed`, so they can be caught on the component itself, on any ancestor, or on `window`.

| Event                                    | Cancelable | Fired when                                                                                                     | Effect of `preventDefault()`                                  |
|------------------------------------------|------------|----------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| `change`                                 | yes        | The user types into the search input.                                                                          | Autocomplete is not updated for this input.                   |
| `search`                                 | yes        | The search is submitted using the search button.                                                               | The query is neither stored nor is the page reloaded.         |
| `sorting`                                | yes        | The sort selection changes, either via the sort dropdown or via `setSorting()` (e.g. from `visual-search-sort`). | The query is neither stored nor is the page reloaded.         |
| `VisualSearchRequestUpdate<Property>`    | yes        | A reactive property of the component changes. `<Property>` is the property name with the first letter capitalized. | None, the update is applied anyway.                           |
| `debug`                                  | no         | Internal log messages are written (also every time one of the events above is fired).                          | -                                                             |

The most useful `VisualSearchRequestUpdate<Property>` events are:

- `VisualSearchRequestUpdateSelectedFacets`: a facet or value has been added or removed.
- `VisualSearchRequestUpdateChanged`: the selected facets differ from the ones the current results are based on.
- `VisualSearchRequestUpdateAutocomplete`: the autocomplete suggestions have been updated.

Events are also fired for the other properties (`Facets`, `Values`, `Query`, `Sorting`, `Search`, `ShowDebugLog`,
`NestedFacets`, `FacetsAction`, `ValueAction`, `QueryAction`).

`event.detail.message` contains the JSON encoded event name. `debug` events carry the log message in
`event.detail.message` instead.

```js
document.querySelector('visual-search').addEventListener('search', (event) => {
    if (!confirm('Really search?')) {
        event.preventDefault();
    }
});
```

Note that pressing enter in the input as well as the clear button store the query and reload the page without firing
the `search` event.

Additionally, the internal `search-facet` elements fire a `facet-delete` event when the remove button of a facet is
clicked. It bubbles out of the component as well, but carries no information about the removed facet.

### Handled Events

The `visual-search` component does not listen for any events from outside, it can only be controlled via its
attributes (e.g. `query`) and the `setSorting(value)` method. Internally it handles the following events:

| Element                  | Event          | Action                                                                                                   |
|--------------------------|----------------|----------------------------------------------------------------------------------------------------------|
| Search input             | `focus`        | Shows the autocomplete suggestions if the input is empty.                                                |
| Search input             | `input`        | Fires `change` and updates the autocomplete suggestions.                                                 |
| Search input             | `keydown`      | `Enter` completes the first suggestion or stores the query and reloads, `Backspace` on an empty input removes the last facet, `Tab`/`ArrowDown`/`ArrowUp` move the focus into the suggestions, `Escape` blurs the input. |
| Autocomplete suggestion  | `click`        | Adds the suggested facet or value.                                                                       |
| Autocomplete suggestion  | `keydown`      | `ArrowDown`/`ArrowUp`/`Tab` move between suggestions, `Escape` returns the focus to the input.           |
| Search button            | `click`        | Submits the search (fires `search`).                                                                     |
| Sort select              | `change`       | Fires `sorting` and submits the search.                                                                  |
| Clear button             | `click`        | Removes all facets and the sorting, stores the query and reloads.                                        |
| `search-facet`           | `facet-delete` | Removes the facet.                                                                                       |

The companion components listen for these events:

| Component                | Event                    | Listens on                                         | Action                                                       |
|--------------------------|--------------------------|----------------------------------------------------|--------------------------------------------------------------|
| `visual-search-listener` | value of `event`         | The elements matching `selector`, or else `window` | Shows the content of its `<template>`.                       |
| `visual-search-sort`     | `search`, `sorting`      | `window`                                           | Updates its state from the `query` of the search component.  |
| `debug-log`              | `debug`                  | Its parent node                                    | Appends the message to the log.                              |

### External Sorting

You can use the `visual-search-sort` component to trigger sorting from outside the main search component.

```html
<visual-search-sort asc="1" desc="2" selector="#my-search">
    <span slot="neutral">↕</span>
    <span slot="asc">▲</span>
    <span slot="desc">▼</span>
</visual-search-sort>
```

The component supports the following attributes:
- `asc`: The value to set for ascending sort.
- `desc`: (Optional) The value to set for descending sort.
- `selector`: (Optional) A CSS selector to find the `visual-search` component (defaults to `visual-search`).
- `template`: (Optional) ID of a `<template>` tag to use for rendering. If used, the wrapper `div` will have a class `state-neutral`, `state-asc`, or `state-desc` which you can use for styling.

## Configuration

Search configurations are defined in the `Configuration/VisualSearch.yaml` file. Please see the demo package for an
[example configuration](Demo/Pokemon/DistributionPackages/Poke.Search/Configuration/VisualSearch.pokemon.yaml).

## Theming

The search component can be styled using the following CSS properties:

| Custom Property                        | Default   |
|----------------------------------------|-----------|
| --visual-search-background-color       | white     |
| --visual-search-color                  | black     |
| --visual-search-background-color-focus | lightgray |
| --visual-search-color-focus            | black     |
| --visual-search-facet-background-color | lightgray |
| --visual-search-facet-color            | black     |

## Development

Install front-end dependencies via npm.

```sh
cd Resources/Private/App
npm install
```

After making changes to the front-end code, run the build script to bundle the assets.

```sh
npm run build
```

Linters are available for both JavaScript and CSS templates.

```sh
npm run lint:js
npm run lint:css
```

## License

This project is licensed under the MIT License.
