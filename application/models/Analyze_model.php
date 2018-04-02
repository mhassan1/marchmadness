<?php

Class Analyze_model extends CI_Model {

	function analyze() {
		function nbit($number, $n){return ($number >> $n-1) & 1;}
		function score($allPicks, $username, $sim){
			$bracket = array_values(array_filter($allPicks, function($v) use($username){return $v->username == $username;}));
			$score = 0;
			for($i = 0; $i < count($bracket); $i++){
				if($bracket[$i]->mypick == $sim[$i]){
					$score += 40 * pow(2, $bracket[$i]->round - 1);
				}
			}
			return $score;
		}

		$query = $this -> db -> query('select * from madness_format3_view order by username, round, bracket_id');
		$allPicks = $query->result();
		$adminPicks = array_filter($allPicks, function ($v) { return $v->username == 'admin'; });
		$usernames = array_unique(array_map(function ($v) { return $v->username; }, $allPicks));
		$winCounts = [];
		$hierLookup = [];
		foreach($adminPicks as $v){
			$hierLookup[$v->hier] = $v->mypick;
		}

		$remainingGamesCount = count(array_filter($adminPicks, function ($v) { return !$v->fixed; }));
		if($remainingGamesCount > 7){ // not at Elite 8 yet, too many games left
			return;
		}
		$simCount = pow(2, $remainingGamesCount);

		for($i = 0; $i < $simCount; $i++){
			$hiers = [];
			$sim = [];
			$k = 0;
			foreach($adminPicks as $v){
				if($v->fixed){
					$sim[] = $v->rightpick;
					continue;
				}
				$j = nbit($i, $k + 1) + 1;
				$pick = isset($hiers[$v->hier.'.'.$j])?$hiers[$v->hier.'.'.$j]:$hierLookup[$v->hier.'.'.$j];
				$sim[] = $pick;
				$hiers[$v->hier] = $pick;
				$k++;
			}
			$scores = [];
			foreach($usernames as $username){
				if ($username == 'admin') continue;
				$scores[$username] = score($allPicks, $username, $sim);
			}
			$winners = array_keys($scores, max($scores));
			foreach($winners as $username){
				$winCounts[$username] = (isset($winCounts[$username])?$winCounts[$username]:0) + (1 / count($winners));
			}
		}
		$winFrequency = [];
		foreach($usernames as $username){
			$winFrequency[$username] = isset($winCounts[$username])?$winCounts[$username]:0;
			$winFrequency[$username] = round($winFrequency[$username] / $simCount * 100, 2);
		}
		return $winFrequency;
	}
}

?>
