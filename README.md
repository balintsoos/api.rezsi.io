# api.rezsi.io

[![dependencies Status](https://david-dm.org/balintsoos/api.rezsi.io/status.svg)](https://david-dm.org/balintsoos/api.rezsi.io)
[![devDependencies Status](https://david-dm.org/balintsoos/api.rezsi.io/dev-status.svg)](https://david-dm.org/balintsoos/api.rezsi.io?type=dev)

## Getting started

Install [yarn](https://yarnpkg.com/en/docs/install)

Install dependencies:
```sh
yarn
```

Set environment variables:
```sh
cp .env.example .env
```

Start server:
```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=rezsi-io:* yarn start
```
Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.
