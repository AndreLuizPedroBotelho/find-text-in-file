const { client } = require('../configs')
const libre = require('libreoffice-convert');
const fs = require('fs').promises;
const util = require('util');

let lib_convert = util.promisify(libre.convert)

const findInFile = async (req, res) => {
  try {
    const { filter } = req.query

    const { body } = await client.search({
      index: 'english',
      q: filter
    })

    let data = []
    for (const file of body.hits.hits) {

      const newData = {}
      newData.nameFile = file["_source"].filename
      newData.base64 = file["_source"].base64


      data.push(newData)
    }
    res.send(data);
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
  uploadView,
  searchView,
  uploadFile
}