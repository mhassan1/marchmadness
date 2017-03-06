<?php

class Update extends CI_Controller {

	public function index() {
		$this->load->model('Update_model','',TRUE);
		$this->Update_model->update();
	}
}

?>
