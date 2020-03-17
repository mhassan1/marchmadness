
import knex from '../knex.mjs'
import { createHash } from 'crypto'

export const validateLogin = async (username, password) => {
  const rows = await knex
    .select('username', 'submitted')
    .from('madness_users')
    .where('username', '=', username)
    .andWhere('password', '=', createHash('md5').update(password).digest('hex'))
  if (!rows.length) throw new Error('Invalid username/password')
  return rows[0]
}

export const getAllSubmitted = async () => {
  const users = await knex
    .select('username')
    .from('madness_users')
    .where('username', '!=', 'admin')
    .andWhere('submitted', '=', 1)
    .andWhere('active_in', '=', 1)
  return users.concat({ username: 'admin' })
}
