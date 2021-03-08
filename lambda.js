const serverlessExpress = require('@vendia/serverless-express')
const app = require('./packages/express/src/app')
const frontend = require('./packages/react/src/static')

app.use(frontend)
exports.handler = serverlessExpress({ app })
