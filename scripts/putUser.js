const { dynamoDBClient } = require('../packages/express/src/dynamodb')
const { createHash } = require('crypto')

const [,, username, password] = process.argv
if (!username || !password) {
  throw new Error('missing username or password')
}

;(async () => {
  await dynamoDBClient.update({
    TableName: 'madness_users',
    Key: { username },
    UpdateExpression: 'set password = :password',
    ExpressionAttributeValues: {
      ':password': createHash('md5').update(password).digest('hex')
    }
  }).promise()
})()
