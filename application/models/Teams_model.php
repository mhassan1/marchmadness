<?php

class Teams_model extends CI_Model {

	function get() {
		$query = $this -> db -> query("SELECT * from madness_msnbc_teams where team_name!='' order by team_name");

		$a = array();
		foreach ($query->result() as $row) {
			$a[] = (array)$row;
		}
		return $a;
	}

}

?>
