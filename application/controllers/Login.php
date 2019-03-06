<?php

class Login extends CI_Controller {

	public function index() {
		$this->session->sess_destroy();
		$this->session->unset_userdata('username');
		$this->load->helper(array('form'));
		$this->load->view('login_view');
	}

	public function verifylogin() {
		$this->load->library('form_validation');
		$this->form_validation->set_rules('username', 'Username', 'trim|required');
		$this->form_validation->set_rules('password', 'Password', 'trim|required|callback_check_database');
		if($this->form_validation->run() == FALSE) {
			$this->load->view('login_view');
		} else {
			header('Location: /');
		}
	}

	public function check_database($password) {
		$this->load->model('User_model','',TRUE);
		$username = $this->input->post('username');
		$result = $this->User_model->login($username, $password);
		if($result) {
			$sess_array = array();
			foreach($result as $row) {
				$sess_array = array(
					'username' => $row->username,
					'submitted' => $row->submitted
				);
				$this->session->set_userdata($sess_array);
			}
			return true;
		} else {
			$this->form_validation->set_message('check_database', 'Invalid username or password or this account is no longer active.');
			return false;
		}

	}
}

?>
