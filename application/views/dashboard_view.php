<?php $this->load->view('header'); ?>

<div class="page-header"><h3>Standings</h3></div>

<?php if($this->session->userdata('submitted')==0 && $this->session->userdata('username')!='admin'){?>

<p>You need to submit your bracket before you can see anyone else's! Click "My Bracket" above to make your picks.</p>

<?php }else{ ?>

<div id="standings_outer" class="col-md-3" style="padding-right:0px;">

<?php

$data['brackets']=$brackets;

$this->load->view('standings_view',$data);

?>

</div>

<div id="brackets_outer" class="col-md-9">

<?php

$this->load->view('allbrackets_view',$data);

?>

</div>

<?php } ?>

<?php $this->load->view('footer'); ?>
