<?php

namespace KayStrobach\VisualSearch\Utility;

use KayStrobach\VisualSearch\Demands\EqualsDemand;
use KayStrobach\VisualSearch\Demands\Like\ContainsDemand;
use KayStrobach\VisualSearch\Demands\Like\EndsWithDemand;
use KayStrobach\VisualSearch\Demands\Like\StartsWithDemand;
use KayStrobach\VisualSearch\Demands\Date\DateDemand;
use KayStrobach\VisualSearch\Demands\SimpleDemandInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Configuration\ConfigurationManager;
use Neos\Flow\Configuration\Exception\InvalidConfigurationTypeException;
use Neos\Flow\Log\SystemLoggerInterface;
use Neos\Flow\ObjectManagement\Exception\UnknownObjectException;
use Neos\Flow\ObjectManagement\ObjectManager;
use Neos\Flow\Persistence\Doctrine\Query;
use Neos\Flow\Persistence\Doctrine\Repository;

class MapperUtility
{
    /**
     * @var SystemLoggerInterface
     * @Flow\Inject
     */
    protected $systemLogger;

    /**
     * @var ObjectManager
     * @Flow\Inject
     */
    protected $objectManager;

    /**
     * @var ConfigurationManager
     * @Flow\Inject
     */
    protected $configurationManager;

    /**
     * @param array $searchConfiguration
     * @param array $query
     * @param string $facet
     *
     * @return object
     * @throws UnknownObjectException
     */
    public function getSingleObject($searchConfiguration, $query, $facet)
    {
        $facetEntry = ArrayUtility::getOneSubEntryWith($query, 'facet', $facet);
        $objectIdentifier = $facetEntry['value'];
        /** @var \Neos\Flow\Persistence\Repository $objectRepository */
        $objectRepository = $this->objectManager->get($searchConfiguration[$facet]['selector']['repository']);

        return $objectRepository->findByIdentifier($objectIdentifier);
    }

    // -------------------------------------------------------------------------

    /**
     * iterates over all.
     *
     * @param string $searchName
     * @param array $query
     * @param Query $queryObject
     *
     * @return array
     * @throws InvalidConfigurationTypeException
     * @throws UnknownObjectException
     * @todo make it work with multiple values per facet
     *
     */
    public function buildQuery($searchName, $query, Query $queryObject)
    {
        $searchConfiguration = $this->configurationManager->getConfiguration(
            'VisualSearch',
            'Searches.'.$searchName.'.autocomplete'
        );

        $demands = [];
        foreach ($query as $queryEntry) {
            if (isset($queryEntry['facet'])) {
                $facet = $queryEntry['facet'];
                if (isset($searchConfiguration[$facet]['selector']['repository'])) {
                    $repositoryClassName = $searchConfiguration[$facet]['selector']['repository'];
                    /** @var Repository $repository */
                    $repository = $this->objectManager->get($repositoryClassName);
                    $value = $repository->findByIdentifier($queryEntry['value']);
                    if (is_object($value)) {
                        $this->systemLogger->log('Facet: ' . $facet . ' = ' . $queryEntry['value'] . ' as Object ' . get_class($value), LOG_DEBUG);
                    } else {
                        $this->systemLogger->log('Facet: ' . $facet . ' = ' . $queryEntry['value'] . ' as literal', LOG_DEBUG);
                    }
                } else {
                    $value = $queryEntry['value'];
                    $this->systemLogger->log('Facet: '.$facet.' = '.$queryEntry['value'].' as string', LOG_DEBUG);
                }

                foreach ($searchConfiguration[$facet]['matches'] as $type => $fields) {
                    $matcherClassName = $this->convertMatchShorthandIntoClassName($type);
                    $matcher = new $matcherClassName(
                        $queryObject,
                        $fields,
                        $searchConfiguration[$facet]['selector'] ?? []
                    );

                    if (!$matcher instanceof SimpleDemandInterface) {
                        $this->systemLogger->log(
                            'Ignored "' . $type . '" converted to "' . $matcherClassName . '" as it is not a SimpleDemandInterface, but a ' . get_parent_class($matcherClassName),
                            LOG_DEBUG
                        );
                        continue;
                    }
                    /** @var SimpleDemandInterface $matcher */

                    $subDemands = $matcher->getDemands($value);
                    if ($subDemands !== null) {
                        $demands[] = $subDemands;
                        $this->systemLogger->log(
                            'Adding demands',
                            LOG_DEBUG,
                            $subDemands
                        );
                    }
                }
            }
        }

        return $demands;
    }

    public function convertMatchShorthandIntoClassName(string $shorthand): string
    {
        switch ($shorthand) {
            case 'equals':
                return EqualsDemand::class;
            case '%like':
                return StartsWithDemand::class;
            case 'like%':
                return EndsWithDemand::class;
            case 'like':
                return ContainsDemand::class;
            case 'sameday':
                return DateDemand::class;
            default:
                return $shorthand;
        }
    }
}
