# api.rezsi.io

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
