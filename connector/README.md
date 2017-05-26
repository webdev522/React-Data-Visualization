# :pig: APNIC Stats Connector

## Instructions

Project can be run with or without Docker.

### Without Docker

Requirements for running the project are:

- Node.js
- npm
- lftp
- gunzip
- curl
- (access to) MongoDB
- (optional) sed and xargs

Commands to run the project are:

- `npm install` to install all dependencies
- `npm start` or just `node dist` to run project

Furthermore, multiple other commands are available for development:

- `npm install -d` to install all development dependencies
- `npm run test` to run test suite
- `npm run lint` to lint the code
- `npm run build` to output ES5 code to `dist` directory
- `npm run bump` to upgrade all the dependencies (needs `sed` and `xargs`)
- `npm run backup` to mirror `./.data` folder to `./.backup`
- `npm run restore` to mirror `./.backup` folder to `./.data`
- `npm run dev` to run project in development environment

### With Docker

`TODO`

## Environment Variables

Listed here are environment variables with their defaults.

| Variable | default | required |
|---|---|---|
| `LOG_COLLECTION` | `logs` | no |
| `LOG_LABEL` | `connector` | no |
| `MONGO_HOST` | `localhost` | no |
| `MONGO_PORT` | `27017` | no |
| `MONGO_NAME` | `apnic` | no |
| `MONGO_USER` | `undefined` | no |
| `MONGO_PASS` | `undefined` | no |
| `FTP_SERVER` | `http://ftp.apnic.net` | no |
| `FTP_LOCAL` | `./data/ftp` | no |
| `FTP_REMOTE` | `/public/stats/apnic/` | no |
| `FTP_TIMEZONE` | `Australia/Brisbane` | no |
| `FTP_SYNC_CONCURRENCY` | `20` | no |
| `FTP_GUNZIP_CONCURRENCY` | `10` | no |
| `FTP_CSV_LOCATION` | `./data/csv` | no |
| `FTP_FIRST_DATE` | `20080214` | no |
| `CSV_PARSING_CONCURRENCY` | `10` | no |

## Notes

Reasonable duration of initial ingestion is 3h, depending on hardware
configuration.

