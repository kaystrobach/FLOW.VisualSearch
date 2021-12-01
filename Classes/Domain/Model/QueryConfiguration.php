<?php

namespace KayStrobach\VisualSearch\Domain\Model;

class QueryConfiguration implements \ArrayAccess
{
    /**
     * @var string
     */
    protected $queryName;
    /**
     * @var  array
     */
    protected $queryConfiguration;

    public function __construct(string $queryName, array $queryConfiguration)
    {
        $this->queryName = $queryName;
        $this->queryConfiguration = $queryConfiguration;
    }

    public function offsetExists($offset)
    {
        return isset($this->queryConfiguration[$offset]);
    }

    public function offsetGet($offset)
    {
        return $this->queryConfiguration[$offset] ?? null;
    }

    public function offsetSet($offset, $value)
    {
        if (is_null($offset)) {
            $this->queryConfiguration[] = $value;
        } else {
            $this->queryConfiguration[$offset] = $value;
        }
    }

    public function offsetUnset($offset)
    {
        unset($this->queryConfiguration[$offset]);
    }

    public function getQueryName(): string
    {
        return $this->queryName;
    }

    public function getAutocomplete()
    {
        return $this->queryConfiguration['autocomplete'];
    }

    public function getSorting()
    {
        return $this->queryConfiguration['sorting'];
    }
}
