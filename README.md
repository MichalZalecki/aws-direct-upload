# AWS Direct Upload

## Installation

```
cp .env-example .env
yarn
```

## Usage

Start **express** (serving files in production).

```bash
npm start
```

Start **express with webpack-dev-middleware** (in development).

```bash
npm run start:dev
```

Start **express with webpack-dev-middleware and webpack-dashboard** (for SWAG).

```bash
npm run start:dashboard
```

Build (also run in `postinstall`). Make sure you are creating React bundle in `production`
environment.

```bash
NODE_ENV=production npm run build
```

You can specify `PORT` for both: development and production server (default to `8080`).

```
PORT=5000 npm start
PORT=8081 npm run start:dev
```
