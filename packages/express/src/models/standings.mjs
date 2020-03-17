
import knex from '../knex.mjs'

export const getStandings = async () => {
  /*
  if(!isset($winFrequency)) return;

  foreach($standings as $v){
    if ($v->username == 'admin') $v->winFrequency = 0;
    else $v->winFrequency = $winFrequency[$v->username];
  }
  $sorts = ['admin'=>[],'winFrequency'=>[],'points'=>[],'potential'=>[],'username'=>[]];
  foreach ($standings as $v) {
    $sorts['admin'][] = $v->username == 'admin';
    $sorts['winFrequency'][] = $v->winFrequency;
    $sorts['points'][] = $v->points;
    $sorts['potential'][] = $v->potential;
    $sorts['username'][] = $v->username;
  }
  array_multisort($sorts['admin'], SORT_ASC, $sorts['winFrequency'], SORT_DESC,
    $sorts['points'], SORT_DESC, $sorts['potential'], SORT_DESC, $sorts['username'], SORT_ASC, $standings);
  */

  const standings = await _getStandings()
  const winFrequency = await _getWinFrequency()
  if (!winFrequency) return standings

  for (const v of standings) {
    v.winFrequency = v.username === 'admin' ? 0 : winFrequency[v.username]
  }
  const sorts = {
    admin: [],
    winFrequency: [],
    points: [],
    potential: [],
    username: []
  }
  for (const v of standings) {
    sorts.admin.push(v.username === 'admin')
    sorts.winFrequency.push(v.winFrequency)
    sorts.points.push(v.points)
    sorts.potential.push(v.potential)
    sorts.username.push(v.username)
  }

  // TODO multisort

  return standings
}

const _getStandings = async () => {
  /*
  $query = $this -> db -> query('select a.username,'
    .'sum(if(a.format3=\'{"color":"green"}\',10*pow(2,a.round+1),0)) points,'
    .'sum(if(a.format3 in (\'{"color":"green"}\',\'{"color":"black"}\'),10*pow(2,a.round+1),0)) potential,'
    .'max(if(a.bracket_id=127,a.team_name,null)) finalpick, '
    .'max(if(a.bracket_id=127,a.format3,null)) finalpickformat3 '
    .'from madness_format3_view a, '
    .'madness_users b '
    .'where a.username=b.username '
    .'and b.active_in=1 and (b.submitted=1 or b.username=\'admin\') '
    .'group by b.username '
    .'order by if(b.username=\'admin\',1,0) asc, points desc, potential desc, username asc');
  $a = $query->result();
  return $a;
  */
  return knex
    .select(
      'a.username',
      knex.raw('sum(if(a.format3=\'{"color":"green"}\',10*pow(2,a.round+1),0)) points'),
      knex.raw('sum(if(a.format3 in (\'{"color":"green"}\',\'{"color":"black"}\'),10*pow(2,a.round+1),0)) potential'),
      knex.raw('max(if(a.bracket_id=127,a.team_name,null)) finalpick'),
      knex.raw('max(if(a.bracket_id=127,a.format3,null)) finalpickformat3')
    )
    .from('madness_format3_view as a')
    .innerJoin('madness_users as b', 'a.username', '=', 'b.username')
    .where('b.active_in', '=', 1)
    .andWhere(function () {
      this.where('b.submitted', '=', 1).orWhere('b.username', '=', 'admin')
    })
    .groupBy('b.username')
    .orderByRaw('if(b.username=\'admin\',1,0) asc, points desc, potential desc, username asc')
}

const nbit = (number, N) => (number >> (N-1)) & 1
const score = (allPicks, username, sim) => {
  const bracket =allPicks.filter(p => p.username === username)
  let score = 0
  for (let i = 0; i < bracket.length; i++) {
    if (bracket[i].mypick === sim[i]) {
      score += 40 * 2 ** bracket[i].round - 1
    }
  }
  return score
}

const _getWinFrequency = async () => {
  /*
  function nbit($number, $n){return ($number >> $n-1) & 1;}
  function score($allPicks, $username, $sim){
    $bracket = array_values(array_filter($allPicks, function($v) use($username){return $v->username == $username;}));
    $score = 0;
    for($i = 0; $i < count($bracket); $i++){
      if($bracket[$i]->mypick == $sim[$i]){
        $score += 40 * pow(2, $bracket[$i]->round - 1);
      }
    }
    return $score;
  }

  $query = $this -> db -> query('select * from madness_format3_view order by username, round, bracket_id');
  $allPicks = $query->result();
  $adminPicks = array_filter($allPicks, function ($v) { return $v->username == 'admin'; });
  $usernames = array_unique(array_map(function ($v) { return $v->username; }, $allPicks));
  $winCounts = [];
  $hierLookup = [];
  foreach($adminPicks as $v){
    $hierLookup[$v->hier] = $v->mypick;
  }

  $remainingGamesCount = count(array_filter($adminPicks, function ($v) { return !$v->fixed; }));
  if($remainingGamesCount > 7){ // not at Elite 8 yet, too many games left
    return;
  }
  $simCount = pow(2, $remainingGamesCount);

  for($i = 0; $i < $simCount; $i++){
    $hiers = [];
    $sim = [];
    $k = 0;
    foreach($adminPicks as $v){
      if($v->fixed){
        $sim[] = $v->rightpick;
        continue;
      }
      $j = nbit($i, $k + 1) + 1;
      $pick = isset($hiers[$v->hier.'.'.$j])?$hiers[$v->hier.'.'.$j]:$hierLookup[$v->hier.'.'.$j];
      $sim[] = $pick;
      $hiers[$v->hier] = $pick;
      $k++;
    }
    $scores = [];
    foreach($usernames as $username){
      if ($username == 'admin') continue;
      $scores[$username] = score($allPicks, $username, $sim);
    }
    if (count($scores) > 0) {
      $winners = array_keys($scores, max($scores));
    } else {
      $winners = [];
    }
    foreach($winners as $username){
      $winCounts[$username] = (isset($winCounts[$username])?$winCounts[$username]:0) + (1 / count($winners));
    }
  }
  $winFrequency = [];
  foreach($usernames as $username){
    $winFrequency[$username] = isset($winCounts[$username])?$winCounts[$username]:0;
    $winFrequency[$username] = round($winFrequency[$username] / $simCount * 100, 2);
  }
  return $winFrequency;
  */

  const allPicks = await knex
    .select('*')
    .from('madness_format3_view')
    .orderBy(['username', 'round', 'bracket_id'])

  const adminPicks = allPicks.filter(p => p.username === 'admin')
  const usernames = [...new Set(allPicks.map(p => p.username))]
  const winCounts = {}
  const hierLookup = {}
  for (const v of adminPicks) {
    hierLookup[v.hier] = v.mypick
  }

  const remainingGamesCount = adminPicks.filter(p => !p.fixed).length
  if (remainingGamesCount > 7) { // not at Elite 8 yet, too many games left
    return
  }
  const simCount = 2 ** remainingGamesCount
  for (let i = 0; i < simCount; i++) {
    const hiers = {}
    const sim = []
    let k = 0
    for (const v of adminPicks) {
      if (v.fixed) {
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
    const scores = {}
    for (const username of usernames) {
      if (username == 'admin') continue
      scores[username] = score(allPicks, username, sim)
    }
    const maxScore = Math.max(...Object.entries(scores))
    const winners = scores.length ? Object.entries(scores).filter(([u, s]) => s === maxScore).map(([u]) => u) : []
    for (const username of winners) {
      winCounts[username] = (username in winCounts ? winCounts[username] : 0) + (1 / winners.length)
    }
  }

  const winFrequency = {}
  for (const username of usernames) {
    winFrequency[username] = username in winCounts ? winCounts[username] : 0
    winFrequency[username] = Math.round(winFrequency[username] / simCount * 1e4) / 1e2
  }
  return winFrequency;
}
