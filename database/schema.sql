CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int(10) unsigned DEFAULT 0 NOT NULL,
  `data` blob NOT NULL,
  KEY `ci_sessions_timestamp` (`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `madness_brackets` (
  `username` varchar(10) NOT NULL,
  `bracket_id` int(11) NOT NULL,
  `pick` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`username`,`bracket_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `madness_bracket_mappings` (
  `bracket_id` int(11) NOT NULL,
  `c` int(11) NOT NULL,
  `r` int(11) NOT NULL,
  `style` varchar(45) DEFAULT NULL,
  `hier` varchar(45) DEFAULT NULL,
  `round` int(11) DEFAULT NULL,
  `fixed` int(1) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `label` varchar(100) DEFAULT NULL,
  `seed` int(11) DEFAULT NULL, # TODO
  PRIMARY KEY (`bracket_id`),
  INDEX (`team_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `madness_msnbc_games` (
  `team1_id` int(11) NOT NULL,
  `team2_id` int(11) NOT NULL,
  `team1_name` varchar(100) NOT NULL,
  `team2_name` varchar(100) NOT NULL,
  `team1_score` int(11) NOT NULL,
  `team2_score` int(11) NOT NULL,
  PRIMARY KEY (`team1_id`,`team2_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `madness_msnbc_games_update` (
  `last_update` datetime NOT NULL,
  PRIMARY KEY (`last_update`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

REPLACE INTO `madness_msnbc_games_update` (`last_update`) VALUES
('2016-04-06 10:00:01');

CREATE TABLE `madness_msnbc_teams` (
  `msnbc_team_id` int(11) NOT NULL,
  `msnbc_team_name` varchar(100) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  PRIMARY KEY (`msnbc_team_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `madness_users` (
  `username` varchar(10) NOT NULL,
  `password` varchar(100) NOT NULL,
  `submitted` int(1) NOT NULL DEFAULT '0',
  `active_in` int(1) NOT NULL DEFAULT '1',
  `last_activity` datetime DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

INSERT INTO `madness_users` (`username`, `password`) VALUES # admin user
('admin', '5ebe2294ecd0e0f08eab7690d2a6ee69'); # secret

CREATE VIEW `madness_bracket_mappings_names` AS select a.*, case when b.team_name is not null then concat_ws(' ',a.seed,b.team_name) else a.label end team_name from madness_bracket_mappings a left join madness_msnbc_teams b on a.team_id = b.msnbc_team_id;

CREATE VIEW `madness_admin_inserts_view` AS select 'admin' AS `username`,`winner_bracket`.`bracket_id` AS `bracket_id`,if((`games`.`team1_score` > `games`.`team2_score`),`team1_brackets`.`bracket_id`,`team2_brackets`.`bracket_id`) AS `pick` from (((((`madness_bracket_mappings` `team1_brackets` join `madness_bracket_mappings` `team2_brackets`) join `madness_msnbc_teams` `team1_maps`) join `madness_msnbc_teams` `team2_maps`) join `madness_msnbc_games` `games`) join `madness_bracket_mappings` `winner_bracket`) where ((`team1_brackets`.`team_id` = `team1_maps`.`msnbc_team_id`) and (`team2_brackets`.`team_id` = `team2_maps`.`msnbc_team_id`) and (`team1_maps`.`msnbc_team_id` = `games`.`team1_id`) and (`team2_maps`.`msnbc_team_id` = `games`.`team2_id`) and (`winner_bracket`.`hier` = (case when (left(`team1_brackets`.`hier`,15) = left(`team2_brackets`.`hier`,15)) then left(`team1_brackets`.`hier`,15) when (left(`team1_brackets`.`hier`,13) = left(`team2_brackets`.`hier`,13)) then left(`team1_brackets`.`hier`,13) when (left(`team1_brackets`.`hier`,11) = left(`team2_brackets`.`hier`,11)) then left(`team1_brackets`.`hier`,11) when (left(`team1_brackets`.`hier`,9) = left(`team2_brackets`.`hier`,9)) then left(`team1_brackets`.`hier`,9) when (left(`team1_brackets`.`hier`,7) = left(`team2_brackets`.`hier`,7)) then left(`team1_brackets`.`hier`,7) when (left(`team1_brackets`.`hier`,5) = left(`team2_brackets`.`hier`,5)) then left(`team1_brackets`.`hier`,5) when (left(`team1_brackets`.`hier`,3) = left(`team2_brackets`.`hier`,3)) then left(`team1_brackets`.`hier`,3) when (left(`team1_brackets`.`hier`,1) = left(`team2_brackets`.`hier`,1)) then left(`team1_brackets`.`hier`,1) else '?' end)));

CREATE VIEW `madness_format1_view` AS select `mypicks`.`username` AS `username`,`maps`.`round` AS `round`,`maps`.`r` AS `r`,`maps`.`c` AS `c`,`maps`.`hier` AS `hier`,`mypicks`.`bracket_id` AS `bracket_id`,`mypicks`.`pick` AS `mypick`,`rightpicks`.`pick` AS `rightpick`,if((isnull(`rightpicks`.`pick`) or (`rightpicks`.`pick` = `rightpicks`.`bracket_id`)),_utf8'none or strike',if((`rightpicks`.`pick` = `mypicks`.`pick`),_utf8'green',_utf8'red or strike')) AS `format1` from (`madness_bracket_mappings` `maps` join (`madness_brackets` `mypicks` left join `madness_brackets` `rightpicks` on((`mypicks`.`bracket_id` = `rightpicks`.`bracket_id`)))) where ((`maps`.`bracket_id` = `mypicks`.`bracket_id`) and (`rightpicks`.`username` = 'admin') and (`mypicks`.`pick` is not null) and (`mypicks`.`pick` <> '') and (`maps`.`fixed` = 0));

CREATE VIEW `madness_format2_view` AS select `madness_format1_view`.`username` AS `username`,`madness_format1_view`.`mypick` AS `mypick`,min(`madness_format1_view`.`round`) AS `minround` from `madness_format1_view` where (`madness_format1_view`.`format1` = _utf8'red or strike') group by `madness_format1_view`.`mypick`,`madness_format1_view`.`username`;

CREATE VIEW `madness_format3_view` AS select `a`.`username` AS `username`,`a`.`round` AS `round`,`a`.`bracket_id` AS `bracket_id`,`a`.`r` AS `r`,`a`.`c` AS `c`,`a`.`hier` AS `hier`,`a`.`mypick` AS `mypick`,`a`.`rightpick` AS `rightpick`,`b`.`minround` AS `minround`,`c`.`team_name` AS `team_name`,`c`.`fixed`, if(isnull(`a`.`rightpick`),_utf8'color:black;',if((`a`.`format1` = _utf8'green'),_utf8'color:green;',if((`a`.`format1` = _utf8'red or strike'),if((`a`.`round` = `b`.`minround`),_utf8'color:red;',_utf8'text-decoration:line-through;'),if((`b`.`minround` is not null),_utf8'text-decoration:line-through;',_utf8'color:black;')))) AS `format3` from ((`madness_format1_view` `a` left join `madness_format2_view` `b` on(((`a`.`mypick` = `b`.`mypick`) and (`a`.`username` = `b`.`username`)))) join `madness_bracket_mappings_names` `c` on((`a`.`mypick` = `c`.`bracket_id`)));
