<?php

class Bracket_model extends CI_Model {

	public function getAll() {
		$user_query = 'select username from madness_users where (submitted=1 and active_in=1) or username=\'admin\'';
		$bracket_query = 'select a.username,b.bracket_id,b.c,b.r,c.team_name,a.format3,b.style,b.round,b.fixed from madness_format3_view a, '
			.'madness_bracket_mappings b, '
			.'madness_bracket_mappings_names c '
			.'where a.mypick=c.bracket_id and '
			.'a.bracket_id=b.bracket_id '
			.'and b.fixed=0 '
			.'union all '
			.'select a.username,b.bracket_id,b.c,b.r,b.team_name,\'color:black;\',b.style,b.round,b.fixed '
			.'from madness_users a,madness_bracket_mappings_names b where b.fixed=1 or b.fixed is null';
		return $this->get($user_query, $bracket_query);
	}

	public function getMine() {
		$user_query = 'select username from madness_users where username=\''.$this->session->userdata('username').'\'';
		$bracket_query = 'select a.username,b.bracket_id,b.c,b.r,c.team_name,a.format3,b.style,b.round,b.fixed from madness_format3_view a, '
			.'madness_bracket_mappings b, '
			.'madness_bracket_mappings_names c '
			.'where a.mypick=c.bracket_id and '
			.'a.bracket_id=b.bracket_id '
			.'and b.fixed=0 '
			.'and a.username=\''.$this->session->userdata('username').'\' '
			.'union all '
			.'select a.username,b.bracket_id,b.c,b.r,b.team_name,\'color:black;\',b.style,b.round,b.fixed '
			.'from madness_users a,madness_bracket_mappings_names b where (b.fixed=1 or b.fixed is null) '
			.'and a.username=\''.$this->session->userdata('username').'\'';
		return $this->get($user_query, $bracket_query)[$this->session->userdata('username')];
	}



	private function get($user_query, $bracket_query) {

		$a = array(array(array()));
		for ($i=1;$i<=11;$i++) {
			for ($j=1;$j<=66;$j++) {
				foreach ($this->db->query($user_query)->result() as $u) {
					$a[$u->username][$i][$j]=array("bracket_id"=>0,"style"=>"","hier"=>"","team_name"=>"","round"=>"","fixed"=>"","format3"=>"");
				}
			}
		}

		foreach ($this->db->query($bracket_query)->result() as $row) {
			$a[$row->username][$row->c][$row->r]["bracket_id"]=$row->bracket_id;
			$a[$row->username][$row->c][$row->r]["style"]=$row->style;
			$a[$row->username][$row->c][$row->r]["team_name"]=$row->team_name;
			$a[$row->username][$row->c][$row->r]["round"]=$row->round;
			$a[$row->username][$row->c][$row->r]["fixed"]=$row->fixed;
			$a[$row->username][$row->c][$row->r]["format3"]=$row->format3;
		}
		return $a;
	}

}

?>
