import { MADNESS_USERS, MADNESS_ODDS } from './constants'

import axios from 'axios'
import { dynamoDBClient } from './dynamodb'
import { getBracketMappingsWithTeams } from './models/bracketMappings'
import { Rows } from 'marchmadness-types'

// https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b

export const updatePicksAndOdds = async () => {
  await picksUpdate()
  await oddsUpdate()
}

const picksUpdate = async () => {
  console.log('updating picks')

  const bracketMappings = await getBracketMappingsWithTeams()
  const bracketMappingsByTeam = Object.fromEntries(
    bracketMappings.map((mapping) => [mapping.team_id, mapping]),
  )
  const bracketMappingsByHier = Object.fromEntries(
    bracketMappings.map((mapping) => [mapping.hier, mapping]),
  )

  const {
    Item: { bracket: adminBracket },
  } = (await dynamoDBClient.get({
    TableName: MADNESS_USERS,
    Key: { username: 'admin' },
  })) as unknown as { Item: { bracket: Rows } }

  const dates = [
    new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ''),
  ]
  for (const date of dates) {
    const {
      data: { events },
    } = await axios.get(
      `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&dates=${date}`,
    )
    for (const event of events) {
      if (event.status.type.completed !== true) continue
      const team1 = event.competitions[0].competitors[0]
      const team2 = event.competitions[0].competitors[1]
      const team1Id = Number(team1.id)
      const team1Score = Number(team1.score)
      const team2Id = Number(team2.id)
      const team2Score = Number(team2.score)

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
        ({ bracket_id }) => bracket_id === gameBracketId,
      )

      if (adminBracketItemIndex === -1) {
        adminBracket.push({
          bracket_id: gameBracketId,
          pick,
        } as Rows[number])
      } else {
        // TODO why does pick need to be a string?
        adminBracket[adminBracketItemIndex].pick = String(
          pick,
        ) as unknown as number
      }
    }
  }

  await dynamoDBClient.update({
    TableName: MADNESS_USERS,
    Key: { username: 'admin' },
    UpdateExpression: 'set bracket = :bracket',
    ExpressionAttributeValues: {
      ':bracket': adminBracket,
    },
  })

  return adminBracket
}

export const oddsUpdate = async () => {
  console.log('updating odds')

  const {
    data: {
      sports: [
        {
          leagues: [{ events }],
        },
      ],
    },
  } = await axios.get(
    `https://site.api.espn.com/apis/v2/scoreboard/header?sport=basketball&league=mens-college-basketball&region=us&lang=en&contentorigin=espn&buyWindow=1m&showAirings=buy%2Clive%2Creplay&showZipLookup=true&tz=America%2FNew_York`,
  )

  const odds = []
  for (const event of events) {
    const team1 = event.odds.homeTeamOdds
    const team2 = event.odds.awayTeamOdds
    odds.push({
      team1_id: Number(team1.team.id),
      team1_name: team1.team.abbreviation,
      team1_moneyline: team1.moneyLine,
      team2_id: Number(team2.team.id),
      team2_name: team2.team.abbreviation,
      team2_moneyline: team2.moneyLine,
    })
  }

  await dynamoDBClient.update({
    TableName: MADNESS_ODDS,
    Key: { source: 'espn' },
    UpdateExpression: 'set odds = :odds',
    ExpressionAttributeValues: {
      ':odds': odds,
    },
  })
}
