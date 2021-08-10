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

      await client.indices.putMapping({
        index,
        body: {
          properties: {
            filename: {
              type: 'text'
            },
            attachment: {
              "type": "object",
              "properties": {
                "content": {
                  "type": "text",
                  "analyzer": "brazilian",
                  "copy_to": "texto"
                }
              }
            }
          }
        }
      })

      await axios.put(`${process.env.URL_ELASTICSEARCH}/_ingest/pipeline/attachment`, {
        "description": "new pipeline",
        "processors": [
          {
            "attachment": {
              "field": "base64"
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