const { dynamoDBClient } = require('../packages/express/src/dynamodb')
const { createHash } = require('crypto')

const [, , username, password] = process.argv
if (!username || !password) {
  throw new Error('missing username or password')
}

;(async () => {
  console.log(`Putting user ${username}...`)
  await dynamoDBClient
    .update({
      TableName: 'madness_users',
      Key: { username: username.toLowerCase() },
      UpdateExpression: 'set password = :password',
      ExpressionAttributeValues: {
        ':password': createHash('sha256').update(password).digest('hex'),
      },
    })
    .promise()
})()
