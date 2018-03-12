<?php

class Teams_model extends CI_Model {

	function get() {
		$query = $this -> db -> query('SELECT * from madness_msnbc_teams');

		$a = array();
		foreach ($query->result() as $row) {
			$a[] = (array)$row;
		}
		return $a;
	}

}

?>
