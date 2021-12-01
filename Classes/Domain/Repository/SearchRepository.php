<?php

namespace KayStrobach\VisualSearch\Domain\Repository;

use KayStrobach\VisualSearch\Domain\Model\QueryConfiguration;
use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class SearchRepository
{
    /**
     * @var \Neos\Flow\Configuration\ConfigurationManager
     * @Flow\Inject
     */
    public $configurationManager;

    /**
     * @param $searchName
     *
     * @return \ArrayAccess
     */
    public function findByName($searchName)
    {
        return new QueryConfiguration(
            $searchName,
            $this->configurationManager->getConfiguration(
                'VisualSearch',
                'Searches.'.$searchName
            )
        );
    }
}
