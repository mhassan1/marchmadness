import { Rows, Odds } from 'marchmadness-types'
import MultiSort from 'multi-sort'
import { getAllBracketsRaw } from './bracket'
import { dynamoDBClient } from '../dynamodb'
import { MADNESS_ODDS } from '../constants'

export const getStandings = async () => {
  const { allBrackets, bracketMappings } = await getAllBracketsRaw()
  const standings = _getStandings(allBrackets)
  const winFrequency = _getWinFrequency(
    allBrackets,
    bracketMappings,
    await getOdds(),
  )
  if (!winFrequency) return standings

  for (const v of standings) {
    v.winFrequency = winFrequency[v.username] || 0
  }

  return MultiSort(standings, {
    admin: 'ASC',
    winFrequency: 'DESC',
    potential: 'DESC',
    points: 'DESC',
    username: 'ASC',
  })
}

const _getStandings = (allBrackets: Record<string, Rows>) => {
  const standings = Object.entries(allBrackets).map(([username, rows]) => {
    let points = 0
    let potential = 0
    for (const row of rows) {
      if (row.format3 === '{"color":"green"}') {
        points += 10 * 2 ** (row.round + 1)
      }
      if (
        ['{"color":"green"}', '{"color":"black"}'].includes(
          row.format3 as string,
        )
      ) {
        potential += 10 * 2 ** (row.round + 1)
      }
    }
    const { team_name: finalpick, format3: finalpickformat3 } =
      rows.find(({ bracket_id }) => bracket_id === 127) || {}
    return {
      admin: username === 'admin' ? 0 : 1,
      username,
      points,
      potential,
      finalpick,
      finalpickformat3,
    }
  })

  return MultiSort(standings, {
    admin: 'ASC',
    potential: 'DESC',
    points: 'DESC',
    username: 'ASC',
  })
}

const nbit = (number: number, N: number) => (number >> (N - 1)) & 1
const score = (
  allPicks: Record<string, Rows>,
  username: string,
  sim: (number | undefined)[],
) => {
  const bracket = allPicks[username]
  let score = 0
  for (let i = 0; i < bracket.length; i++) {
    if (bracket[i].mypick === sim[i]) {
      score += 40 * 2 ** (bracket[i].round - 1)
    }
  }
  return score
}

const _getWinFrequency = (
  allPicks: Record<string, Rows>,
  bracketMappings: Record<number, Rows[number]>,
  odds: Record<string, number>,
) => {
  const adminPicks = allPicks.admin
  const usernames = Object.keys(allPicks)
  const winCounts: Record<string, number> = {}
  const hierLookup: Record<string, number | undefined> = {}
  for (const v of adminPicks) {
    hierLookup[v.hier] = v.mypick
  }

  const remainingGamesCount = adminPicks.filter((p) => !p.team_name).length
  if (remainingGamesCount > 7) {
    // not at Elite 8 yet, too many games left
    return
  }
  const simCount = 2 ** remainingGamesCount
  for (let i = 0; i < simCount; i++) {
    const hiers: Record<string, number | undefined> = {}
    const sim = []
    let simWeight = 1
    let k = 0
    for (const v of adminPicks) {
      if (v.team_name) {
        sim.push(v.rightpick)
        continue
      }
      const j = nbit(i, k + 1) + 1
      const _hier = `${v.hier}.${j}`
      const pick = _hier in hiers ? hiers[_hier] : hierLookup[_hier]
      sim.push(pick)
      hiers[v.hier] = pick
      k++

      const _otherHier = `${v.hier}.${3 - j}`
      const otherPick =
        _otherHier in hiers ? hiers[_otherHier] : hierLookup[_otherHier]
      const team1_id = bracketMappings[pick as number]?.team_id
      const team2_id = bracketMappings[otherPick as number]?.team_id
      let weight
      if (odds[`${team1_id}_${team2_id}`]) {
        weight = odds[`${team1_id}_${team2_id}`]
      } else if (odds[`${team2_id}_${team1_id}`]) {
        weight = 1 - odds[`${team2_id}_${team1_id}`]
      } else {
        weight = 0.5
      }

      simWeight *= weight
    }

    const scores: Record<string, number> = {}
    for (const username of usernames) {
      if (username === 'admin') continue
      scores[username] = score(allPicks, username, sim)
    }
    const maxScore = Math.max(...Object.values(scores))
    const winners = Object.entries(scores)
      .filter(([, s]) => s === maxScore)
      .map(([u]) => u)
    for (const username of winners) {
      winCounts[username] =
        (username in winCounts ? winCounts[username] : 0) +
        (simCount * simWeight) / winners.length
    }
  }

  const winFrequency: Record<string, number> = {}
  for (const username of usernames) {
    winFrequency[username] = username in winCounts ? winCounts[username] : 0
    winFrequency[username] =
      Math.round((winFrequency[username] / simCount) * 1e4) / 1e2
  }
  return winFrequency
}

const getOdds = async () => {
  const { Item: { odds = [] } = {} } = (await dynamoDBClient.get({
    TableName: MADNESS_ODDS,
    Key: { source: 'msnbc' },
  })) as unknown as { Item: undefined | { odds: Odds } }

  return Object.fromEntries(
    odds.map(({ team1_id, team1_moneyline, team2_id, team2_moneyline }) => {
      const team1_prob = moneylineToProb(team1_moneyline)
      const team2_prob = moneylineToProb(team2_moneyline)
      return [`${team1_id}_${team2_id}`, team1_prob / (team1_prob + team2_prob)]
    }),
  )
}

const moneylineToProb = (moneyline: number) =>
  moneyline < 0 ? -moneyline / (-moneyline + 100) : 100 / (moneyline + 100)
