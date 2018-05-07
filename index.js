'use strict';

const fs       = require('fs');
const globby   = require('globby');
const pathSort = require('path-sort');

const TranslationParser = require('./translation-parser');
const PotMaker          = require('./pot-maker');

/**
 * Set default options.
 *
 * @param {Object} options
 *
 * @return {Object}
 */
function setDefaultOptions(options) {
  const defaultOptions = {
    src           : [
      '**/*.i18n.json',
      '**/i18n/*.json',
      '!node_modules'
    ],
    destFile      : 'translations.pot',
    headers       : {
      'X-Poedit-Basepath'     : '..',
      'X-Poedit-SourceCharset': 'UTF-8',
      'X-Poedit-SearchPath-0' : '.'
    },
    defaultHeaders: true,
    writeFile     : true
  };

  if (options.headers === false) {
    options.defaultHeaders = false;
  }

  options = Object.assign({}, defaultOptions, options);

  if (!options.package) {
    options.package = options.domain || 'unnamed project';
  }

  return options;
}

/**
 * Set default pot headers
 *
 * @param {object} options
 *
 * @return {object}
 */
function setHeaders(options) {
  if (!options.headers) {
    options.headers = {};
  }

  if (options.bugReport) {
    options.headers['Report-Msgid-Bugs-To'] = options.bugReport;
  }

  if (options.lastTranslator) {
    options.headers['Last-Translator'] = options.lastTranslator;
  }

  if (options.team) {
    options.headers['Language-Team'] = options.team;
  }

  return options;
}

/**
 * Write file to disk
 *
 * @param {string} potContent
 * @param {object} options
 */
function writePot(potContent, options) {
  fs.writeFileSync(options.destFile, potContent);
}

/**
 * Constructor
 * @param {object} options
 * @return {string}
 */
function json2Pot(options) {
  // Reset states
  let translations = {};

  // Set options
  options = setDefaultOptions(options);

  // Find and sort file paths
  const files = pathSort(globby.sync(options.src));

  // Parse files
  for (const file of files) {
    const filecontent       = fs.readFileSync(file).toString();
    const translationParser = new TranslationParser(options);
    translations            = translationParser.parseFile(filecontent, file, translations);
  }

  options = setHeaders(options);

  const potMaker    = new PotMaker(options);
  const potContents = potMaker.generatePot(translations);

  if (options.writeFile) {
    writePot(potContents, options);
  }

  return potContents;
}

module.exports = json2Pot;
