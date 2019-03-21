<?php

class Standings_model extends CI_Model {

	function get() {
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
	}

	function combine(&$standings, $winFrequency) {
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
	}

	function getLastCorrectUpdate() {
		$query = $this -> db -> query('select last_update from madness_msnbc_games_update');
		$a = $query->result();
		return $a;
	}

}

?>
