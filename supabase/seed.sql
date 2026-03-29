insert into golf_clubs (id, name, timezone) values ('club_1', 'Lakeview Golf Club', 'America/Chicago');

insert into users (id, email, name, role, club_id) values
('user_mgr_1', 'manager@easyleaderboard.app', 'Morgan Club Admin', 'manager', 'club_1'),
('user_p_1', 'alex@example.com', 'Alex Reed', 'player', 'club_1'),
('user_p_2', 'sam@example.com', 'Sam Torres', 'player', 'club_1'),
('user_p_3', 'jamie@example.com', 'Jamie Kim', 'player', 'club_1'),
('user_p_4', 'riley@example.com', 'Riley Shah', 'player', 'club_1');

insert into players (id, user_id, club_id, handicap_index, is_active) values
('player_1', 'user_p_1', 'club_1', 8.2, true),
('player_2', 'user_p_2', 'club_1', 11.6, true),
('player_3', 'user_p_3', 'club_1', 15.4, true),
('player_4', 'user_p_4', 'club_1', 6.8, true);

insert into managers (id, user_id, club_id, title) values
('mgr_1', 'user_mgr_1', 'club_1', 'Head Tournament Manager');
