const express = require('express')
const app = express()
app.use('/static', express.static('assets'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html')
})
app.listen(3000)
