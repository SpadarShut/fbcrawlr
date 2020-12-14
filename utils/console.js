import readline from 'readline'

export async function getConsoleInput(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question(question + ' ', (answer) => {
      resolve(answer)
      rl.close()
    })
  })
}
