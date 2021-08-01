const { Client } = require('@elastic/elasticsearch')
const axios = require('axios');

const client = new Client({
  node: process.env.URL_ELASTICSEARCH,
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const checkAndCreateIndice = function (index) {
  client.indices.exists({
    index
  }, async (err, res, status) => {

    if (!res.body) {
      await client.indices.create({
        index
      })

      await axios.put(`${process.env.URL_ELASTICSEARCH}/_ingest/pipeline/attachment`, {
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
    }
  })
};

module.exports = {
  client,
  checkAndCreateIndice
}