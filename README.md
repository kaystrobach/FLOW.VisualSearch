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