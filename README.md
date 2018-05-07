# json2pot

## Information

| Package     | json2pot                                   |
| ----------- | ---------------------------------------- |
| Description | Generate pot files from JSON keyed translation files. |

## Install

```
$ npm install --save-dev json2pot
```


## Example usage

```js
const json2pot = require('json2pot');

json2pot({
  destFile: 'file.pot',
  domain  : 'domain',
  package : 'Example project',
  src     : 'src/*.php'
});
```


## Options

*All options are optional*

- `bugReport`  
  Description: Header with URL for reporting translation bugs  
  Type: `string`  
  Default: undefined
  
- `domain`  
  Description: Domain to retrieve the translated text. All textdomains is included if undefined.  
  Type: `string`   
  Default: undefined
  
- `destFile`  
  Description: Filename for template file  
  Type: `string`  
  Default: `domain.pot` or `translations.pot` if domain is undefined
  
- `headers`  
  Description: Object containing extra POT-file headers. Set to false to not generate the default extra headers for Poedit.  
  Type: `object|bool`  
  Default: Headers used by Poedit
  
- `lastTranslator`  
  Description: Name and email address of the last translator (ex: `John Doe <me@example.com>`)  
  Type: `string`  
  Default: undefined
  
- `package`  
  Description: Package name  
  Type: `string`  
  Default: `domain` or `unnamed project` if domain is undefined
  
- `src`  
  Description: Glob or globs to match files (see [Globbing Patterns](https://github.com/sindresorhus/globby#globbing-patterns))  
  Type: `string|array`  
  Default:  ['**/*.i18n.json', '**/i18n/*.json', '!node_modules']
  
- `team`  
  Description: Name and email address of the translation team (ex: `Team <team@example.com> `)  
  Type: `string`    
  Default: undefined
  
- `writeFile`  
  Description: Write pot-file to disk. The function always returns the contents as well.  
  Type: `boolean`  
  Default: `true`


## Related
- [gulp-json2pot](https://github.com/diosney/gulp-json2pot) - Run json2pot via gulp  


## License

MIT © [Diosney Sarmiento](https://github.com/diosney)

Thanks to [Rasmus Bengtsson](https://github.com/rasmusbe) for its work on 
[wp-pot](https://github.com/rasmusbe/wp-pot) which this package is heavily based on.