<?php

namespace KayStrobach\VisualSearch\Demands\Like;

use KayStrobach\VisualSearch\Demands\LikeDemand;

class ContainsDemand extends LikeDemand
{
    protected $prefix = '%';
    protected $postfix = '%';
}
