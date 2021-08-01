const { client } = require('../configs/configs')

const findInFile = async (req, res) => {
  try {
    const { filter } = req.query

    const { body } = await client.search({
      index: 'english',
      q: filter
    })

    const data = body.hits.hits.map((file) => {
      return {
        url: `localhost:7000/download/${file["_source"].filename}`
      }
    })

    res.send(data);
  } catch (error) {
    console.trace(error.message)
  }
}

const downloadFile = async (req, res) => {
  try {
    const { urlFile } = req.params
    const url = `${process.cwd()}/src/files/${urlFile}`

    res.download(url);
  } catch (error) {
    console.trace(error.message)
  }
}

module.exports = {
  findInFile,
  downloadFile
}