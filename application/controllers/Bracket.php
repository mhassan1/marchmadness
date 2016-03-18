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
			$data['bracketfillin'] = $this->BracketFillin_model->get();
		}

		if (isset($data['bracket'])) {
			$this->load->view('mybracket_view', $data);
		} else {
			$this->load->view('mybracket_fillin_view', $data);
		}
	}


	public function submit() {

		$this->load->model('BracketFillin_model','',TRUE);
		$this->BracketFillin_model->submit();
		if (isset($_POST['submit'])) {$this->session->set_userdata('submitted',1);}
		redirect('bracket','refresh');
	}



}

?>