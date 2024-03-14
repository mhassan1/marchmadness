import { MADNESS_USERS } from '../constants'

import { dynamoDBClient } from '../dynamodb'
import { createHash } from 'crypto'
import { User } from 'marchmadness-types'

export const validateLogin = async (
  username: string,
  password: string,
): Promise<User> => {
  const { Item } = (await dynamoDBClient.get({
    TableName: MADNESS_USERS,
    Key: {
      username: username.toLowerCase(),
    },
    ProjectionExpression: 'username, password, submitted',
  })) as unknown as { Item?: User }
  if (Item?.password !== createHash('sha256').update(password).digest('hex')) {
    throw new Error('Invalid username/password')
  }
  return Item
}

export const getAllSubmitted = async () => {
  const { Items: users } = await dynamoDBClient.scan({
    TableName: MADNESS_USERS,
    ProjectionExpression: 'username',
    FilterExpression: 'submitted = :submitted or username = :admin',
    ExpressionAttributeValues: {
      ':submitted': true,
      ':admin': 'admin',
    },
  })

  return users
}
