<?php

namespace KayStrobach\VisualSearch\Utility;

class ArrayUtility {
	/**
	 * checks if an array like
	 *
	 * query[0][facetLabel]:Schulart
	 * query[0][facet]:schulart
	 * query[0][valueLabel]:Grundschule
	 * query[0][value]:ae699050-a687-faaf-2a3a-1185f60cef76
	 *
	 * contains f.e. entry facet, which has the given value schulart
	 *
	 * @param array $array
	 * @param string $key
	 * @param mixed $value
	 * @return bool
	 */
	public static function hasSubEntryWith($array, $key, $value) {
		foreach($array as $entry) {
			if((isset($entry[$key])) && ($entry[$key] === $value)) {
				return true;
			}
		}
		return false;
	}
}