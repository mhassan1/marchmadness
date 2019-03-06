<?php

class Bracket extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if(!$this->session->userdata('username')) {redirect('login', 'refresh');}
	}

	public function index() {

		$this->load->model('UserActivity_model','',TRUE);
		$this->UserActivity_model->lastactivity();

		if ($this->session->userdata('submitted')) {
			$this->load->model('Bracket_model','',TRUE);
			$data['bracket'] = $this->Bracket_model->getMine();
		} else {
			$this->load->model('BracketFillin_model','',TRUE);
			$data['bracket'] = $this->BracketFillin_model->get();
		}

		header('Content-Type: application/json');
		echo json_encode($data);
	}


	public function submit() {

		$this->load->model('BracketFillin_model','',TRUE);
		$this->BracketFillin_model->submit();
		if (isset($_POST['submit'])) {$this->session->set_userdata('submitted',1);}
	}



}

?>
