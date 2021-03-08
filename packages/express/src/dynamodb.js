const AWS = require('aws-sdk')

const dynamoDBClient = module.exports.dynamoDBClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})

const BATCH_SIZE = 25
module.exports.batchPut = async (tableName, items) => {
  const promises = []
  for (let batch = 0; batch < items.length / BATCH_SIZE; batch++) {
    promises.push(dynamoDBClient.batchWrite({
      RequestItems: {
        [tableName]: items
          .slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE)
          .map(row => ({
            PutRequest: { Item: row }
          }))
      }
    }).promise())
  }
  return Promise.all(promises)
}
