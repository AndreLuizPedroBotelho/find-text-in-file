const { client } = require('../configs')

const findInFile = async (req, res) => {
  try {
    const { filter } = req.query

    const { body } = await client.search({
      index: 'english',
      default_operator: 'AND',
      q: filter
    })

    const data = body.hits.hits.map((file) => {
      return {
        nameFile: file["_source"].filename,
        data: file["_source"].data
      }
    })

    res.send(data);
  } catch (error) {
    console.trace(error.message)
  }
}


const uploadFile = async (req, res) => {
  try {

    const { name } = req.files.file;

    const uploadPath = __dirname + '/../../files/' + name;
    req.files.file.mv(uploadPath, function (err) { });

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
  uploadView,
  searchView,
  uploadFile
}