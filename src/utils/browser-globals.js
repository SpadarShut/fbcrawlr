/* eslint-env browser */

import { Log } from './log'
import { SELECTORS } from '../fb/selectors'

let __ = {
  Log,
  SELECTORS,
  $: function (selector, startNode) {
    return (startNode || document).querySelector(selector)
  },
  $$: function (selector, startNode) {
    return Array.from(
      (startNode || document).querySelectorAll(selector)
    )
  }
}

window.__ = __
