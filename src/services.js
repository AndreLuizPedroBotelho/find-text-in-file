const { client } = require('./configs')

const findInFile = async (req, res) => {
  try {
    const { filter } = req.query

    const response = await client.search({
      index: 'english',
      q: filter
    })

    const data = response.hits.hits.map((file) => {
      return {
        url: `localhost:3000/${file["_source"].filename}`
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
    const url = `${process.cwd()}/${urlFile}`

    res.download(url);
  } catch (error) {
    console.trace(error.message)
  }
}

module.exports = {
  findInFile,
  downloadFile
}