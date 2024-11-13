<?php

namespace KayStrobach\VisualSearch\Demands\Like;

use KayStrobach\VisualSearch\Demands\LikeDemand;

class StringContainsDemand extends LikeDemand
{
    protected $prefix = '%';
    protected $postfix = '%';
}
