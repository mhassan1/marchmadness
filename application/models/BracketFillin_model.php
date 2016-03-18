<?php

class BracketFillin_model extends CI_Model {

	function get() {
		$query = $this -> db -> query('SELECT a.bracket_id,a.round,b.pick,a.c,a.r,a.fixed,a.style,a.hier,c.team_name '
			.'FROM madness_bracket_mappings a '
			.'left outer join '
			.'madness_brackets b on a.bracket_id=b.bracket_id and b.username="'.$this->session->userdata('username').'", '
			.'madness_bracket_mappings c '
			.'where (ifnull(b.pick,a.bracket_id)=c.bracket_id)');

		$a = array(array(array()));
		for ($i=1;$i<=11;$i++) {
			for ($j=1;$j<=66;$j++) {
				$a[$this->session->userdata('username')][$i][$j]=array("bracket_id"=>0,"style"=>"","hier"=>"","pick"=>"","team_name"=>"","round"=>"","fixed"=>"");
			}
		}

		foreach ($query->result() as $row) {
			$a[$this->session->userdata('username')][$row->c][$row->r]["bracket_id"]=$row->bracket_id;
			$a[$this->session->userdata('username')][$row->c][$row->r]["style"]=$row->style;
			$a[$this->session->userdata('username')][$row->c][$row->r]["hier"]=$row->hier;
			$a[$this->session->userdata('username')][$row->c][$row->r]["pick"]=$row->pick;
			$a[$this->session->userdata('username')][$row->c][$row->r]["team_name"]=$row->team_name;
			$a[$this->session->userdata('username')][$row->c][$row->r]["round"]=$row->round;
			$a[$this->session->userdata('username')][$row->c][$row->r]["fixed"]=$row->fixed;
		}
		return $a;
	}

	public function submit() {

		$first=1;
		$deletequery = 'delete from madness_brackets where username="'.$this->session->userdata('username').'"';
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
	}

}

?>