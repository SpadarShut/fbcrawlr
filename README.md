## Setup
- Install [node.js](https://nodejs.org/en/) v14.8 or newer.
  Or run scripts with --harmony-top-level-await node flag
- run `npm i`
- Copy `.env.yml.example` to `.env.yml`
- Create a new throwaway email account for scraping, as it may be blocked by Facebook.
- Register new Facebook account with the new email.
- Add Facebook email and password in `.env.yml`.


## NB
- The script will set English as UI language and make FB not translate posts in any language.
- To scrape closed groups, this account needs to be a member of them.


## Running scraper
- Add URLs to facebook groups or posts to process under PAGES section in `.env.yml`
- Run command:
  npm run start-scraping
- See output JSON data in the `output` directory


## Development
Run `npm run start-dev`

Currently build is only needed if you change browser-globals.js.
