import knex from '../knex.mjs'

export const getTeams = async () => {
  /*
  $query = $this -> db -> query("SELECT * from madness_msnbc_teams where team_name!='' order by team_name");

  $a = array();
  foreach ($query->result() as $row) {
    $a[] = (array)$row;
  }
  return $a;
  */
  return knex
    .select('*')
    .from('madness_msnbc_teams')
    .where('team_name', '!=', '')
    .orderBy('team_name')
}
