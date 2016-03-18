<?php

class Home extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if(!$this->session->userdata('username')) {redirect('login', 'refresh');}
	}

	public function index() {
		if($this->session->userdata('submitted') || $this->session->userdata('username')=='admin') {
			redirect('dashboard', 'refresh');
		} else {
			redirect('bracket', 'refresh');
		}
	}

}

?>