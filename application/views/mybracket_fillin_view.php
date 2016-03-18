<script type="text/javascript">



function refreshAll() {



for (var r = 0; r < 9; r++) {

elts = document.getElementsByClassName("selectors-"+r);



for (var m = 0; m < elts.length; m++) {



sel_prev = elts[m].options[elts[m].selectedIndex].text;



sel1=document.getElementById(elts[m].id+".1");

sel2=document.getElementById(elts[m].id+".2");



elts[m].options[1].text=sel1.options[sel1.selectedIndex].text;

elts[m].options[2].text=sel2.options[sel2.selectedIndex].text;



elts[m].options[1].value=sel1.options[sel1.selectedIndex].value;

elts[m].options[2].value=sel2.options[sel2.selectedIndex].value;



if (elts[m].options[1].text==sel_prev&&sel_prev!="") {elts[m].selectedIndex=1;}

else if (elts[m].options[2].text==sel_prev&&sel_prev!="") {elts[m].selectedIndex=2;}

else {elts[m].selectedIndex=0;}



}



}



}



function validatePicks() {

var validated=true;

for (var r = 0; r < 9; r++) {

elts = document.getElementsByClassName("selectors-"+r);

for (var m = 0; m < elts.length; m++) {

if(elts[m].options[elts[m].selectedIndex].text=="") {

elts[m].style.backgroundColor="red";

validated=false;

} else {elts[m].style.backgroundColor="";}

}

}

if (!validated) {alert('You are missing some picks (shown in red)! If you want to save your work and come back later, click Save.');}

return validated;

}



function cleanupSelectorNames() {

for (var r = 0; r < 9; r++) {

elts = document.getElementsByClassName("selectors-"+r);

for (var m = 0; m < elts.length; m++) {

//if(elts[m].options[elts[m].selectedIndex].text=="") {elts[m].disabled=true;}

}

}

return true;

}



</script>


<?php $this->load->view('header'); ?>

<div class="page-header"><h3>My Bracket</h3></div>

<p>Make your picks below! If you'd like to save your progress and continue later, click Save. When you are done, click Submit! Please submit your picks before the first game starts on Tuesday, 3/15!</p>

</br>

<div class="well">

<form action="bracket/submit" method="post">

<input style="margin-left:200px;" type="submit" name="save" value="Save"/>

<input type="submit" name="submit" value="Submit" onclick="return validatePicks()"/>

<table class="bracket">

<?php for ($i=1;$i<=66;$i++) { ?>

<tr>

<?php for ($j=1;$j<=11;$j++) {



$bid=$bracketfillin[$this->session->userdata('username')][$j][$i]['bracket_id'];

$pick=$bracketfillin[$this->session->userdata('username')][$j][$i]['pick'];

$style=$bracketfillin[$this->session->userdata('username')][$j][$i]['style'];

$hier=$bracketfillin[$this->session->userdata('username')][$j][$i]['hier'];

$team_name=$bracketfillin[$this->session->userdata('username')][$j][$i]['team_name'];

if($team_name==''){$team_name='&nbsp;';}

$round=$bracketfillin[$this->session->userdata('username')][$j][$i]['round'];

$fixed=$bracketfillin[$this->session->userdata('username')][$j][$i]['fixed'];



?>



<?php

if ($fixed!='')



{ 



if ($fixed==0) {

echo "<td style=\"border-bottom:1px solid black;".$style."\">"

."<select id=\"".$hier."\" name=\"".$bid."\" class=\"selectors-".$round."\" onchange=\"refreshAll();\" style=\"\">"



."<option id=\"".$hier."-1\" value=\"".$bid."\"></option>"

."<option id=\"".$hier."-2\" value=\"".$pick."\" selected>".$team_name."</option>"

."<option id=\"".$hier."-3\" value=\"".$bid."\"></option>"



."</select>"

."</td>";



} else {



echo "<td style=\"border-bottom:1px solid black;".$style."\">"

."<span>"

.$team_name

."</span>"

."<select id=\"".$hier."\" style=\"display:none;\" disabled><option id=\"".$hier."-1\" value=\"".$bid."\" selected>".$team_name."</option></select>"

."</td>";



}



} else {

echo "<td style=\"".$style."\">".$team_name."</td>";

}



} ?>

</tr>

<?php } ?>

</table>



<input style="margin-left:200px;" type="submit" name="save" value="Save"/>

<input type="submit" name="submit" value="Submit" onclick="return validatePicks()"/>

</form>


</div>


<script type="text/javascript">refreshAll();</script>

<?php $this->load->view('footer'); ?>