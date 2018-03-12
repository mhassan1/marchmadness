<?php

class Setup extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if(!$this->session->userdata('username')=='admin') {redirect('login', 'refresh');}
	}


	public function index() {
		$this->load->model('BracketSetup_model','',TRUE);
		$this->load->model('Teams_model','',TRUE);
		$data['bracketsetup'] = $this->BracketSetup_model->get();
		$data['teams'] = $this->Teams_model->get();
		$this->load->view('bracket_setup_view', $data);
	}


	public function submit() {

		$this->load->model('BracketSetup_model','',TRUE);
		$this->BracketSetup_model->submit();
		redirect('setup','refresh');
	}



}

?>
