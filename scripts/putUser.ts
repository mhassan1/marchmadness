import { dynamoDBClient } from '../packages/express/src/dynamodb'
import { MADNESS_USERS } from '../packages/express/src/constants'
import { createHash } from 'crypto'

const [, , username, password] = process.argv
if (!username || !password) {
  throw new Error('missing username or password')
}

const run = async () => {
  console.log(`Putting user ${username}...`)
  await dynamoDBClient
    .update({
      TableName: MADNESS_USERS,
      Key: { username: username.toLowerCase() },
      UpdateExpression: 'set password = :password',
      ExpressionAttributeValues: {
        ':password': createHash('sha256').update(password).digest('hex'),
      },
    })
    .promise()
}

run()
