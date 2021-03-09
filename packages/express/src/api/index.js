const express = require('express')
const {
  getFillInBracket,
  putFillInBracket,
  getSetupBracket,
  putSetupBracket,
  markUserSubmitted,
  getAllBrackets,
} = require('../models/bracket')
const { teams } = require('../models/team')
const { validateLogin, getAllSubmitted } = require('../models/user')
const { getStandings } = require('../models/standings')
const { msnbcUpdate } = require('../msnbcUpdate')

const router = new express.Router()

router.get('/echo', (req, res) => res.send('echo'))

router.post('/login', async (req, res, next) => {
  try {
    req.session.user = await validateLogin(req.body.username, req.body.password)
    res.json(req.session.user)
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (req, res, next) => {
  delete req.session.user
  res.status(204).json({})
})

router.get('/me', (req, res, next) => {
  res.json(req.session.user)
})

router.use((req, res, next) => {
  if (req.session.user) return next()
  throw new Error('missing session')
})

router.get('/bracket', async (req, res, next) => {
  try {
    if (req.session.user.submitted) {
      throw new Error('invalid request once submitted')
    }
    res.json({ bracket: await getFillInBracket(req.session.user.username) })
  } catch (err) {
    next(err)
  }
})

router.put('/bracket', async (req, res, next) => {
  try {
    if (req.session.user.submitted) {
      throw new Error('already submitted')
    }
    await putFillInBracket(req.session.user.username, req.body)
    if (req.body.submit) {
      await markUserSubmitted(req.session.user.username)
      req.session.user.submitted = true
    }
    res.status(204).json({})
  } catch (err) {
    next(err)
  }
})

router.get('/dashboard', async (req, res, next) => {
  try {
    res.json({
      brackets: await getAllBrackets(),
      users: await getAllSubmitted(),
      standings: await getStandings(),
    })
  } catch (err) {
    next(err)
  }
})

router.use((req, res, next) => {
  if (req.session.user.username !== 'admin')
    return next(new Error('admin only'))
  next()
})

router.get('/setup', async (req, res, next) => {
  try {
    res.json({
      bracket: await getSetupBracket(),
      teams,
    })
  } catch (err) {
    next(err)
  }
})

router.post('/setup', async (req, res, next) => {
  try {
    await putSetupBracket(req.body)
    res.status(204).json({})
  } catch (err) {
    next(err)
  }
})

router.get('/msnbcUpdate', async (req, res, next) => {
  try {
    res.json(await msnbcUpdate())
  } catch (err) {
    next(err)
  }
})

module.exports = router
