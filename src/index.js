require('dotenv').config()

const express = require('express')
const path = require('path')

const routes = require('./routes')
const handlebars = require('express-handlebars');
const fileUpload = require('express-fileupload');

const { checkAndCreateIndice } = require('./configs')

require('./watches')

const app = express()
const port = process.env.PORT
console.log(__dirname + '/../public')
app.use(express.static(__dirname + '/../public'));

app.engine('hbs', handlebars({
  extname: 'hbs',
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(fileUpload());

checkAndCreateIndice('english')

app.use('/', routes)

app.listen(port, () => console.log(`Project listening on port ${port}!`))