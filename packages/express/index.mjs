import express from 'express'
import cors from 'cors'
import session from 'express-session'
import bodyParser from 'body-parser'
import connectSessionKnex from 'connect-session-knex'
import api from './src/api/index.mjs'
import knex from './src/knex.mjs'

const KnexSessionStore = connectSessionKnex(session)
const store = new KnexSessionStore({ knex })
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:3000', // TODO
  credentials: true
}))
app.use(session({
  secret: 'thisIsAVerySecretSecret',
  resave: false,
  saveUninitialized: true,
  store,
  cookie: {
    maxAge: 60 * 24 * 60 * 60 * 1000 // 60 days
  }
}))
app.use('/api', api)

app.listen(3001)
