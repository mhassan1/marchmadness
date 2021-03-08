const { dynamoDBClient } = require('../dynamodb')
const { createHash } = require('crypto')

module.exports.validateLogin = async (username, password) => {
  const { Item } = await dynamoDBClient.get({
    TableName: 'madness_users',
    Key: {
      username
    },
    ProjectionExpression: 'username, password'
  }).promise()
  if (Item.password !== createHash('md5').update(password).digest('hex')) {
    throw new Error('Invalid username/password')
  }
  return Item
}

module.exports.getAllSubmitted = async () => {
  const { Items: users } = await dynamoDBClient.scan({
    TableName: 'madness_users',
    ProjectionExpression: 'username',
    FilterExpression: 'submitted = :submitted or username = :admin',
    ExpressionAttributeValues: {
      ':submitted': true,
      ':admin': 'admin'
    }
  }).promise()

  return users
}
