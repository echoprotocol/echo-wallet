# Echo Desktop Wallet

![Travis (.com) branch](https://img.shields.io/travis/com/echoprotocol/echo-wallet/master?label=build%20master)
![Travis (.com) branch](https://img.shields.io/travis/com/echoprotocol/echo-wallet/develop?label=build%20develop)

The Echo Desktop Wallet is a local application that allows you to create, manage, and import an Echo account, work with contracts, send and receive assets. The wallet is built on the latest technologies and available for Linux, Mac, and Windows operating systems.

![Echo Desktop Wallet](wallet_example.png?raw=true "Echo Desktop Wallet")

## Features

- Create, manage, and import accounts.
- Multiple account creation and management.
- Work with account permissions (add a key, remove a key, threshold, weight).
- Send and receive transactions.
- View transaction history.
- Create Smart Contract.
- Call Smart Contract.
- Watch ERC20 tokens.
- Work with different networks.
- View the status of the node.


## Echo Desktop Wallet apps

Electron-based desktop apps for Linux (packaged as `deb`),
MacOS (packaged as `dmg`) and Windows installer are available for download from the
[releases page](https://github.com/echoprotocol/echo-wallet/releases).

## Installation Prerequisites

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 8.x.x or higher is required.

## Install Echo Desktop Wallet from github source

Use the following steps to install the wallet from github source:

Clone the git repository:

```bash
git clone https://github.com/echoprotocol/echo-wallet.git
```

Go into the repository:

```bash
cd echo-wallet
```

Use the package manager [npm](https://www.npmjs.com/) to install dependencies:

```bash
npm install
```

## Starting Development

This starts the process in development mode and starts a webpack dev server:

```bash
npm start
```

This will launch the Echo Desktop Wallet at http://localhost:8080


## Building the wallet for Production as Web Application

If you want builds the wallet for production to the `build` folder run this command:

```bash
npm run build
```

It correctly bundles Echo Desktop Wallet in production mode and optimizes the build for the best performance

## Building the Electron-based desktop app for Linux on Linux

If you want builds the app for Linux to the `build/binaries` folder run this command:

```bash
npm run package-deb
```


## Building the Electron-based desktop app for Windows on Windows

If you want builds the app for Windows to the `build/binaries` folder run this command:

```bash
npm run package-win
```

## Building the Electron-based desktop app for MacOS on MacOS

If you want builds the app for MacOS to the `build/binaries` folder run this command:

```bash
npm run package-mac
```

## Building the Electron-based desktop app for Windows on Linux

If you want builds the app for Windows on Linux to the `build/binaries` you need to install [Wine](https://wiki.winehq.org/Download#binary) (2.0+ is required)

After install the [Wine](https://wiki.winehq.org/Download#binary) run this command:

```bash
npm run package-win
```


## Building the Electron App using [Docker](https://www.docker.com/) for Windows on any platform.

You can use Docker to avoid installing system dependencies. Docker (`electronuserland/builder:wine` with installed [Wine](https://wiki.winehq.org/Download#binary)) is recommended to avoid installing system dependencies. To build app for Windows on any platform run docker container:

```bash
docker run --rm -ti \
 -v ${PWD}:/project \
 electronuserland/builder:wine
```

Type in

```bash
npm run package-win
```

You will find your `.exe` build file in `build/binaries` directory.

## Building the Electron App using [Docker](https://www.docker.com/) for Linux on any platform.

Docker (`electronuserland/builder:10`. `10` is major NodeJS version) is recommended to avoid installing system dependencies.

```bash
docker run --rm -ti -v ${PWD}:/project electronuserland/builder:10
```

Type in

```bash
npm run package-deb
```

You will find your `.deb` build file in `build/binaries` directory.

## Building the Electron-based desktop app for MacOS on another platform

You will need a mac machine to make a `.dmg` build.

## Lint

To [lint](https://eslint.org/) your `*.js` and `*.jsx` files run this command:

```bash
npm run lint
```

## Contributing

Read our [Contributing Guide](https://github.com/echoprotocol/echo-wallet/CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements.

## License

The MIT License (MIT)

Copyright (c) 2019 Echo Technological Solutions LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
