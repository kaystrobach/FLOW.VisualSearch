<?php

namespace KayStrobach\VisualSearch\Demands\Date;

use KayStrobach\VisualSearch\Demands\AbstractDemand;

class DateDemand extends AbstractDemand
{

    /**
     * @inheritDoc
     *
     * @param mixed $value
     * @return object|null
     * @throws \Neos\Flow\Persistence\Exception\InvalidQueryException
     */
    public function getDemands($value)
    {
        $subDemands = [];
        $dateStartObject = \DateTime::createFromFormat(
            $this->selectorOptions['dateFormat'] ?? 'd.m.Y',
            $value
        );
        if (!$dateStartObject instanceof \DateTime) {
            return null;
        }
        $dateStartObject->setTime(0, 0);
        $dateEndObject = clone $dateStartObject;
        $dateEndObject->setTime(23, 59, 59);

        foreach ($this->fields as $matchField) {
            $subDemands[] = $this->query->logicalAnd(
                [
                    $this->query->greaterThanOrEqual($matchField, $dateStartObject),
                    $this->query->lessThanOrEqual($matchField, $dateEndObject),
                ]
            );
        }
        return $this->query->logicalOr($subDemands);
    }
}
