import knex from 'knex'

export default knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'admin',
    password: 'r@nd0m',
    database: 'marchmadness'
  }
})
