<div id="standings_container">



<p>Check out the standings! 'Current' is the number of points so far, 'Potential' is the number of possible points if all the remaining picks are correct!</p>

<p>Correct Round 1 picks are worth 40 points, Round 2 picks are worth 80 points, Round 3 picks are worth 160 points, etc.</p>

<p>Click on a user below to see their picks, or click on "Correct" to see the winning picks, so far.
Correct picks are automatically updated every 15 mins.<br/>
(Last Update: <?php foreach ($lastupdate as $d) {echo date("m/d g:i A",strtotime($d->last_update)); break;} ?>)</p>

<table class="table"><thead><tr><th>User</th><th>Current</th><th>Potential</th><th>Pick</th></tr></thead>

<tbody>

<script type="text/javascript">

function makeActive(v) {
var elts = document.getElementsByClassName("standings_rows");
for (var m = 0; m < elts.length; m++) {elts[m].style.backgroundColor="";}
document.getElementById("row-"+v).style.backgroundColor="lightgrey";
}

</script>

<?php foreach ($standings as $m) { ?>

<tr class="standings_rows" id="row-<?=$m->username?>" onclick="javascript:showBracket(this.id.substring(4)); makeActive(this.id.substring(4));" 
style="cursor:pointer;">

<td><?php if($m->username=='admin'){echo 'Correct';} else {echo $m->username;}?></td>

<td><?=$m->points?></td>

<td><?=$m->potential?></td>

<td><span style="<?=$m->finalpickformat3?>"><?=$m->finalpick?></span></td>

</tr>



<?php } ?>

</table>


<?php 

$cur='';$pot='';$un='';

foreach ($standings as $m) {

$cur.=$m->points.',';

$pot.=$m->potential.',';

$un.=$m->username.',';

}

$cur=substr($cur,0,-1);$pot=substr($pot,0,-1);$un=substr($un,0,-1);



$imgsrc='http://chartspree.io/bar.svg?C='.$cur.'&P='.$pot.'&_labels='.$un.'&_height=500px&_width=1000px';


?>


<!--
<div style="text-align:center">

<object style="width:300px;height:600px;" type="image/svg+xml" data="<?=$imgsrc?>"><img src="<?=$imgsrc?>"/></object>

</div>

-->

</div>
