# boilerplate-kirby [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)
> Opinionated boilerplate for Kirby 3.x and jsx, built on top of [`kirby-webpack`](https://github.com/brocessing/kirby-webpack/)

<br>

## Installation
### By using as a Github template
[Use this template](https://github.com/chevalvert/boilerplate-kirby/generate).

### By cloning and unboiling manually
```console
$ git clone https://github.com/chevalvert/boilerplate-kirby my-kirby-website
$ cd my-kirby-website
$ npm install
$ composer install
```

##### :bulb: Before starting your project, it is recommanded to unboil it using [brocessing/`unboil`](https://github.com/brocessing/unboil) :
>`unboil` allows you to clean a boilerplate project (files like package.json, readme, git...) to quickly start your own project from it.


## Usage

```console
$ npm run start
$ npm run build
$ composer update getkirby/cms
```

### Deployment

Deployment is done automatically via a [Github action](.github/workflows/main.yml). Simply create a new release by running:
```console
$ npm version [major|minor|patch]
```
<sup>**Important:** some directories are not under version control (`www/kirby`, `www/plugins/*`, see [`.gitignore`](.gitignore)).<br>Deployment for those directories should be done manually.</sup>


## Credits

Built with [**kirby-webpack**](https://github.com/brocessing/kirby-webpack).
JSX utils heavily based on [**pqml**](https://github.com/pqml)’s work.

## License
[MIT.](https://tldrlegal.com/license/mit-license)

