/*
 This file is used to inject globals on webpages,
 so it needs to be bundled before use.
 If you change this file, make sure to rebuild it using
`npm run bundle-browser-globals`
*/

/* eslint-env browser */

import { parseHumanDate } from '../fb/dates'
import { Log } from './log'

let __ = {
  Log,
  parseHumanDate,
  $: function (selector, startNode) {
    return window.document.querySelector(selector, startNode)
  },
  $$: function (selector, startNode) {
    return Array.from(window.document.querySelectorAll(selector, startNode))
  }
}

window.__ = __
