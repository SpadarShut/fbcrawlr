import fs from 'fs'

export const saveJson = ({filename, data}) => {
  let posts = ''
  try {
    posts = JSON.stringify(data)
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

