import { dynamoDBClient } from '../dynamodb.mjs'
// import knex from '../knex.mjs'
import { createHash } from 'crypto'

export const validateLogin = async (username, password) => {
  const { Item } = await dynamoDBClient.get({
    TableName: 'madness_users',
    Key: {
      username
    },
    AttributesToGet: ['username', 'password']
  }).promise()
  if (Item.password !== createHash('md5').update(password).digest('hex')) {
    throw new Error('Invalid username/password')
  }
  return Item
}

export const getAllSubmitted = async () => {
  // const users = await knex
  //   .select('username')
  //   .from('madness_users')
  //   .where('username', '!=', 'admin')
  //   .andWhere('submitted', '=', 1)
  //   .andWhere('active_in', '=', 1)
  // return users.concat({ username: 'admin' })

  // TODO submitted only
  const { Items: users } = await dynamoDBClient.scan({
    TableName: 'madness_users',
    AttributesToGet: ['username']
  }).promise()

  return users
}
