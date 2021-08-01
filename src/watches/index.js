const fs = require('fs')
const hound = require('hound')
const { client } = require('../configs/configs')

const watcher = hound.watch('files')

watcher.on('create', async function (file, stats) {
  const filename = file.replace(/(.docx)|(files\/)|\W/gm, '$1');
  const url = `${process.cwd()}/src/files/${filename}`
  const oldUrl = `${process.cwd()}/${file}`

  fs.copyFileSync(oldUrl, url);
  fs.unlinkSync(oldUrl);

  const contents = fs.readFileSync(url, { encoding: 'base64' });

  await client.index({
    index: "english",
    pipeline: "attachment",
    refresh: true,
    body: {
      data: contents,
      filename
    }
  })

  console.log("Index was successful...");
})

