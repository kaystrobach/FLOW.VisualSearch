<?php

namespace KayStrobach\VisualSearch\Domain\Model;

/**
 * Facets are defined in VisualSearch.yaml and not stored in the Database.
 */
class Facet implements \JsonSerializable
{
    /**
     * Label displayed in the Searchbar.
     *
     * @var string
     */
    protected $label = '';

    /**
     * Value send back to the server for the search action.
     *
     * @var string
     */
    protected $value = '';

    /**
     * Additional Configuration for a facet.
     *
     * @var array
     */
    protected $configuration = [];

    /**
     * constructor.
     *
     * @param string $label
     * @param string $value
     * @param array  $configuration
     */
    public function __construct($label = '', $value = '', $configuration = [])
    {
        $this->label = $label;
        $this->value = $value;
        $this->configuration = $configuration;
    }

    /**
     * used during type conversions.
     *
     * @return array
     */
    public function __toArray()
    {
        return [
            'value'         => $this->value,
            'label'         => $this->label,
            'configuration' => $this->configuration,
        ];
    }

    /**
     * created via \JsonSerializable is important to deliver the right values to the frontend.
     *
     * @return array
     */
    public function jsonSerialize()
    {
        return [
            'value'         => $this->value,
            'label'         => $this->label,
        ];
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param string $label
     */
    public function setLabel($label)
    {
        $this->label = $label;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param string $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * @return array
     */
    public function getConfiguration()
    {
        return $this->configuration;
    }

    /**
     * @param array $configuration
     */
    public function setConfiguration($configuration)
    {
        $this->configuration = $configuration;
    }
}
