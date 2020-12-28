import fs from 'fs/promises'

export const saveJson = ({filename, data}) => {
  let posts = ''
  try {
    posts = JSON.stringify(data, null, 2)
  }
  catch (e){
    console.log('Couldnt stringify data', e)
    return
  }

  return fs.writeFile(
    filename,
    posts
  )
}

