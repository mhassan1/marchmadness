import { Rows } from 'marchmadness-types'
import MultiSort from 'multi-sort'
import { getAllBracketsRaw } from './bracket'

export const getStandings = async () => {
  const allBrackets = await getAllBracketsRaw()
  const standings = _getStandings(allBrackets)
  const winFrequency = _getWinFrequency(allBrackets)
  if (!winFrequency) return standings

  for (const v of standings) {
    v.winFrequency = winFrequency[v.username] || 0
  }

  return MultiSort(standings, {
    admin: 'ASC',
    winFrequency: 'DESC',
    points: 'DESC',
    potential: 'DESC',
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
          row.format3 as string
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
    points: 'DESC',
    potential: 'DESC',
    username: 'ASC',
  })
}

const nbit = (number: number, N: number) => (number >> (N - 1)) & 1
const score = (
  allPicks: Record<string, Rows>,
  username: string,
  sim: (number | undefined)[]
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

const _getWinFrequency = (allPicks: Record<string, Rows>) => {
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
        (username in winCounts ? winCounts[username] : 0) + 1 / winners.length
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
