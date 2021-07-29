const fs = require('fs')
const hound = require('hound')
const { client } = require('./configs')

const watcher = hound.watch('files')

watcher.on('create', async function (file, stats) {
  const fileName = file.replace(/\s/g, '');
  const url = `${process.cwd()}/${fileName}`
  const oldUrl = `${process.cwd()}/${file}`

  fs.renameSync(oldUrl, url);

  const contents = fs.readFileSync(url, { encoding: 'base64' });

  client.index({
    index: "english",
    pipeline: "attachment",
    body: {
      "data": contents,
      "filename": fileName
    }
  }).then(() => {
    console.log("Index was successful...");
  },
    (error) => {
      console.error("ERROR in client.index: " + error);
    })

})

