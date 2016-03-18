<?php

class Dashboard extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if(!$this->session->userdata('username')) {redirect('login', 'refresh');}
	}

	public function index() {
		$this->load->model('UserActivity_model','',TRUE);
		$this->UserActivity_model->lastactivity();

		$this->load->model('Bracket_model','',TRUE);
		$brackets = $this->Bracket_model->getAll();
		$data['brackets']=$brackets;
		
		$this->load->model('User_model','',TRUE);
		$data['users']=$this->User_model->getAllSubmitted();

		$this->load->model('Standings_model','',TRUE);
		$standings = $this->Standings_model->get();
		$data['standings']=$standings;
		
		$lastupdate = $this->Standings_model->getLastCorrectUpdate();
		$data['lastupdate']=$lastupdate;

		$this->load->view('dashboard_view', $data);
	}
}



?>