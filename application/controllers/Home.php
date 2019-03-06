<?php

class Home extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if(!$this->session->userdata('username')) {redirect('login', 'refresh');}
	}

	public function index() {
		$user = (object) [
		    'username' => $this->session->userdata('username'),
		    'submitted' => $this->session->userdata('submitted')
		];
		?>

		<!doctype html>
		<html lang="en">
		    <head>
		        <title>March Madness</title>
		        <meta charset="utf-8">
		        <meta http-equiv="x-ua-compatible" content="ie=edge">
		        <meta name="viewport" content="width=device-width, initial-scale=1">
						<link rel="stylesheet" href="/react/assets/css/app.css" type="text/css">
		    </head>
		    <script type="text/javascript">
		        var STATIC_URL = 'http://localhost';
		        var myApp = {
		            username : '<?php echo $user->username; ?>',
								submitted : <?php echo $user->submitted; ?>
		        };
		    </script>
		    <body>
		        <div id="app"></div>
		        <script type="text/javascript" src="/react/assets/bundle/main.bundle.js" ></script>
		    </body>
		</html>

		<?php
	}

}

?>
