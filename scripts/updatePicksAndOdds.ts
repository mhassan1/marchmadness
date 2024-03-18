import { updatePicksAndOdds } from '../packages/express/src/updatePicksAndOdds'

const run = async () => {
  await updatePicksAndOdds()
}

run()
