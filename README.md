## Setup
- Install node.js https://nodejs.org/en/
- run `npm i`
- Copy `.env.yml.example` to `.env.yml`
- Add your facebook email and password to `.env.yml`.
  Better create a new account for scraping as it may be blocked by facebook.
  Also, the script will set English as UI language and make FB not translate posts in any language.

  To scrape closed groups, this account needs to be a member of them.

## Running scraper
- Add URLs to process under PAGES section in `.env.yml`
- Run `npm start`

## Development
Run `npm run start-dev`

Build is only needed if you change browser-globals.js.
