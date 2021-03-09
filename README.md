March Madness
=============

"March Madness" allows users to submit and follow their March Madness brackets, and correct picks are automatically updated every 15 minutes.

## Technology

Express, React, Lambda, DynamoDB

## Installation

`yarn`

## Deployment

1. Set up an AWS profile in `~/.aws/credentials` called `marchmadness`
2. Run `yarn sls deploy`

## Updating Picks

Picks are automatically updated every 15 minutes by a CloudWatch Event.

## Development

1. Do an initial `yarn sls deploy` so that DynamoDB tables are created
2. Create an `admin` user with `yarn putUser admin <secret>` (choose any password)
3. Create a `.env` file from the `.env.example` file
4. Express: `yarn workspace marchmadness-express start`
5. React: `yarn workspace marchmadness-react start`
6. Navigate to `http://localhost:3000` in a browser. You should see the login screen.
7. Log in as the `admin` user with the chosen password
8. Go to "Setup" at the top and set up bracket after Selection Sunday and before inviting users
9. Add/update teams as needed to `packages/express/src/models/team.js`
   Other teams can be found here (click on a team to see the `team_id` in the URL): https://scores.nbcsports.com/cbk/teams.asp
10. Add users with `yarn putUser <username> <password>`
