const fs = require('fs')
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

  fs.renameSync(oldUrl, url);

  const contents = fs.readFileSync(url, { encoding: 'base64' });
  const fileDoc = fs.readFileSync(url)

  const done = await lib_convert(fileDoc, '.pdf', undefined)

  const newUrl = __dirname + '/../../temp/' + Math.random() + '.pdf'

  fs.writeFileSync(newUrl, done)

  const newfileDoc = fs.readFileSync(newUrl)

  const base64 = newfileDoc.toString('base64')

  fs.unlinkSync(newUrl)

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

