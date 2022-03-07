import AWS from 'aws-sdk'
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb'

export const dynamoDBClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
})

const BATCH_SIZE = 25
export const batchPut = async (tableName: string, items: unknown[]) => {
  const promises = []
  for (let batch = 0; batch < items.length / BATCH_SIZE; batch++) {
    promises.push(
      dynamoDBClient
        .batchWrite({
          RequestItems: {
            [tableName]: items
              .slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE)
              .map((row) => ({
                PutRequest: { Item: row },
              })) as PutItemInputAttributeMap[],
          },
        })
        .promise()
    )
  }
  return Promise.all(promises)
}
