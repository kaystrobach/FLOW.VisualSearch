<?php

namespace KayStrobach\VisualSearch\Utility;

use KayStrobach\VisualSearch\Demands\EqualsDemand;
use KayStrobach\VisualSearch\Demands\InstanceOfDemand;
use KayStrobach\VisualSearch\Demands\Like\EndsWithDemand;
use KayStrobach\VisualSearch\Demands\Like\StartsWithDemand;
use KayStrobach\VisualSearch\Demands\Date\DateDemand;
use KayStrobach\VisualSearch\Demands\Like\StringContainsDemand;
use KayStrobach\VisualSearch\Demands\SimpleDemandInterface;
use KayStrobach\VisualSearch\Domain\Session\Facet;
use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Configuration\ConfigurationManager;
use Neos\Flow\Configuration\Exception\InvalidConfigurationTypeException;
use Neos\Flow\ObjectManagement\Exception\UnknownObjectException;
use Neos\Flow\ObjectManagement\ObjectManager;
use Neos\Flow\Persistence\Doctrine\Query;
use Neos\Flow\Persistence\Doctrine\Repository;
use Psr\Log\LoggerInterface;

class MapperUtility
{
    /**
     * @Flow\Inject()
     * @var LoggerInterface
     */
    protected $logger;

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
     * @param QueryDto $query
     * @param Query $queryObject
     *
     * @return array
     * @throws InvalidConfigurationTypeException
     * @throws UnknownObjectException
     * @todo make it work with multiple values per facet
     *
     */
    public function buildQuery($searchName, QueryDto $query, Query $queryObject)
    {
        $searchConfiguration = $this->configurationManager->getConfiguration(
            'VisualSearch',
            'Searches.'.$searchName.'.autocomplete'
        );

        $demands = [];
        /** @var Facet $queryEntry */
        foreach ($query->getFacets() as $queryEntry) {
            if ($queryEntry->getFacet()) {
                $facet = $queryEntry->getFacet();
                if (isset($searchConfiguration[$facet]['selector']['repository'])) {
                    $repositoryClassName = $searchConfiguration[$facet]['selector']['repository'];
                    /** @var Repository $repository */
                    $repository = $this->objectManager->get($repositoryClassName);
                    $value = $repository->findByIdentifier($queryEntry->getValue());
                    if (is_object($value)) {
                        $this->logger->debug(
                            'Facet: ' . $facet . ' = ' . $queryEntry->getValue() . ' as Object ' . get_class($value)
                        );
                    } else {
                        $this->logger->debug(
                            'Facet: ' . $facet . ' = ' . $queryEntry->getValue() . ' as literal'
                        );
                    }
                } else {
                    $value = $queryEntry->getValue();
                    $this->logger->debug(
                        'Facet: ' . $facet . ' = ' . $value . ' as string'
                    );
                }

                if (!array_key_exists($facet, $searchConfiguration)) {
                    $this->logger->debug(
                        'Facet: No config found for ' . $facet
                    );
                    continue;
                }

                foreach ($searchConfiguration[$facet]['matches'] as $type => $fields) {
                    $matcherClassName = $this->convertMatchShorthandIntoClassName($type);
                    $matcher = new $matcherClassName(
                        $queryObject,
                        $fields,
                        $searchConfiguration[$facet]['selector'] ?? []
                    );

                    if (!$matcher instanceof SimpleDemandInterface) {
                        $this->logger->debug(
                            'Ignored "' . $type . '" converted to "' . $matcherClassName . '" as it is not a SimpleDemandInterface, but a ' . get_parent_class($matcherClassName)
                        );
                        continue;
                    }
                    /** @var SimpleDemandInterface $matcher */

                    $subDemands = $matcher->getDemands($value);
                    if ($subDemands !== null) {
                        $demands[] = $subDemands;
                        $this->logger->debug(
                            'Adding demands',
                            [
                                $subDemands
                            ]
                        );
                    }
                }
            }
        }

        $sorting = $this->getSortingForDoctrine($query->getIdentifier(), $query->getSorting());

        if ($sorting !== null) {
            $queryObject->setOrderings($sorting);
        }

        return $demands;
    }

    public function getSortingForDoctrine(string $identifier, string $sorting): ?array
    {
        if ($sorting === '') {
            return null;
        }

        $sortingConfig = $this->configurationManager->getConfiguration(
            'VisualSearch',
            'Searches.' . $identifier . '.sorting.' . $sorting . '.fields'
        );

        if ($sortingConfig === null) {
            return null;
        }

        return $sortingConfig;
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
                return StringContainsDemand::class;
            case 'sameday':
                return DateDemand::class;
            case 'instanceOf':
                return InstanceOfDemand::class;
            case 'contains':
                return \KayStrobach\VisualSearch\Demands\ContainsDemand::class;
            default:
                return $shorthand;
        }
    }
}
