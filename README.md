<!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <img src="https://github.com/redhat-plumbers-in-action/team/blob/1d0fb016c60a7b0c155ceea53e6083f69d2d85b9/members/red-plumber.png" width="100" />
  <h1 align="center">Regression Sniffer</h1>
</p>

[![GitHub Marketplace][market-status]][market] [![Lint Code Base][linter-status]][linter] [![Unit Tests][test-status]][test] [![CodeQL][codeql-status]][codeql] [![Check dist/][check-dist-status]][check-dist]

[![codecov][codecov-status]][codecov]

<!-- Status links -->

[market]: https://github.com/marketplace/actions/regression-sniffer
[market-status]: https://img.shields.io/badge/Marketplace-Regression%20Sniffer-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEZPfsVJ61jbxaF0cRQRcRJ9hlYn30IHN/+9iquDCOIsblIrOjqKgy5aKoJQj4O3EEtbPwhJbr6Te28CmdSKeqzeqr0YbfVIrTBKakvtOl5dtTkK+v4HfA9PEyBFCY9AGVgCBLaBp1jPAyfAJ/AAdIEG0dNAiyP7+K1qIfMdonZic6+WJoBJvQlvuwDqcXadUuqPA1NKAlexbRTAIMvMOCjTbMwl1LtI/6KWJ5Q6rT6Ht1MA58AX8Apcqqt5r2qhrgAXQC3CZ6i1+KMd9TRu3MvA3aH/fFPnBodb6oe6HM8+lYHrGdRXW8M9bMZtPXUji69lmf5Cmamq7quNLFZXD9Rq7v0Bpc1o/tp0fisAAAAASUVORK5CYII=

[linter]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/lint.yml
[linter-status]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/lint.yml/badge.svg

[test]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/unit-tests.yml
[test-status]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/unit-tests.yml/badge.svg

[codeql]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/codeql-analysis.yml
[codeql-status]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/codeql-analysis.yml/badge.svg

[check-dist]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/check-dist.yml
[check-dist-status]: https://github.com/redhat-plumbers-in-action/regression-sniffer/actions/workflows/check-dist.yml/badge.svg

[codecov]: https://codecov.io/gh/redhat-plumbers-in-action/regression-sniffer
[codecov-status]: https://codecov.io/gh/redhat-plumbers-in-action/regression-sniffer/branch/main/graph/badge.svg

<!-- -->

TODO: ...

## Features

TODO: ...

## Usage

TODO: ...

## Configuration options

Action currently accepts the following options:

```yml
# ...

- uses: redhat-plumbers-in-action/regression-sniffer@v1
  with:
    check-follow-up:  <boolean>
    check-revert:     <boolean>
    pr-metadata:      <pr-metadata.json>
    config-path:      <path to config file>
    token:            <GitHub token or PAT>

# ...
```

### check-follow-up

Check if Pull Request has some follow-up commit related to cherri-picked commits in upstream available.

* default value: `true`
* requirements: `optional`

### check-revert

Check if Pull Request has some cherri-picked commits from upstream that were later reverted.

* default value: `true`
* requirements: `optional`

### pr-metadata

Stringified JSON Pull Request metadata provided by GitHub Action [`redhat-plumbers-in-action/gather-pull-request-metadata`](https://github.com/redhat-plumbers-in-action/gather-pull-request-metadata).

Pull Request metadata has the following format: [metadata format](https://github.com/redhat-plumbers-in-action/gather-pull-request-metadata#metadata)

* default value: `undefined`
* requirements: `required`

### config-path

Path to configuration file. Configuration file format is described in: [Config section](#config).

* default value: `.github/regression-sniffer.yml`
* requirements: `optional`

### token

GitHub token or PAT is used for creating comments on Pull Request.

```yml
# required permission
permissions:
  pull-requests: write
```

* default value: `undefined`
* requirements: `required`
* recomended value: `secrets.GITHUB_TOKEN`

## Config

...

## Limitations

TODO: ...
