const { Client } = require('@elastic/elasticsearch')
const axios = require('axios');
const urlBase = 'http://elasticsearch:9200'

const client = new Client({
  node: urlBase,
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const checkAndCreateIndice = function (index) {
  client.indices.exists({
    index
  }, async (err, res, status) => {

    if (!res.body) {
      client.indices.create({
        index
      }, async (err, res, status) => {
        if (err) {
          return console.log(err)
        }

        await axios.put(`${urlBase}/_ingest/pipeline/attachment`, {
          "description": "new pipeline",
          "processors": [
            {
              "attachment": {
                "field": "data"
              }
            }
          ]
        });

        console.log('Index create with success');
      })


    }
  })
};

module.exports = {
  client,
  checkAndCreateIndice
}