<script type="text/javascript">



function showBracket(v) {



elts = document.getElementsByClassName('brackets');

for (var m = 0; m < elts.length; m++) {elts[m].style.display="none";}



document.getElementById(v).style.display="block";



}



</script>




<div id="brackets_container">

<?php foreach ($users as $u) {

$data['bracket']=$brackets[$u->username];

?>

<div id="<?=$u->username?>" class="brackets" style="display:none;">

<?php $this->load->view('bracket_view',$data); ?>

</div>



<?php } ?>



<script type="text/javascript">showBracket('<?=$this->session->userdata('username')?>'); makeActive('<?=$this->session->userdata('username')?>'); </script>


</div>
