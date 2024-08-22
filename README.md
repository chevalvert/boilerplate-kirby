# WIP add content by default

# Boilerplate-kirby
> Opinionated boilerplate for Kirby 4, built on top of [`kirby-vite-multi-page-kit`](https://github.com/arnoson/kirby-vite-multi-page-kit/tree/main)

## Requirements

- [Composer](https://formulae.brew.sh/formula/composer)
- [Node >= 18](https://nodejs.org/en/download/package-manager)

## Installation

[Use this template](https://github.com/chevalvert/boilerplate-kirby/generate).

```console
$ composer install
$ yarn install
```

## Usage

```console
$ yarn start
$ composer update getkirby/cms
```

### Deployment

Deployment is done automatically via a [Github action](.github/workflows/release.yml). Simply create a new release by running:
```console
$ yarn version
```
<sup>**Important:** some directories are not under version control (`kirby`, `plugins/*`, see [`.gitignore`](.gitignore)).<br>Deployment for those directories should be done manually.</sup>

## Versioning

Because this is a boilerplate and not a library it doesn’t use semantic versioning.

## Credits

Built on top of **[kirby-vite-multi-page-kit](https://github.com/arnoson/kirby-vite-multi-page-kit/tree/main)**.

## License
[MIT.](https://tldrlegal.com/license/mit-license)
