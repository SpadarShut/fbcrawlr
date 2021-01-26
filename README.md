## Setup
- Install [node.js](https://nodejs.org/en/) v14.8 or newer.
  Or run scripts with ``--harmony-top-level-await` node flag
- In repository directory run `npm i`
- Copy `.env.yml.example` to `.env.yml`
- Register a new Facebook account with the new email as it may be blocked by Facebook..
- Add Facebook email and password in `.env.yml`.


## NB
- The script will set English as UI language and make FB not translate posts in any language.
- To scrape closed groups, this account needs to be a member of them.


## Running scraper
- In `.env.yml` under `PAGES` section add URLs to facebook groups or posts to process
- Under `DATES` section set needed post dates
- Run command: `npm run start-server`.

  This will open a new browser which remember your facebook login state.

  This step may be skipped if you are going to run scraping only once.
- Open new console and run: `npm run start-scraping`
- See output JSON data in the `output` directory



## Development
Run `npm run start-dev`

Currently build is only needed if you change browser-globals.js.
