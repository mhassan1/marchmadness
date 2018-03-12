
<?php $this->load->view('header'); ?>

<div class="page-header"><h3>Bracket Setup</h3></div>

<p>This page should be used for initial setup of brackets. Click Save when finished. Choose "Round0-#n" at the bottom of the list for the 4 Round 0 games.
Once the users are saving picks, don't change anything here. There isn't validation on this page, so be careful!</p>

</br>

<div class="well">

<form action="setup/submit" method="post">

<input style="margin-left:200px;" type="submit" name="save" value="Save"/>

<table class="bracket">

<?php for ($i=1;$i<=66;$i++) { ?>

<tr>

<?php for ($j=1;$j<=11;$j++) {



$bid=$bracketsetup[$this->session->userdata('username')][$j][$i]['bracket_id'];

$pick=$bracketsetup[$this->session->userdata('username')][$j][$i]['pick'];

$style=$bracketsetup[$this->session->userdata('username')][$j][$i]['style'];

$hier=$bracketsetup[$this->session->userdata('username')][$j][$i]['hier'];

$seed=$bracketsetup[$this->session->userdata('username')][$j][$i]['seed'];

$team_name=$bracketsetup[$this->session->userdata('username')][$j][$i]['team_name'];

$team_id=$bracketsetup[$this->session->userdata('username')][$j][$i]['team_id'];

if($team_name==''){$team_name='&nbsp;';}

$round=$bracketsetup[$this->session->userdata('username')][$j][$i]['round'];

$fixed=$bracketsetup[$this->session->userdata('username')][$j][$i]['fixed'];



?>



<?php

if ($fixed!=''){
if ($fixed==1 || $team_id<0) {

echo "<td style=\"border-bottom:1px solid black;\">"

."<select id=\"".$hier."\" name=\"".$bid.",".$hier.",".$seed."\" class=\"selectors-".$round."\" style=\"\">";

echo "<option id=\"none\" value=\"\"></option>";
foreach($teams as $team){
  echo "<option id=\"".$team['msnbc_team_id']."\" value=\"".$team['msnbc_team_id']."\" ".
  ($team['msnbc_team_id']==$team_id?'selected':'')
  .">".$team['team_name']."</option>";
}
if ($round==1) {
  echo "<option id=\"round0-1\" value=\"-1\" ".($team_id==-1?'selected':'').">Round 0 - #1</option>";
  echo "<option id=\"round0-2\" value=\"-2\" ".($team_id==-2?'selected':'').">Round 0 - #2</option>";
  echo "<option id=\"round0-4\" value=\"-4\" ".($team_id==-4?'selected':'').">Round 0 - #3</option>"; // 4 then 3 because of out->in ordering on both sides of bracket
  echo "<option id=\"round0-3\" value=\"-3\" ".($team_id==-3?'selected':'').">Round 0 - #4</option>";
}

echo "</select>"

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

</form>


</div>


<?php $this->load->view('footer'); ?>
