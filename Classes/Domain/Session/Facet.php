<?php
/**
 * Created by kay.
 */

namespace KayStrobach\VisualSearch\Domain\Session;

class Facet
{
    /**
     * @var string
     */
    protected $facetLabel;

    /**
     * @var string
     */
    protected $facet;

    /**
     * @var string
     */
    protected $value;

    /**
     * @var string
     */
    protected $valueLabel;

    /**
     * @return string
     */
    public function getFacetLabel(): string
    {
        return $this->facetLabel;
    }

    /**
     * @param string $facetLabel
     */
    public function setFacetLabel(string $facetLabel): void
    {
        $this->facetLabel = $facetLabel;
    }

    /**
     * @return string
     */
    public function getFacet(): string
    {
        return $this->facet;
    }

    /**
     * @param string $facet
     */
    public function setFacet(string $facet): void
    {
        $this->facet = $facet;
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @param string $value
     */
    public function setValue(string $value): void
    {
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getValueLabel(): string
    {
        return $this->valueLabel;
    }

    /**
     * @param string $valueLabel
     */
    public function setValueLabel(string $valueLabel): void
    {
        $this->valueLabel = $valueLabel;
    }
}
