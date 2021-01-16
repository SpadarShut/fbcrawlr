import fs from 'fs/promises'

export {
  saveJson,
  makeValidFilename
}

function saveJson({filename, data}) {
  let posts = ''
  try {
    posts = JSON.stringify(data, null, 2)
  }
  catch (e){
    console.error('Error stringifying data', e)
    return
  }

  return fs.writeFile(
    filename,
    posts
  )
}

function makeValidFilename(filename = 'file', options = {}) {
  const {
    replacer = '_',
    replaceSpaces = true
  } = options

  let res = String(filename)
  res = res.replace(/[/\\?%*:|"<>\s]/g, replacer)

  if (replaceSpaces || replaceSpaces === '') {
    res = res.replace(
      /\s/g,
      typeof replaceSpaces === 'string' ? replaceSpaces : replacer
    )
  }
  res = res.replace(new RegExp(replacer + '+', 'g'), replacer)

  return res
}
