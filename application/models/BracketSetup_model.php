<?php

class BracketSetup_model extends CI_Model {

	function get() {
		$query = $this -> db -> query('SELECT a.bracket_id,a.round,a.c,a.r,a.fixed,a.style,a.hier,a.team_name,a.seed,a.team_id '
			.'FROM madness_bracket_mappings_names a');

		$a = array(array());
		for ($i=1;$i<=11;$i++) {
			for ($j=1;$j<=66;$j++) {
				$a[$i][$j]=array("bracket_id"=>0,"style"=>"","hier"=>"","seed"=>"","pick"=>"","team_name"=>"","team_id"=>"","round"=>"","fixed"=>"");
			}
		}

		foreach ($query->result() as $row) {
			$a[$row->c][$row->r]["bracket_id"]=$row->bracket_id;
			$a[$row->c][$row->r]["style"]=$row->style;
			$a[$row->c][$row->r]["hier"]=$row->hier;
			$a[$row->c][$row->r]["seed"]=$row->seed;
			$a[$row->c][$row->r]["team_name"]=$row->team_name;
			$a[$row->c][$row->r]["team_id"]=$row->team_id;
			$a[$row->c][$row->r]["round"]=$row->round;
			$a[$row->c][$row->r]["fixed"]=$row->fixed;
		}
		return $a;
	}

	public function submit() {

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
	}

}

?>
