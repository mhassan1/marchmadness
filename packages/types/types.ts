export type User = {
  username: string
  password: string
  submitted: boolean
}

export type Bracket = Array<Rows>

export type Rows = Array<{
  r?: number
  c?: number
  bracket_id: number
  style: string
  hier: string
  seed: string
  pick?: number
  team_name?: string
  team_id?: number
  round: number
  fixed?: number | ''
  label?: string
  format1?: string
  format3?: string
  mypick?: number
  rightpick?: number
  teams?: Rows
  additionalStyle?: unknown
}>

export type Standings = Array<{
  username: string
  points: number
  potential: number
  winFrequency: number
  finalpick: string
  finalpickformat3: string
}>
