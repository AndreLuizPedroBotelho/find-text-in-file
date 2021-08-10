const fs = require('fs').promises
const hound = require('hound')
const { client } = require('../configs')
const libre = require('libreoffice-convert');

const watcher = hound.watch('files')
const util = require('util');

let lib_convert = util.promisify(libre.convert)

watcher.on('create', async function (file, stats) {
  const filename = file.replace(/(.docx)|(files\/)/gm, '');

  const oldUrl = `${process.cwd()}/${file}`;

  const fileDoc = await fs.readFile(oldUrl)

  const done = await lib_convert(fileDoc, '.html', undefined)

  const newUrl = `${__dirname}/../../temp/${Math.random()}.html`;

  await fs.writeFile(newUrl, done)

  const newfileDoc = await fs.readFile(newUrl)
  const contents = newfileDoc.toString('base64')

  await client.index({
    index: "english",
    pipeline: "attachment",
    refresh: true,
    body: {
      base64: contents,
      filename
    }
  })

  await fs.unlink(oldUrl)
  await fs.unlink(newUrl)

  console.log("Index was successful...");

})

