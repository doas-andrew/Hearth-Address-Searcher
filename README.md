# Hearth-Address-Searcher

## Requirements
You will need:
- node, version 12.0+ recommended
- postgres, version 9.6+ required
- npm

## How to run this project

Backend:
- `git clone` this project (via HTTPS)
- `cd` into the "backend" directory
- make sure postgres is running
- if needed, set credentials in `database/config.js` (password wasn't required when I ran this on localhost)
- run `npm install`
- run `node database/create.js` to create the database
- run `node database/migrate.js` to insert data into the database
- run `node server.js`
- backend api should now be running on localhost:3000

Frontend:
- open another terminal split/tab/window
- `cd` into the "frontend" directory
- run `npm install`
- run `npm start`
- frontend should now be running on localhost:3001
