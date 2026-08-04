<?php

namespace KayStrobach\VisualSearch\Domain\Model;

class QueryConfiguration implements \ArrayAccess
{
    /**
     * @var string
     */
    protected string $queryName;
    /**
     * @var  array
     */
    protected array $queryConfiguration;

    public function __construct(string $queryName, array $queryConfiguration)
    {
        $this->queryName = $queryName;
        $this->queryConfiguration = $queryConfiguration;
    }

    public function offsetExists(mixed $offset): bool
    {
        return isset($this->queryConfiguration[$offset]);
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->queryConfiguration[$offset] ?? null;
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        if (is_null($offset)) {
            $this->queryConfiguration[] = $value;
        } else {
            $this->queryConfiguration[$offset] = $value;
        }
    }

    public function offsetUnset($offset): void
    {
        unset($this->queryConfiguration[$offset]);
    }

    public function getQueryName(): string
    {
        return $this->queryName;
    }

    public function getAutocomplete()
    {
        return $this->queryConfiguration['autocomplete'] ?? [];
    }

    public function getSorting()
    {
        return $this->queryConfiguration['sorting'] ?? [];
    }
}
