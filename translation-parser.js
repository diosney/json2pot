'use strict';

const path  = require('path');
const utils = require('./utils');

class TranslationParser {
  constructor(options) {
    this.options      = options;
    this.translations = [];
  }

  /**
   * Add translation call to array
   *
   * @param {object} translationCall
   */
  addTranslation(translationCall) {
    const translationObject = {
      info  : (translationCall.line)
              ? `${translationCall.filename}:${translationCall.line}`
              : `${translationCall.filename}`,
      msgid : translationCall.id,
      msgstr: translationCall.str
    };

    const translationKey = translationObject.msgid;

    if (!this.translations[translationKey]) {
      this.translations[translationKey] = translationObject;
    }
    else {
      this.translations[translationKey].info += `, ${translationObject.info}`;
    }
  }

  /**
   * Parse file content
   *
   * @param {string} filecontent
   * @param {string} filename
   */
  parseFileContent(filecontent, filename) {
    const self          = this;
    const lines         = filecontent.match(/[^\r\n]+/g);
    const parsedJson    = JSON.parse(filecontent);
    const flattenedJson = utils.dotFlatten(parsedJson);

    for (const translationItemKey in flattenedJson) {
      const id  = translationItemKey;
      const str = flattenedJson[translationItemKey];

      const translationCall = {
        id,
        str,
        filename
      };

      for (let i = 0, j = lines.length; i < j; i++) {
        const line      = lines[i];
        const idLastBit = id.split('.').reverse()[0];

        if (line.search(idLastBit) !== -1) {
          translationCall.line = i + 1;
          break;
        }
      }

      self.addTranslation(translationCall);
    }
  }

  /**
   * Parse JSON file
   *
   * @param {string} fileContent
   * @param {string} filePath
   * @param {object} existingTranslations
   *
   * @return {Array}
   */
  parseFile(fileContent, filePath, existingTranslations) {
    if (existingTranslations === undefined) {
      existingTranslations = {};
    }

    this.translations = existingTranslations;

    const filename = path.relative(path.dirname(this.options.destFile || __filename), filePath)
                         .replace(/\\/g, '/');

    try {
      this.parseFileContent(fileContent, filename);
    }
    catch (e) {
      e.message += ` | Unable to parse ${filename}`;
      throw e;
    }

    return this.translations;
  }
}

module.exports = TranslationParser;
