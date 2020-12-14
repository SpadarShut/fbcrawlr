export const sleep = async (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, ms)
  })
}
