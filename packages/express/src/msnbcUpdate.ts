import { MADNESS_USERS, MADNESS_ODDS } from './constants'

import axios from 'axios'
import { dynamoDBClient } from './dynamodb'
import { getBracketMappingsWithTeams } from './models/bracketMappings'
import { Rows } from 'marchmadness-types'

const gameRegex = /[^>]+id="([^"]+)"[^>]*score="([^"]+)"/

export const msnbcUpdate = async () => {
  await picksUpdate()
  await oddsUpdate()
}

const picksUpdate = async () => {
  console.log('updating picks')

  const bracketMappings = await getBracketMappingsWithTeams()
  const bracketMappingsByTeam = Object.fromEntries(
    bracketMappings.map((mapping) => [mapping.team_id, mapping])
  )
  const bracketMappingsByHier = Object.fromEntries(
    bracketMappings.map((mapping) => [mapping.hier, mapping])
  )

  const {
    Item: { bracket: adminBracket },
  } = (await dynamoDBClient
    .get({
      TableName: MADNESS_USERS,
      Key: { username: 'admin' },
    })
    .promise()) as unknown as { Item: { bracket: Rows } }

  const dates = [
    new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ''),
  ]
  for (const date of dates) {
    const {
      data: { games },
    } = await axios.get(
      `https://scores.nbcsports.com/ticker/data/gamesNEW.js.asp?sport=CBK&period=${date}&random=1458147354771`
    )
    for (const game of games) {
      const match = game.match(
        new RegExp(
          `<visiting-team${gameRegex.source}.*<home-team${gameRegex.source}.*<gamestate status="Final"`
        )
      )
      if (!match) continue
      const [, team1Id, team1Score, team2Id, team2Score] = match

      const team1Hier = bracketMappingsByTeam[team1Id]?.hier
      const team2Hier = bracketMappingsByTeam[team2Id]?.hier

      if (!team1Hier || !team2Hier) continue

      let gameHier
      for (let i = 15; i >= 1; i -= 2) {
        if (team1Hier.slice(0, i) === team2Hier.slice(0, i)) {
          gameHier = team1Hier.slice(0, i)
          break
        }
      }

      if (!gameHier) continue

      const gameBracketId = bracketMappingsByHier[gameHier]?.bracket_id
      const { bracket_id: pick } =
        Number(team1Score) > Number(team2Score)
          ? bracketMappingsByTeam[team1Id]
          : bracketMappingsByTeam[team2Id]

      const adminBracketItemIndex = adminBracket.findIndex(
        ({ bracket_id }) => bracket_id === gameBracketId
      )

      if (adminBracketItemIndex === -1) {
        adminBracket.push({
          bracket_id: gameBracketId,
          pick,
        } as Rows[number])
      } else {
        // TODO why does pick need to be a string?
        adminBracket[adminBracketItemIndex].pick = String(
          pick
        ) as unknown as number
      }
    }
  }

  await dynamoDBClient
    .update({
      TableName: MADNESS_USERS,
      Key: { username: 'admin' },
      UpdateExpression: 'set bracket = :bracket',
      ExpressionAttributeValues: {
        ':bracket': adminBracket,
      },
    })
    .promise()

  return adminBracket
}

const oddsTeamRegex =
  /<a href="\/cbk\/teamstats.asp\?team=(\d+)&.+?"shsNonMobile">(.+?)<[\s\S]+?"shsNumD"[\s\S]+?"shsNumD">(.*?)</
const oddsRegex = new RegExp(
  `"shsNamD shsAwayTeam">${oddsTeamRegex.source}[\\s\\S]+?"shsNamD shsHomeTeam">[\\s]+?at ${oddsTeamRegex.source}`,
  'g'
)

export const oddsUpdate = async () => {
  console.log('updating odds')
  const { data: html } = await axios.get(
    'https://scores.nbcsports.com/cbk/odds.asp'
  )
  const odds = [...html.matchAll(oddsRegex)]
    .filter(([, , , team1_moneyline]) => team1_moneyline)
    .map(
      ([
        ,
        team1_id,
        team1_name,
        team1_moneyline,
        team2_id,
        team2_name,
        team2_moneyline,
      ]) => ({
        team1_id: Number(team1_id),
        team1_name,
        team1_moneyline: Number(team1_moneyline),
        team2_id: Number(team2_id),
        team2_name,
        team2_moneyline: Number(team2_moneyline),
      })
    )

  await dynamoDBClient
    .update({
      TableName: MADNESS_ODDS,
      Key: { source: 'msnbc' },
      UpdateExpression: 'set odds = :odds',
      ExpressionAttributeValues: {
        ':odds': odds,
      },
    })
    .promise()
}
