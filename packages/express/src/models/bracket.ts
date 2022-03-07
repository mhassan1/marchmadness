import { Bracket, Rows, User } from 'marchmadness-types'
import { MADNESS_USERS, MADNESS_BRACKET_MAPPINGS } from '../constants'
import { dynamoDBClient, batchPut } from '../dynamodb'
import {
  getBracketMappingsWithTeams,
  getBracketMappingsWithTeamsLookup,
} from './bracketMappings'

export const getFillInBracket = async (username: string) => {
  const bracketMappingsLookup = await getBracketMappingsWithTeamsLookup()
  const rows = Object.values(bracketMappingsLookup)
  const {
    Item: { bracket = [] },
  } = (await dynamoDBClient
    .get({
      TableName: MADNESS_USERS,
      Key: { username },
    })
    .promise()) as unknown as { Item: { bracket: Bracket[number] } }

  const bracketObj = Object.fromEntries(
    bracket.map(({ bracket_id, pick }) => [bracket_id, { pick }])
  )

  rows.forEach((row) => {
    row.pick = bracketObj[row.bracket_id]?.pick
    row.team_name = bracketMappingsLookup[row.pick || row.bracket_id]?.team_name
  })

  return makeBracket(rows)
}

export const getSetupBracket = async () => {
  const rows = await getBracketMappingsWithTeams()
  return makeBracket(rows)
}

export const putSetupBracket = async (body: number[]) => {
  const rows: Record<number, Rows[number]> = []
  for (const [k, v] of Object.entries(body)) {
    const bracketId = Number(k.split(',')[0])
    if (bracketId < 1 || bracketId > 135) continue
    const [, hier, seed] = k.replace(/_/g, '.').split(',')
    let isRound0 = false
    if (Number(v) < 0) {
      isRound0 = true
      const which = Math.abs(Number(v))
      const bracketId = 128 + (which - 1) * 2
      rows[bracketId] = rows[bracketId] || {}
      Object.assign(rows[bracketId], {
        bracket_id: bracketId,
        hier: `${hier}.1`,
        seed,
      })
      rows[bracketId + 1] = rows[bracketId + 1] || {}
      Object.assign(rows[bracketId + 1], {
        bracket_id: bracketId + 1,
        hier: `${hier}.2`,
        seed,
      })
    }
    rows[bracketId] = rows[bracketId] || {}
    Object.assign(rows[bracketId], {
      bracket_id: bracketId,
      team_id: Number(v),
      fixed: isRound0 ? 0 : 1,
    })
  }

  await batchPut(MADNESS_BRACKET_MAPPINGS, Object.values(rows))
}

export const putFillInBracket = async (username: string, body: number[]) => {
  const rows = []
  for (let s = 1; s <= 131; s++) {
    if (s in body) {
      rows.push({
        bracket_id: s,
        pick: body[s],
      })
    }
  }

  await dynamoDBClient
    .update({
      TableName: MADNESS_USERS,
      Key: { username },
      UpdateExpression: 'set bracket = :bracket',
      ExpressionAttributeValues: {
        ':bracket': rows,
      },
    })
    .promise()
}

export const getAllBracketsRaw = async () =>
  _getAllBracketsRaw(await getBracketMappingsWithTeamsLookup())

const _getAllBracketsRaw = async (
  bracketMappingsLookup: Record<number, Rows[number]>
) => {
  const { Items: users } = (await dynamoDBClient
    .scan({
      TableName: MADNESS_USERS,
      FilterExpression: 'submitted = :submitted or username = :admin',
      ExpressionAttributeValues: {
        ':submitted': true,
        ':admin': 'admin',
      },
    })
    .promise()) as unknown as { Items: (User & { bracket: Rows })[] }

  const { bracket: correctBracket } =
    users.find(({ username }) => username === 'admin') || {}
  if (!correctBracket) {
    throw new Error('could not find admin picks')
  }

  const correctBracketLookup = Object.fromEntries(
    correctBracket.map(({ bracket_id, pick }) => [bracket_id, pick])
  )

  const brackets: Record<string, Rows> = {}
  for (const { username, bracket = [] } of users) {
    // compute correct picks
    const format1View = bracket
      .map((row) => {
        if (!row.pick || bracketMappingsLookup[row.bracket_id].fixed !== 0)
          return
        const correctPick = correctBracketLookup[row.bracket_id]
        const format1 =
          !correctPick || String(correctPick) === String(row.bracket_id)
            ? 'none or strike'
            : row.pick === correctPick
            ? 'green'
            : 'red or strike'

        return {
          ...bracketMappingsLookup[row.bracket_id],
          pick: row.pick,
          mypick: row.pick,
          rightpick: correctPick,
          team_name: bracketMappingsLookup[Number(row.pick)]?.team_name,
          format1,
        }
      })
      .filter(Boolean) as Rows

    // compute first round where a pick was "red or strike"
    const format2View = format1View.reduce((acc, row) => {
      if (row.format1 === 'red or strike') {
        acc[row.mypick as number] = Math.min(
          acc[row.mypick as number] ?? Infinity,
          row.round
        )
      }
      return acc
    }, {} as Record<number, number>)

    // consolidate
    brackets[username] = format1View.map((row) => {
      const format3 = (() => {
        if (!row.rightpick) return '{"color":"black"}'
        if (row.format1 === 'green') return '{"color":"green"}'
        if (row.format1 === 'red or strike') {
          return format2View[row.mypick as number] === row.round
            ? '{"color":"red"}'
            : '{"textDecoration":"line-through"}'
        }
        return format2View[row.mypick as number]
          ? '{"textDecoration":"line-through"}'
          : '{"color":"black"}'
      })()
      return {
        ...row,
        format3,
      }
    })
  }
  return brackets
}

export const getAllBrackets = async () => {
  const bracketMappingsLookup = await getBracketMappingsWithTeamsLookup()
  const brackets = await _getAllBracketsRaw(bracketMappingsLookup)
  return Object.fromEntries(
    Object.entries(brackets).map(([username, rows]) => {
      for (const mapping of Object.values(bracketMappingsLookup)) {
        if (mapping.fixed === 0) continue
        rows.push({
          ...mapping,
          format3: '{"color":"black"}',
        })
      }
      return [username, makeBracket(rows)]
    })
  )
}

export const markUserSubmitted = async (username: string) => {
  await dynamoDBClient
    .update({
      TableName: MADNESS_USERS,
      Key: { username },
      UpdateExpression: 'set submitted = :submitted',
      ExpressionAttributeValues: {
        ':submitted': true,
      },
    })
    .promise()
}

const makeBracket = (rows: Rows = []): Bracket => {
  const bracket: Bracket = []
  for (let i = 1; i <= 11; i++) {
    bracket[i] = []
    for (let j = 1; j <= 66; j++) {
      bracket[i][j] = {
        bracket_id: 0,
        style: '',
        hier: '',
        seed: '',
        pick: 0,
        team_name: '',
        team_id: 0,
        round: 0,
        fixed: '',
        format3: '',
      }
    }
  }
  for (const row of rows) {
    const { c, r } = row
    Object.assign(bracket[c as number][r as number], row)
  }
  return bracket
}
