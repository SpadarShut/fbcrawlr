export function Log(contextFnName = '') {
  const fn = (...args) => {
    const label = contextFnName ? contextFnName + ':' : ''
    globalThis.console.log(label, ...args)
    return fn
  }
  return fn
}
