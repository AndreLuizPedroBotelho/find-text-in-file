const fs = require('fs').promises
const hound = require('hound')
const { client } = require('../configs')
const libre = require('libreoffice-convert');

const watcher = hound.watch('files')

const util = require('util');

let lib_convert = util.promisify(libre.convert)

watcher.on('create', async function (file, stats) {
  const filename = file.replace(/(.docx)|(files\/)|\W/gm, '$1');
  const url = `${process.cwd()}/src/files/${filename}`
  const oldUrl = `${process.cwd()}/${file}`

  await fs.rename(oldUrl, url);

  const contents = await fs.readFile(url, { encoding: 'base64' });

  const fileDoc = await fs.readFile(url)

  const done = await lib_convert(fileDoc, '.html', undefined)

  const newUrl = __dirname + '/../../temp/' + Math.random() + '.html'

  await fs.writeFile(newUrl, done)

  const newfileDoc = await fs.readFile(newUrl)

  const base64 = newfileDoc.toString('base64')

  await fs.unlink(newUrl)

  await client.index({
    index: "english",
    pipeline: "attachment",
    refresh: true,
    body: {
      data: contents,
      filename,
      base64
    }
  })

  console.log("Index was successful...");
})

