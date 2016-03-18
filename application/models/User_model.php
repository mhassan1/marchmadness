<?php

Class User_model extends CI_Model {

	function login($username, $password) {
		$this -> db -> select('id, username, password, submitted');
		$this -> db -> from('madness_users');
		$this -> db -> where('username', $username);
		$this -> db -> where('password', MD5($password));
		$this -> db -> where('active_in', 1);
		$this -> db -> limit(1);
		$query = $this -> db -> get();
		if($query -> num_rows() == 1) {
			return $query->result();
		} else {
     			return false;
		}
	}

	function getAllSubmitted() {
		$query = $this -> db -> query("select username from madness_users where username='admin' ".
			"union select username from madness_users where username!='admin' and submitted=1 and active_in=1");
		return $query->result();
	}
}

?>