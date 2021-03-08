import { dynamoDBClient, batchPut } from '../dynamodb.mjs'

import knex from '../knex.mjs'

import { bracketMappings, getBracketMappingsWithTeams, getBracketMappingsWithTeamsLookup } from './bracketMappings.mjs'

const MYSQL = false

export const getFillInBracket = async (username) => {
  const bracketMappingsLookup = await getBracketMappingsWithTeamsLookup()
  let rows = Object.values(bracketMappingsLookup) // TODO const
  const { Item: { bracket = [] }} = await dynamoDBClient.get({
    TableName: 'madness_users',
    Key: { username }
  }).promise()

  const bracketObj = Object.fromEntries(bracket.map(({ bracket_id, pick }) => [bracket_id, { pick }]))

  rows.forEach(row => {
    row.pick = bracketObj[row.bracket_id]?.pick
    row.team_name = bracketMappingsLookup[row.pick || row.bracket_id]?.team_name
  })

  if (MYSQL) {
    rows = await knex
      .select('a.bracket_id', 'a.round', 'b.pick', 'a.c', 'a.r', 'a.fixed', 'a.style', 'a.hier', 'c.team_name')
      .from('madness_bracket_mappings as a')
      .leftOuterJoin('madness_brackets as b', function() {
        this
          .on('a.bracket_id', '=', 'b.bracket_id')
          .andOn('b.username', '=', knex.raw('?', [username]))
      })
      .join('madness_bracket_mappings_names as c')
      .whereRaw('ifnull(b.pick, a.bracket_id) = c.bracket_id')

  }

  return Bracket(rows)
}

export const getSetupBracket = async () => {
  const rows = !MYSQL ? await getBracketMappingsWithTeams() :
    await knex
      .select('bracket_id', 'round', 'c', 'r', 'fixed', 'style', 'hier', 'team_name', 'seed', 'team_id')
      .from('madness_bracket_mappings_names')

  return Bracket(rows)
}

export const putSetupBracketOLD = async (body) => {
  const rows = []
  const rowsRound0 = []
  for (const [ k, v] of Object.entries(body)) {
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
          c: knex.raw('c'),
          r: knex.raw('r'),
          hier: `${hier}.1`,
          seed
        },
        {
          bracket_id: 128 + (which - 1) * 2 + 1,
          c: knex.raw('c'),
          r: knex.raw('r'),
          hier: `${hier}.2`,
          seed
        }
      ])
    }
    rows.push({
      bracket_id: bracketId,
      c: knex.raw('c'),
      r: knex.raw('r'),
      team_id: Number(v),
      fixed: isRound0 ? 0 : 1
    })
  }

  if (rows.length) {
    await knex.raw(`
      ${knex('madness_bracket_mappings').insert(rows).toString()}
      ON DUPLICATE KEY UPDATE team_id=VALUES(team_id),fixed=VALUES(fixed)
    `)
  }

  if (rowsRound0.length) {
    await knex.raw(`
      ${knex('madness_bracket_mappings').insert(rowsRound0).toString()}
      ON DUPLICATE KEY UPDATE hier=VALUES(hier),seed=VALUES(seed)
    `)
  }
}

export const putSetupBracketNEW = async (body) => {
  const rows = []
  for (const [k, v] of Object.entries(body)) {
    const bracketId = Number(k.split(',')[0])
    if (bracketId < 1 || bracketId > 135) continue
    const [ , hier, seed ] = k.replace(/_/g, '.').split(',')
    let isRound0 = false
    if (Number(v) < 0) {
      isRound0 = true
      const which = Math.abs(Number(v))
      const bracketId = 128 + (which - 1) * 2
      rows[bracketId] = rows[bracketId] || {}
      Object.assign(rows[bracketId], {
        bracket_id: bracketId,
        hier: `${hier}.1`,
        seed
      })
      rows[bracketId + 1] = rows[bracketId + 1] || {}
      Object.assign(rows[bracketId + 1], {
        bracket_id: bracketId + 1,
        hier: `${hier}.2`,
        seed
      })
    }
    rows[bracketId] = rows[bracketId] || {}
    Object.assign(rows[bracketId], {
      bracket_id: bracketId,
      team_id: Number(v),
      fixed: isRound0 ? 0 : 1
    })
  }

  await batchPut('madness_bracket_mappings', Object.values(rows))
}

export const putSetupBracket = MYSQL ? putSetupBracketOLD : putSetupBracketNEW

export const putFillInBracket = async (username, body) => {
  const rows = []
  for (let s = 1; s <= 131; s++) {
    if (s in body) {
      rows.push({
        bracket_id: s,
        pick: body[s]
      })
    }
  }

  await dynamoDBClient.update({
    TableName: 'madness_users',
    Key: { username },
    UpdateExpression: 'set bracket = :bracket',
    ExpressionAttributeValues: {
      ':bracket': rows
    }
  }).promise()

  // const query = knex('madness_brackets').insert(rows).toString()
  // await knex.raw(query.replace(/^insert/i, 'replace'))
}

// export const getOneBracket = async (username) => {
//   // const rows = await _bracketQueryOne()
//   //   .andWhere('a.username', '=', username)
//   //   .unionAll([
//   //     _bracketQueryTwo()
//   //       .andWhere('a.username', '=', username)
//   //   ])
//
//   return Bracket(rows)
// }

export const getAllBracketsOLD = async () => {
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

export const getAllBracketsRaw = async () => _getAllBracketsRaw(await getBracketMappingsWithTeamsLookup())

const _getAllBracketsRaw = async (bracketMappingsLookup) => {
  // TODO only submitted
  const { Items: users } = await dynamoDBClient.scan({
    TableName: 'madness_users'
  }).promise()

  const { bracket: correctBracket } = users.find(({ username }) => username === 'admin') || {}
  if (!correctBracket) {
    throw new Error('could not find admin picks')
  }

  const correctBracketLookup = Object.fromEntries(correctBracket.map(({ bracket_id, pick }) => [bracket_id, pick]))

  const brackets = {}
  for (const { username, bracket = [] } of users) {
    // compute correct picks
    const format1View = bracket.map(row => {
      if (!row.pick || bracketMappingsLookup[row.bracket_id].fixed !== 0) return
      const correctPick = correctBracketLookup[row.bracket_id]
      const format1 = !correctPick || String(correctPick) === String(row.bracket_id)
        ? 'none or strike'
        : row.pick === correctPick ? 'green' : 'red or strike'

      return {
        ...bracketMappingsLookup[row.bracket_id],
        pick: row.pick,
        mypick: row.pick,
        rightpick: correctPick,
        team_name: bracketMappingsLookup[row.pick]?.team_name,
        format1
      }
    }).filter(Boolean)

    // compute first round where a pick was "red or strike"
    const format2View = format1View.reduce((acc, row) => {
      if (row.format1 === 'red or strike') {
        acc[row.mypick] = Math.min(acc[row.mypick] ?? Infinity, row.round)
      }
      return acc
    }, {})

    // consolidate
    brackets[username] = format1View.map(row => {
      const format3 = (() => {
        if (!row.rightpick) return '{"color":"black"}'
        if (row.format1 === 'green') return '{"color":"green"}'
        if (row.format1 === 'red or strike') {
          return format2View[row.mypick] === row.round ? '{"color":"red"}' : '{"textDecoration":"line-through"}'
        }
        return format2View[row.mypick] ? '{"textDecoration":"line-through"}' : '{"color":"black"}'
      })()
      return {
        ...row,
        format3
      }
    })
  }
  return brackets
}

export const getAllBracketsNEW = async () => {
  const bracketMappingsLookup = await getBracketMappingsWithTeamsLookup()
  const brackets = await _getAllBracketsRaw(bracketMappingsLookup)
  return Object.fromEntries(Object.entries(brackets).map(([username, rows]) => {
    for (const mapping of Object.values(bracketMappingsLookup)) {
      if (mapping.fixed === 0) continue
      rows.push({
        ...mapping,
        format3: '{"color":"black"}'
      })
    }
    return [username, Bracket(rows)]
  }))
}

export const getAllBrackets = MYSQL ? getAllBracketsOLD : getAllBracketsNEW

export const markUserSubmitted = async (username) => {
  // await knex('madness_users').update({
  //   submitted: 1
  // }).where('username', '=', username)
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
