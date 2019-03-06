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
		$this->load->model('Analyze_model','',TRUE);
		$this->Standings_model->combine($standings, $this->Analyze_model->analyze());
		$data['standings'] = $standings;

		$lastupdate = $this->Standings_model->getLastCorrectUpdate();
		$lastupdate = date_create_from_format('Y-m-d H:i:s', $lastupdate[0]->last_update, timezone_open('UTC'));
		$data['lastupdate'] = date_format($lastupdate, 'c');

		header('Content-Type: application/json');
		echo json_encode($data);
	}
}



?>
