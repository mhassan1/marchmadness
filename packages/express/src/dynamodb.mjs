import AWS from 'aws-sdk'

console.log(process.env.AWS_PROFILE)
export const dynamoDBClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
})
