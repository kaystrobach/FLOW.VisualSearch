[![StyleCI](https://github.styleci.io/repos/34098471/shield?branch=master)](https://github.styleci.io/repos/34098471)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/187a572c4b314a868532dca36ae79fac)](https://www.codacy.com/app/github_130/FLOW.VisualSearch?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kaystrobach/FLOW.VisualSearch&amp;utm_campaign=Badge_Grade)

# FLOW.VisualSearch

![Filter](Documentation/filter.gif)

Basicly it ships a FLUID ViewHelper and the ability to configure that viewHelper heavily, this way we can do advanced searches

You can define:

* and configure multiple Searches
* search multiple attributes of a model (uses dynamic query building)
* Repositories have to implement an interface to be searchable
* Searches are instantly stored in the user session if the user changes it

## Installation

This package can be installed via composer.

Please execute:

```
composer require kaystrobach/visualsearch @dev
```


Alternativly you can add the following line to your ```composer.json``` and execute ```composer update```

```
	"kaystrobach/visualsearch": "@dev"
```

## Basic Usage

### Inclusion in a FLUID Template

To include the viewHelper you include a line like:

```
<search:widget.search search="KayStrobach_Contact_Institution"/>
```

This way you define, that ```students``` is the key for storing the filter query in the session for later usage and it is the key for configuring the search in the ```VisualSearch.yaml```.

To make it even easier, you can use the partial provided by the package:

```
<f:render partial="Visualsearch/Search" arguments="{searchName:'KayStrobach_Contact_Institution', institutions:institutions}" contentAs="value">
	...
</f:render>
```

### Make it possible to query your repository

```php
<?php
namespace Acme\Project\Domain\Repository;

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepository;
use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class StudentRepository extends SearchableRepository {

    /**
     * @var string
     */
    protected $defaultSearchName = 'KayStrobach_Contact_Institution';
```

### query the repository in your controller

```php
    public function indexAction() {
        $this->view->assign(
            'institutions',
            $this->institutionRepository->findByDefaultQuery()
        );
    }

```

### VisualSearch.yaml

to define the search please checkout the visualSearch.yaml file, please use the package `kaystrobach/contact` as reference.


## Advanced Usage




## Searching in the Repository by query

In the studentsRepository you can use the following function to get the filtered students:

```
<?php
namespace Acme\Project\Domain\Repository;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "SBS.LaPo".              *
 *                                                                        *
 *                                                                        */

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Reflection\ObjectAccess;

/**
 * @Flow\Scope("singleton")
 */
class StudentRepository extends SearchableRepository {
	/**
	 * @param array $query
	 * @return \TYPO3\Flow\Persistence\QueryResultInterface
	 */
	public function findByQuery($query) {
		$queryObject = $this->createQuery();

		$demands = $this->mapperUtility->buildQuery('lapoStudents', $query, $queryObject);

		// move easy filter to the beginning
		array_unshift($demands, $queryObject->lessThan('deleted', 1));

		$queryObject->matching(
			$queryObject->logicalAnd(
				$demands
			)
		);
		return $queryObject->execute();
	}
```

The buildQuery function is currently in a state, where is maybe moved to the SearchableRepository lateron.

## Usage in the controller

In a controller you can then use these lines to filter the resultset:

```
	/**
	 * @var \KayStrobach\VisualSearch\Domain\Session\QueryStorage
	 * @Flow\Inject
	 */
	protected $queryStorage;

	public function indexAction() {
		$this->view->assign('students', $this->studentRepository->findByQuery($this->queryStorage->getQuery('students')));
	}
```

Additionally you need to define how the search should do the autocompletition, this is done in ```Configuration/VisualSearch.yaml``` please take a look into the example file to get an idea.
