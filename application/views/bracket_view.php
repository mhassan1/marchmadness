<table class="bracket">

<?php for ($i=1;$i<=66;$i++) { ?>

<tr>

<?php for ($j=1;$j<=11;$j++) {



$bid=$bracket[$j][$i]['bracket_id'];

//$pick=$bracket[$j][$i]['pick'];

$team_name=$bracket[$j][$i]['team_name'];

if($team_name==''){$team_name='&nbsp;';}

$style=$bracket[$j][$i]['style'];

//$hier=$bracket[$j][$i]['hier'];

$fixed=$bracket[$j][$i]['fixed'];

$format3=$bracket[$j][$i]['format3'];



if ($fixed!=null) {



echo "<td style=\"border-bottom:1px solid black;".$style."\">"

."<span style=\"".$format3."\">"

.$team_name

."</span>"

."</td>";





} else {
echo "<td style=\"".$style."\">".$team_name."</td>";

}

} ?>

</tr>

<?php } ?>

</table>
