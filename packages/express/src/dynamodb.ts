import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

export const dynamoDBClient = DynamoDBDocument.from(new DynamoDBClient())

const BATCH_SIZE = 25
export const batchPut = async (tableName: string, items: unknown[]) => {
  const promises = []
  for (let batch = 0; batch < items.length / BATCH_SIZE; batch++) {
    promises.push(
      dynamoDBClient.batchWrite({
        RequestItems: {
          [tableName]: items
            .slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE)
            .map((row) => ({
              PutRequest: { Item: row as object },
            })),
        },
      }),
    )
  }
  return Promise.all(promises)
}
