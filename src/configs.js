const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'http://0.0.0.0:9200/',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

module.exports = {
  client
}