<?php $this->load->view('header'); ?>

<div class="page-header"><h3>My Bracket</h3></div>

<p>This is your completed bracket! As the tournament goes on, check back here often to see how you are doing!!</p>

<p>You can also click "Standings" above once the tournament has started!</p>

<p>Green is a correct pick, red is a wrong pick, and strikethrough is an eliminated pick. Good luck!</p>

</br>



<div class="well">

<?php

$data['bracket']=$bracket;

$this->load->view('bracket_view',$data);
?>

</div>

<?php
$this->load->view('footer');
?>
