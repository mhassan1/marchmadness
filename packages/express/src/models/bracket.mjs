import { dynamoDBClient } from '../dynamodb.mjs'

import knex from '../knex.mjs'

import { bracketMappings, getBracketMappingsWithTeams } from './bracketMappings.mjs'

export const getFillInBracket = async (username) => {


  const rows = await knex
    .select('a.bracket_id', 'a.round', 'b.pick', 'a.c', 'a.r', 'a.fixed', 'a.style', 'a.hier', 'c.team_name')
    .from('madness_bracket_mappings as a')
    .leftOuterJoin('madness_brackets as b', function() {
      this
        .on('a.bracket_id', '=', 'b.bracket_id')
        .andOn('b.username', '=', knex.raw('?', [username]))
    })
    .join('madness_bracket_mappings_names as c')
    .whereRaw('ifnull(b.pick, a.bracket_id) = c.bracket_id')

  return Bracket(rows)
}

export const getSetupBracket = async () => {
  const rows = await getBracketMappingsWithTeams()
  return Bracket(rows)
}

export const putSetupBracket = async (body) => {
  const rows = []
  const rowsRound0 = []
  for (const [k, v] of Object.entries(body)) {
    const bracketId = Number(k.split(',')[0])
    if (bracketId < 1 || bracketId > 135) continue
    const [ , hier, seed ] = k.replace(/_/g, '.').split(',')
    let isRound0 = false
    if (Number(v) < 0) {
      isRound0 = true
      const which = Math.abs(Number(v))
      rowsRound0.push(...[
        {
          bracket_id: 128 + (which - 1) * 2,
          hier: `${hier}.1`,
          seed
        },
        {
          bracket_id: 128 + (which - 1) * 2 + 1,
          hier: `${hier}.2`,
          seed
        }
      ])
    }
    rows.push({
      bracket_id: bracketId,
      team_id: Number(v),
      fixed: isRound0 ? 0 : 1
    })
  }

  const allRows = rows.concat(rowsRound0)

  for (let batch = 0; batch < allRows.length / 25; batch++) {
    await dynamoDBClient.batchWrite({
      RequestItems: {
        'madness_bracket_mappings': rows
          .slice(batch * 25, (batch + 1) * 25)
          .map(row => ({
            PutRequest: { Item: row }
          }))
      }
    }).promise()
  }
}

export const putFillInBracket = async (username, body) => {
  const rows = []
  for (let s = 1; s <= 131; s++) {
    if (s in body) {
      rows.push({
        username,
        bracket_id: s,
        pick: body[s]
      })
    }
  }

  const query = knex('madness_brackets').insert(rows).toString()
  await knex.raw(query.replace(/^insert/i, 'replace'))
}

export const getOneBracket = async (username) => {
  const rows = await _bracketQueryOne()
    .andWhere('a.username', '=', username)
    .unionAll([
      _bracketQueryTwo()
        .andWhere('a.username', '=', username)
    ])

  return Bracket(rows)
}

export const getAllBrackets = async () => {
  const users = await knex
    .select('username')
    .from('madness_users')
    .where(function() {
      this.where('submitted', '=', 1).andWhere('active_in', '=', 1)
    })
    .orWhere('username', '=', 'admin')

  const allRows = await _bracketQueryOne()
    .unionAll([
      _bracketQueryTwo()
    ])

  const brackets = {}
  for (const { username } of users) {
    brackets[username] = Bracket()
  }
  for (const row of allRows) {
    const { username, c, r } = row
    brackets[username][c][r] = row
  }

  return brackets
}

export const markUserSubmitted = async (username) => {
  await knex('madness_users').update({
    submitted: 1
  }).where('username', '=', username)
}

const _bracketQueryOne = () => knex
  .select('a.username', 'b.bracket_id', 'b.c', 'b.r', 'c.team_name', 'a.format3', 'b.style', 'b.round', 'b.fixed')
  .from('madness_format3_view as a')
  .innerJoin('madness_bracket_mappings as b', 'a.bracket_id', '=', 'b.bracket_id')
  .innerJoin('madness_bracket_mappings_names as c', 'a.mypick', '=', 'c.bracket_id')
  .where('b.fixed', '=', 0)

const _bracketQueryTwo = () => knex
  .select('a.username', 'b.bracket_id', 'b.c', 'b.r', 'b.team_name', knex.raw('\'{"color":"black"}\''), 'b.style', 'b.round', 'b.fixed')
  .from('madness_users as a')
  .innerJoin('madness_bracket_mappings_names as b')
  .where(function() {
    this.where('b.fixed', '=', 1).orWhere(knex.raw('b.fixed is null'))
  })

const Bracket = (rows = []) => {
  const bracket = []
  for (let i = 1; i <= 11; i++) {
    bracket[i] = []
    for (let j = 1; j <= 66; j++) {
      bracket[i][j] = {
        bracket_id: 0,
        style: '',
        hier: '',
        seed: '',
        pick: '',
        team_name: '',
        team_id: '',
        round: '',
        fixed: '',
        format3: ''
      }
    }
  }
  for (const row of rows) {
    const { c, r } = row
    Object.assign(bracket[c][r], row)
  }
  return bracket
}
