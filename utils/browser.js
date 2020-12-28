/* eslint-env browser */

export {
  $,
  $$,
  Log,
}

globalThis.$ = $
globalThis.$$ = $$
globalThis.Log = Log


function Log(contextFnName = '') {
  return (...args) => {
    const label = contextFnName ? contextFnName + ': ' : ''
    globalThis.console.log(label, ...args)
  }
}

function $(selector, startNode) {
  return window.document.querySelector(selector, startNode)
}

function $$(selector, startNode) {
  return Array.from(window.document.querySelectorAll(selector, startNode))
}
