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

	/**
	 * checks if each value of the given key exists in atleast one children
	 * of the array
	 *
	 * @param $array
	 * @param $key
	 * @param $values
	 * @return bool
	 */
	public static function hasAllSubentries($array, $key, $values) {
		foreach($values as $value) {
			if(!self::hasSubEntryWith($array, $key, $value)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * lets you filter the array by key and value and than returns
	 * the whole entry
	 *
	 * @param array $array
	 * @param string $key
	 * @param string $value
	 * @return array|null
	 */
	public static function getOneSubEntryWith($array, $key, $value) {
		foreach($array as $entry) {
			if((isset($entry[$key])) && ($entry[$key] === $value)) {
				return $entry;
			}
		}
		return NULL;
	}
}