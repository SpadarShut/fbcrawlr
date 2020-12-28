/* eslint-env browser */
import { parseHumanDate } from './fb/dates'
import { Log } from './utils/log'

let __ = {
  Log,
  parseHumanDate,
  $: function (selector, startNode) {
    return window.document.querySelector(selector, startNode)
  },
  $$: function $$(selector, startNode) {
    return Array.from(window.document.querySelectorAll(selector, startNode))
  }
}

window.__ = __
