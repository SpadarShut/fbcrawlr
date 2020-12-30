/* eslint-env browser */

import { Log } from './log'
import { SELECTORS } from '../fb/selectors'

let __ = {
  Log,
  SELECTORS,
  $: function (selector, startNode) {
    return window.document.querySelector(selector, startNode)
  },
  $$: function (selector, startNode) {
    return Array.from(window.document.querySelectorAll(selector, startNode))
  }
}

window.__ = __
