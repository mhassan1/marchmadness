import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import connectSessionDynamoDb from 'connect-dynamodb'
import api from './api'
import { MADNESS_SESSIONS } from './constants'

const DynamoDbSessionStore = connectSessionDynamoDb(session)
const store = new DynamoDbSessionStore({
  table: MADNESS_SESSIONS,
})
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  cors({
    origin: 'http://localhost:3000', // TODO this is needed for local development only
    credentials: true,
  }),
)
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    },
  }),
)
app.use('/api', api)

export { app }
