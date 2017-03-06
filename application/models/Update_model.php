<?php

Class Update_model extends CI_Model {

	function update() {
		$dates = array(date('Ymd',$timestamp=time()), date('Ymd',$timestamp=time()-24*60*60));

		foreach ($dates as $date) {
			$url = "http://scores.nbcsports.msnbc.com/ticker/data/gamesNEW.js.asp?sport=CBK&period=".$date."&random=1458147354771";
			echo "$url<br/>";
			$res = file_get_contents($url);
			echo htmlspecialchars($res)."<br/>";
			$obj = json_decode($res);
			$games = $obj->{'games'};
	
			foreach ($games as $game) {
				echo "<br/>";
				$dom = new DOMDocument;
				$dom->loadXML($game);
				if ($dom->getElementsByTagName('gamestate')->item(0)->getAttribute('status')=='Final') {
					$team1 = $dom->getElementsByTagName('visiting-team')->item(0);
					$team1_id = $team1->getAttribute('id');
					$team1_name = $team1->getAttribute('alias');
					$team1_score = $team1->getAttribute('score');
			
					$team2 = $dom->getElementsByTagName('home-team')->item(0);
					$team2_id = $team2->getAttribute('id');
					$team2_name = $team2->getAttribute('alias');
					$team2_score = $team2->getAttribute('score');
			
					// upsert here
					$query = "insert into madness_msnbc_games (team1_id, team2_id, team1_name, team2_name, team1_score, team2_score) "
						."values (" . $team1_id . "," . $team2_id . ",'" . $team1_name . "','" . $team2_name . "'," . $team1_score . "," . $team2_score . ") "
						."on duplicate key update team1_score = " . $team1_score . ", team2_score = " . $team2_score . "";
					echo "$query<br/>";
					$this -> db -> query($query);
				}
			}
			echo "<br/><br/>";
		}

		$finalquery = "insert into madness_brackets (username, bracket_id, pick) ".
			"select username, bracket_id, pick from madness_admin_inserts_view v ".
			"on duplicate key update pick = v.pick";
		$this -> db -> query($finalquery);

		$timestampquery = "update madness_msnbc_games_update set last_update = '".date('Y-m-d H:i:s',$timestamp=time()-4*60*60)."'";
		$this -> db -> query($timestampquery);
	}
}

?>
