/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const serverlessExpress = require('@vendia/serverless-express')
const { app } = require('./packages/express/build/app')
const frontend = require('./packages/react/src/static')
const { msnbcUpdate } = require('./packages/express/build/msnbcUpdate')

app.use(frontend)
const server = serverlessExpress({ app })

exports.handler = async (event, context) => {
  if (event.source === 'aws.events') {
    return msnbcUpdate()
  }
  return server(event, context)
}
