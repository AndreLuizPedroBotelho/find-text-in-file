const express = require('express')
const routes = require('./routes')
const { checkAndCreateIndice } = require('./configs/configs')

require('./watches')

const app = express()
const port = 7000

checkAndCreateIndice('english')

app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))