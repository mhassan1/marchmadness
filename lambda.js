const serverlessExpress = require('@vendia/serverless-express')
const app = require('./packages/express/src/app')
const frontend = require('./packages/react/src/static')
const { msnbcUpdate } = require('./packages/express/src/msnbcUpdate')

app.use(frontend)
const server = serverlessExpress({ app })

exports.handler = async (event, context) => {
  if (event.source === 'aws.events') {
    return msnbcUpdate()
  }
  return server(event, context)
}
