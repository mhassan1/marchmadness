
import knex from '../knex.mjs'

export const getFillInBracket = async (username) => {
  /*
  $query = $this -> db -> query('SELECT a.bracket_id,a.round,b.pick,a.c,a.r,a.fixed,a.style,a.hier,c.team_name '
    .'FROM madness_bracket_mappings a '
    .'left outer join '
    .'madness_brackets b on a.bracket_id=b.bracket_id and b.username="'.$this->session->userdata('username').'", '
    .'madness_bracket_mappings_names c '
    .'where (ifnull(b.pick,a.bracket_id)=c.bracket_id)');

  $a = array(array());
  for ($i=1;$i<=11;$i++) {
    for ($j=1;$j<=66;$j++) {
      $a[$i][$j]=array("bracket_id"=>0,"style"=>"","hier"=>"","pick"=>"","team_name"=>"","round"=>"","fixed"=>"");
    }
  }

  foreach ($query->result() as $row) {
    $a[$row->c][$row->r]["bracket_id"]=$row->bracket_id;
    $a[$row->c][$row->r]["style"]=$row->style;
    $a[$row->c][$row->r]["hier"]=$row->hier;
    $a[$row->c][$row->r]["pick"]=$row->pick;
    $a[$row->c][$row->r]["team_name"]=$row->team_name;
    $a[$row->c][$row->r]["round"]=$row->round;
    $a[$row->c][$row->r]["fixed"]=$row->fixed;
  }
  return $a;
  */
  const rows = await knex
    .select('a.bracket_id', 'a.round', 'b.pick', 'a.c', 'a.r', 'a.fixed', 'a.style', 'a.hier', 'c.team_name')
    .from('madness_bracket_mappings as a')
    .leftOuterJoin('madness_brackets as b', function() {
      this.on('a.bracket_id', '=', 'b.bracket_id').andOn('b.username', '=', knex.raw('?', [username]))
    })
    .join('madness_bracket_mappings_names as c')
    .whereRaw('ifnull(b.pick, a.bracket_id) = c.bracket_id')

  return Bracket(rows)
}

export const getSetupBracket = async () => {
  /*
  SELECT a.bracket_id,a.round,a.c,a.r,a.fixed,a.style,a.hier,a.team_name,a.seed,a.team_id '
    .'FROM madness_bracket_mappings_names a
  */
  const rows = await knex
    .select('bracket_id', 'round', 'c', 'r', 'fixed', 'style', 'hier', 'team_name', 'seed', 'team_id')
    .from('madness_bracket_mappings_names')

  return Bracket(rows)
}

export const putSetupBracket = async (body) => {
  /*
  $first=1;
  $first2=1;
  $updatequery = 'insert into madness_bracket_mappings (bracket_id,team_id,fixed) values ';
  $updatequery2 = 'insert into madness_bracket_mappings (bracket_id,hier,seed) values ';
  foreach ($_POST as $k=>$v) {
    $bid = explode(',', $k)[0];
    if ((int)$bid >= 1 && (int)$bid <= 135) {
      $hier = str_replace('_','.',explode(',', $k)[1]);
      $seed = str_replace('_','.',explode(',', $k)[2]);
      $isRound0 = false;
      if ($v<0) {
        $isRound0 = true;
        if (!$first2) {$updatequery2.=',';} else {$first2=0;}
        $which = (int)explode('-', $v)[1];
        $updatequery2.='('.(128+($which-1)*2).',\''.$hier.'.1'.'\',\''.$seed.'\'),'.
          '('.(128+($which-1)*2+1).',\''.$hier.'.2'.'\',\''.$seed.'\')';
      }
      if (!$first) {$updatequery.=',';} else {$first=0;}
      $updatequery.='('.$bid.',\''.$v.'\','.($isRound0?0:1).')';
    }
  }
  $updatequery.='ON DUPLICATE KEY UPDATE team_id=VALUES(team_id),fixed=VALUES(fixed)';
  $updatequery2.='ON DUPLICATE KEY UPDATE hier=VALUES(hier),seed=VALUES(seed)';
  if(!$first) {$this -> db -> query($updatequery);}
  if(!$first2) {$this -> db -> query($updatequery2);}
  */
  const rows = []
  const rowsRound0 = []
  for (const [ k, v] of Object.entries(body)) {
    const bracketId = Number(k.split(',')[0])
    if (bracketId < 1 || bracketId > 135) continue
    const [ , hier, seed ] = k.replace(/_/g, '.').split(',')
    let isRound0 = false
    if (Number(v) < 0) {
      isRound0 = true
      const which = Math.abs(Number(v))
      rowsRound0.push(...[
        {
          bracket_id: 128 + (which - 1) * 2,
          c: knex.raw('c'),
          r: knex.raw('r'),
          hier: `${hier}.1`,
          seed
        },
        {
          bracket_id: 128 + (which - 1) * 2 + 1,
          c: knex.raw('c'),
          r: knex.raw('r'),
          hier: `${hier}.2`,
          seed
        }
      ])
    }
    rows.push({
      bracket_id: bracketId,
      c: knex.raw('c'),
      r: knex.raw('r'),
      team_id: Number(v),
      fixed: isRound0 ? 0 : 1
    })
  }

  if (rows.length) {
    await knex.raw(`
      ${knex('madness_bracket_mappings').insert(rows).toString()}
      ON DUPLICATE KEY UPDATE team_id=VALUES(team_id),fixed=VALUES(fixed)
    `)
  }

  if (rowsRound0.length) {
    await knex.raw(`
      ${knex('madness_bracket_mappings').insert(rowsRound0).toString()}
      ON DUPLICATE KEY UPDATE hier=VALUES(hier),seed=VALUES(seed)
    `)
  }
}

export const putFillInBracket = async (username, body) => {
  /*
  $first=1;
  $replacequery = 'replace into madness_brackets (username,bracket_id,pick) values ';
  for ($s = 1; $s<=131; $s++) {
    if (isset($_POST[$s])) {
      if (!$first) {$replacequery.=',';} else {$first=0;}
      $replacequery.='("'.$this->session->userdata('username').'",'.$s.','.$_POST[$s].')';
    }
  }
  $this -> db -> query($replacequery);
  if (isset($_POST['submit'])) {
    $this -> db -> query('update madness_users set submitted=1 where username="'.$this->session->userdata('username').'"');
  }
  */
  const rows = []
  for (let s = 1; s <= 131; s++) {
    if (s in body) {
      rows.push({
        username,
        bracket_id: s,
        pick: body[s]
      })
    }
  }

  const query = knex('madness_brackets').insert(rows).toString()
  await knex.raw(query.replace(/^insert/i, 'replace'))
}

export const getOneBracket = async (username) => {
  /*
  select a.username,b.bracket_id,b.c,b.r,c.team_name,a.format3,b.style,b.round,b.fixed from madness_format3_view a, '
    .'madness_bracket_mappings b, '
    .'madness_bracket_mappings_names c '
    .'where a.mypick=c.bracket_id and '
    .'a.bracket_id=b.bracket_id '
    .'and b.fixed=0 '
    .'and a.username=\''.$this->session->userdata('username').'\' '
    .'union all '
    .'select a.username,b.bracket_id,b.c,b.r,b.team_name,\'{"color":"black"}\',b.style,b.round,b.fixed '
    .'from madness_users a,madness_bracket_mappings_names b where (b.fixed=1 or b.fixed is null) '
    .'and a.username=\''.$this->session->userdata('username').'\'
  */
  const rows = await _bracketQueryOne()
    .andWhere('a.username', '=', username)
    .unionAll([
      _bracketQueryTwo()
        .andWhere('a.username', '=', username)
    ])

  return Bracket(rows)
}

export const getAllBrackets = async () => {
  /*
  $user_query = 'select username from madness_users where (submitted=1 and active_in=1) or username=\'admin\'';
  $bracket_query = 'select a.username,b.bracket_id,b.c,b.r,c.team_name,a.format3,b.style,b.round,b.fixed from madness_format3_view a, '
    .'madness_bracket_mappings b, '
    .'madness_bracket_mappings_names c '
    .'where a.mypick=c.bracket_id and '
    .'a.bracket_id=b.bracket_id '
    .'and b.fixed=0 '
    .'union all '
    .'select a.username,b.bracket_id,b.c,b.r,b.team_name,\'{"color":"black"}\',b.style,b.round,b.fixed '
    .'from madness_users a,madness_bracket_mappings_names b where b.fixed=1 or b.fixed is null';
  */
  const users = await knex
    .select('username')
    .from('madness_users')
    .where(function() {
      this.where('submitted', '=', 1).andWhere('active_in', '=', 1)
    })
    .orWhere('username', '=', 'admin')

  const allRows = await _bracketQueryOne()
    .unionAll([
      _bracketQueryTwo()
    ])

  const brackets = {}
  for (const { username } of users) {
    brackets[username] = Bracket()
  }
  for (const row of allRows) {
    const { username, c, r } = row
    brackets[username][c][r] = row
  }

  return brackets
}

export const markUserSubmitted = async (username) => {
  await knex('madness_users').update({
    submitted: 1
  }).where('username', '=', username)
}

const _bracketQueryOne = () => knex
  .select('a.username', 'b.bracket_id', 'b.c', 'b.r', 'c.team_name', 'a.format3', 'b.style', 'b.round', 'b.fixed')
  .from('madness_format3_view as a')
  .innerJoin('madness_bracket_mappings as b', 'a.bracket_id', '=', 'b.bracket_id')
  .innerJoin('madness_bracket_mappings_names as c', 'a.mypick', '=', 'c.bracket_id')
  .where('b.fixed', '=', 0)

const _bracketQueryTwo = () => knex
  .select('a.username', 'b.bracket_id', 'b.c', 'b.r', 'b.team_name', knex.raw('\'{"color":"black"}\''), 'b.style', 'b.round', 'b.fixed')
  .from('madness_users as a')
  .innerJoin('madness_bracket_mappings_names as b')
  .where(function() {
    this.where('b.fixed', '=', 1).orWhere(knex.raw('b.fixed is null'))
  })

const Bracket = (rows = []) => {
  const bracket = []
  for (let i = 1; i <= 11; i++) {
    bracket[i] = []
    for (let j = 1; j <= 66; j++) {
      bracket[i][j] = {
        bracket_id: 0,
        style: '',
        hier: '',
        seed: '',
        pick: '',
        team_name: '',
        team_id: '',
        round: '',
        fixed: '',
        format3: ''
      }
    }
  }
  for (const row of rows) {
    console.log(row)
    const { c, r } = row
    Object.assign(bracket[c][r], row)
  }
  return bracket
}
