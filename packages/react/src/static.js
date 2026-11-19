/* eslint-disable @typescript-eslint/no-require-imports */

const express = require('express')
const path = require('path')

const app = express()
app.use('/static', express.static(path.join(__dirname, '../build')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
module.exports = app
