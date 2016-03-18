<?php

class UserActivity_model extends CI_Model {

	function lastactivity() {
		$this -> db -> query('update madness_users set last_activity = "'.date('Y-m-d H:i:s',$timestamp=time()-4*60*60).'" where username = "'.$this->session->userdata('username').'"');
		return true;
	}
}

?>