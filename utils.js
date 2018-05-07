'use strict';

const isPlainObject = require('lodash.isplainobject');
const cloneDeep     = require('lodash.clonedeep');

/**
 * Flattens an object tree down to an object of only one level with property
 * names with the dotted full path to the leave data.
 *
 * Ex: { 'a.b.c.d': 23, 'a.b.c.e': 54 }
 *
 * Usage: `dotFlatten(object)`
 * Usage: `dotFlatten(object, ',')`
 *
 * @param  {Object} object            - The object to process.
 * @param  {String} [optSep]          - The separator between nested properties. Default '.'.
 * @return {Object}
 */
function dotFlatten(object, optSep) {
  let flattenedMap = {};

  if (!object) {
    throw new Error('`object` should be a proper Object non null nor undefined.');
  }
  let sep = optSep || '.';

  dotFlattenFn(object, sep, flattenedMap);
  return flattenedMap;
}

/**
 * The real workhorse of the `dotFlatten` function.
 * A recursive function that fills a map when found the object leaves.
 *
 * @param  {Object} object
 * @param  {String} sep               - The separator between nested properties.
 * @param  {Object} flattenedMap      - The resulting object map of the flattening process.
 * @param  {Array} [optPathSoFar]     - The path that we have processed so far.
 * @return {Object}
 */
function dotFlattenFn(object, sep, flattenedMap, optPathSoFar) {
  let levelKeys = Object.keys(object);

  for (let i = 0, j = levelKeys.length; i < j; i++) {
    let key       = levelKeys[i];
    let value     = object[key];
    let pathSoFar = cloneDeep(optPathSoFar) || [];

    pathSoFar.push(key);

    if (isPlainObject(value)) {
      dotFlattenFn(value, sep, flattenedMap, pathSoFar);
    }
    else {
      flattenedMap[pathSoFar.join(sep)] = value;
    }
  }
}

module.exports = {
  dotFlatten: dotFlatten
};
