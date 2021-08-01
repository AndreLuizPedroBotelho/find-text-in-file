const { client } = require('../configs')

const findInFile = async (req, res) => {
  try {
    const { filter } = req.query

    const { body } = await client.search({
      index: 'english',
      q: filter
    })

    const data = body.hits.hits.map((file) => {
      return {
        url: `${process.env.BASE_URL}/api/download/${file["_source"].filename}`
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

const uploadFile = async (req, res) => {
  try {

    const { name } = req.files.file;

    const uploadpath = __dirname + '/../../files/' + name;

    req.files.file.mv(uploadpath, function (err) { });

    res.json({ success: true })
  } catch (error) {
    console.trace(error.message)
  }
}

const uploadView = async (req, res) => {
  try {
    res.render('upload', { layout: false });
  } catch (error) {
    console.trace(error.message)
  }
}

const searchView = async (req, res) => {
  try {
    res.render('search', { layout: false });
  } catch (error) {
    console.trace(error.message)
  }
}

module.exports = {
  findInFile,
  downloadFile,
  uploadView,
  searchView,
  uploadFile
}