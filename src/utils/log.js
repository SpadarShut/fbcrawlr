export function Log(contextFnName = '') {
  return (...args) => {
    const label = contextFnName ? contextFnName + ':' : ''
    globalThis.console.log(label, ...args)
  }
}
