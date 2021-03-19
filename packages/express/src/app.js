const express = require('express')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const connectSessionDynamoDb = require('connect-dynamodb')
const api = require('./api')

const DynamoDbSessionStore = connectSessionDynamoDb({ session })
const store = new DynamoDbSessionStore({
  table: 'madness_sessions',
})
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  cors({
    origin: 'http://localhost:3000', // TODO this is needed for local development only
    credentials: true,
  })
)
app.use(
  session({
    secret: 'thisIsAVerySecretSecret',
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    },
  })
)
app.use('/api', api)

module.exports = app
