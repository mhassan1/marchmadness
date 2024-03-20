import { Router } from 'express'
import { User } from 'marchmadness-types'
import assert from 'assert'
import {
  getFillInBracket,
  putFillInBracket,
  getSetupBracket,
  putSetupBracket,
  markUserSaved,
  markUserSubmitted,
  getAllBrackets,
} from '../models/bracket'
import { teams } from '../models/team'
import { validateLogin, getAllSubmitted } from '../models/user'
import { getStandings } from '../models/standings'
import { updatePicksAndOdds } from '../updatePicksAndOdds'

declare module 'express-session' {
  interface SessionData {
    user: User
  }
}

const router = Router()

router.get('/echo', (req, res) => res.send('echo'))

router.post('/login', async (req, res, next) => {
  try {
    req.session.user = await validateLogin(req.body.username, req.body.password)
    res.json(req.session.user)
  } catch (err) {
    next(err)
  }
})

router.post(
  '/logout',
  (req, res, next) => {
    req.session ? req.session.destroy(next) : next()
  },
  (req, res) => res.status(204).json({}),
)

router.get('/me', (req, res) => {
  res.json(req.session.user)
})

router.use((req, res, next) => {
  if (req.session.user) return next()
  throw new Error('missing session')
})

router.get('/bracket', async (req, res, next) => {
  try {
    assert(req.session.user)
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
    assert(req.session.user)
    if (req.session.user.submitted) {
      throw new Error('already submitted')
    }
    await putFillInBracket(req.session.user.username, req.body)
    if (!req.body.submit) {
      await markUserSaved(req.session.user.username)
      req.session.user.saved = true
    } else {
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
  assert(req.session.user)
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
    await putFillInBracket(
      'admin',
      Array(132)
        .fill(undefined)
        .map((_, i) => i),
    )
    res.status(204).json({})
  } catch (err) {
    next(err)
  }
})

router.get('/updatePicksAndOdds', async (req, res, next) => {
  try {
    res.json(await updatePicksAndOdds())
  } catch (err) {
    next(err)
  }
})

export default router
