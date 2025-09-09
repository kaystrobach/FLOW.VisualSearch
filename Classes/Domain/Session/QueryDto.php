<?php

namespace KayStrobach\VisualSearch\Domain\Session;

use Neos\Flow\Configuration\ConfigurationManager;
use Neos\Flow\Annotations as Flow;

class QueryDto implements \JsonSerializable
{
    /**
     * @var string
     */
    protected $identifier;

    /**
     * @var Facet[]
     */
    protected $facets;

    /**
     * @var string
     */
    protected $sorting;

    public function __construct()
    {
        $this->identifier = '';
        $this->facets = [];
        $this->sorting = '';
    }

    public function setIdentifier(string $identifier)
    {
        $this->identifier = $identifier;
    }

    public function getIdentifier()
    {
        return $this->identifier;
    }

    /**
     * @param Facet[] $facets
     */
    public function setFacets(array $facets)
    {
        $this->facets = $facets;
    }

    /**
     * @return Facet[]
     */
    public function getFacets(): array
    {
        return $this->facets;
    }

    public function addFacet(Facet $facet)
    {
        $this->facets[] = $facet;
    }

    /**
     * @param string|null $sorting
     */
    public function setSorting(?string $sorting = null)
    {
        $this->sorting = $sorting;
    }

    public function getSorting(): ?string
    {
        return $this->sorting;
    }

    public static function fromArray(array $array): self
    {
        $o = new static();
        $o->setIdentifier($array['identifier']);
        $o->setSorting($array['sorting'] ?? '');
        if (isset($array['facets']) && is_array($array['facets'])) {
            foreach ($array['facets'] as $facet) {
                $facetObject = new Facet();
                $facetObject->setFacet($facet['facet']);
                $facetObject->setFacetLabel($facet['facetLabel']);
                $facetObject->setValue($facet['value']);
                $facetObject->setValueLabel($facet['valueLabel']);
                $o->addFacet($facetObject);
            }
        }
        return $o;
    }

    public function jsonSerialize(): array
    {
        return $this->getFacets();
    }

    public function jsonSerialize2(): array
    {
        // guess what broke backwards compatibility lol

        return [
            'identifier' => $this->getIdentifier(),
            'sorting' => $this->getSorting(),
            'facets' => $this->getFacets(),
        ];
    }
}
