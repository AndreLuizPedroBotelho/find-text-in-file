require('dotenv').config()

const express = require('express')
const routes = require('./routes')

const { checkAndCreateIndice } = require('./configs/configs')

require('./watches')

const app = express()
const port = process.env.PORT

checkAndCreateIndice('english')

app.use('/', routes)

app.listen(port, () => console.log(`Project listening on port ${port}!`))