const { Client } = require('@elastic/elasticsearch')

const client = new Client({
  node: 'http://0.0.0.0:9200/',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const checkAndCreateIndice = function (index) {
  client.indices.exists({
    index
  }, (err, res, status) => {
    if (!res.body) {
      client.indices.create({
        index
      }, (err, res, status) => {
        console.log(err, res, status);
      })
    }
  })
};

module.exports = {
  client,
  checkAndCreateIndice
}