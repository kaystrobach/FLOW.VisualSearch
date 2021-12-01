<?php
namespace KayStrobach\VisualSearch\Controller;

/*
 * This file is part of the KayStrobach.Crud package.
 */

use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Persistence\Doctrine\Query;
use Neos\Flow\Property\TypeConverter\ObjectConverter;

class SearchController extends ActionController
{
    /**
     * @var QueryStorage
     * @Flow\Inject
     */
    protected $queryStorage;

    /**
     * @param array $query
     * @return string
     */
    public function storeQueryAction(array $query): string
    {
        $this->queryStorage->setQuery(
            QueryDto::fromArray($query)
        );

        return 'OK';
    }
}
