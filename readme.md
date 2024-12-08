# Files Manager

A simple file management API built with Node.js, Express, MongoDB, Redis, and Bull.

## Requirements

### Applications

- Node.js
- Yarn (package manager)

### APIs

- Set up a Google API with email sending permissions. Include a valid redirect URI (e.g., `http://localhost:5000/`) and place the `credentials.json` file in the root directory.

### Environment Variables

Create a `.env` file to store the required environment variables, each on a new line in the format `NAME=VALUE`. Below are the variables used by the server:

| Name               | Required | Description                                                                                  |
|--------------------|----------|----------------------------------------------------------------------------------------------|
| GOOGLE_MAIL_SENDER | Yes      | Email address used to send emails to users.                                                  |
| PORT               | No       | Server listening port (Default: `5000`).                                                     |
| DB_HOST            | No       | Database host (Default: `localhost`).                                                        |
| DB_PORT            | No       | Database port (Default: `27017`).                                                            |
| DB_DATABASE        | No       | Database name (Default: `files_manager`).                                                    |
| FOLDER_PATH        | No       | Local folder for storing files (Default: `/tmp/files_manager` on Unix or `%TEMP%/files_manager` on Windows). |

## Installation

- Clone the repository and navigate to its directory.
- Install dependencies using `yarn install` or `npm install`.

## Usage

- Ensure Redis and MongoDB services are running.
- Start the server with `yarn start-server` or `npm run start-server`.

## Tests

- Create a `.env.test` file with environment variables specific for testing.
- Run tests using `yarn test` or `npm run test`.


