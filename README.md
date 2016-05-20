# npm-cross-conf-env

[![npm version](https://badge.fury.io/js/cross-conf-env.svg)](https://badge.fury.io/js/cross-conf-env)
[![Build Status](https://travis-ci.org/akabekobeko/npm-cross-conf-env.svg?branch=master)](https://travis-ci.org/akabekobeko/npm-cross-conf-env)
[![Document](https://doc.esdoc.org/github.com/akabekobeko/npm-cross-conf-env/badge.svg?t=0)](https://doc.esdoc.org/github.com/akabekobeko/npm-cross-conf-env)

To cross-platform the `config` and `root` variable reference of package.json in npm-scripts.

## Installation

```
$ npm install cross-conf-env
```

## Usage

To the `config` of package.json to set the value.

```js
{
  "name": "sample",
  "version": "1.0.0",
  "config": {
    "app": "MyApp"
  },
  "scripts": {
    "var": "cross-conf-env echo npm_package_config_app npm_package_version",
    "var:bash": "cross-conf-env echo $npm_package_config_app $npm_package_version",
    "var:win": "cross-conf-env echo %npm_package_config_app% %npm_package_version%"
  },
  "dependencies": {
    "cross-conf-env": "^1.0.0"
  }
}
```

Value of `npm_package_config_` or `npm_package_` will be executed after being replaced.

```
$ npm run var

MyApp 1.0.0

$ npm run var:bash

MyApp 1.0.0

$ npm run var:win

MyApp 1.0.0
```

The format of the environment variable in npm-scripts are different for each platform. **OS X** or **Linux** ( bash ) is `$variable`, **Windows** ( cmd.exe or PowerShell ) is `%variable%`.

It supports all of the format by using this npm in npm-scripts, format that support is below.

| Platform | Format |
|:--|:--|
| **OS X**, **Linux** ( bash ) | `$npm_package_` or `$npm_package_config_` |
| **Windows** ( cmd.exe or PowerShell ) | `%npm_package_%` or `%npm_package_config_%` |
| `cross-conf-env` original | `npm_package_` or `npm_package_config_` |

npm-scripts environment variable that has been expanded by the execution platform is used as it is. Otherwise, to expand the `cross-conf-env`.

Definition of npm-scripts:

```
cross-conf-env command param1 param2 ...etc
```

# ChangeLog

* [CHANGELOG](CHANGELOG.md)

# License

* [MIT](LICENSE.txt)
