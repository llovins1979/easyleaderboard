create type user_role as enum ('player', 'manager');
create type scoring_method as enum ('stroke_play', 'stableford', 'best_ball', 'scramble', 'team_total');
create type event_type as enum ('individual', 'team');

create table golf_clubs (
  id text primary key,
  name text not null,
  timezone text not null,
  created_at timestamptz default now()
);

create table users (
  id text primary key,
  email text unique not null,
  name text not null,
  role user_role not null,
  club_id text references golf_clubs(id),
  created_at timestamptz default now()
);

create table players (
  id text primary key,
  user_id text unique references users(id),
  club_id text references golf_clubs(id),
  handicap_index numeric(5,2) not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table managers (
  id text primary key,
  user_id text unique references users(id),
  club_id text references golf_clubs(id),
  title text,
  created_at timestamptz default now()
);

create table courses (
  id text primary key,
  club_id text references golf_clubs(id),
  name text not null,
  par_by_hole integer[] not null,
  rating numeric(4,1) not null,
  slope integer not null
);

create table tees (
  id text primary key,
  course_id text references courses(id),
  name text not null,
  gender text not null,
  rating numeric(4,1) not null,
  slope integer not null
);

create table events (
  id text primary key,
  club_id text references golf_clubs(id),
  name text not null,
  course_id text references courses(id),
  tee_id text references tees(id),
  event_date date not null,
  status text not null,
  event_type event_type not null,
  team_format text,
  scoring_method scoring_method not null,
  rules_text text,
  created_at timestamptz default now()
);

create table event_players (
  event_id text references events(id) on delete cascade,
  player_id text references players(id) on delete cascade,
  primary key (event_id, player_id)
);

create table scorecards (
  id text primary key,
  event_id text references events(id) on delete cascade,
  player_id text references players(id),
  tee_id text references tees(id),
  hole_scores integer[] not null,
  gross_score integer not null,
  net_score integer,
  team_id text,
  updated_at timestamptz default now()
);

create table scoring_rules (
  id text primary key,
  event_id text references events(id) on delete cascade,
  scoring_method scoring_method not null,
  stableford_points jsonb,
  best_ball_count integer,
  scramble_drive_requirement integer,
  winner_config jsonb not null,
  skins_config jsonb not null
);

create table payout_rules (
  id text primary key,
  event_id text references events(id) on delete cascade,
  name text not null,
  top_n integer not null,
  percentages numeric[] not null
);

create table player_groups (
  id text primary key,
  event_id text references events(id) on delete cascade,
  name text not null,
  player_ids text[] not null,
  tee_time timestamptz
);

create table teams (
  id text primary key,
  event_id text references events(id) on delete cascade,
  name text not null,
  captain_player_id text references players(id)
);

create table team_memberships (
  id text primary key,
  team_id text references teams(id) on delete cascade,
  player_id text references players(id) on delete cascade
);

create table handicap_history (
  id text primary key,
  player_id text references players(id),
  event_id text references events(id),
  round_date date not null,
  handicap_index numeric(5,2) not null,
  gross_score integer not null,
  net_score integer
);

create table event_history (
  id text primary key,
  event_id text references events(id),
  player_id text references players(id),
  player_name text not null,
  course_id text references courses(id),
  round_date date not null,
  tee_id text references tees(id),
  scoring_format scoring_method not null,
  hole_scores integer[] not null,
  gross_score integer not null,
  net_score integer,
  team_id text
);

create table notifications (
  id text primary key,
  event_id text references events(id),
  group_id text,
  title text not null,
  body text not null,
  target text not null,
  provider_status text not null,
  created_at timestamptz default now()
);

create table audit_logs (
  id text primary key,
  event_id text references events(id) on delete cascade,
  scorecard_id text references scorecards(id),
  editor_user_id text references users(id),
  reason text not null,
  previous_hole_scores integer[] not null,
  new_hole_scores integer[] not null,
  edited_at timestamptz default now()
);

create index idx_scorecards_event on scorecards(event_id);
create index idx_notifications_event on notifications(event_id);
create index idx_event_history_player_date on event_history(player_id, round_date);

create table money_games (
  id text primary key,
  event_id text references events(id),
  club_id text references golf_clubs(id) not null,
  name text not null,
  buy_in numeric(10,2) not null check (buy_in >= 0),
  max_players integer not null check (max_players > 1 and max_players <= 50),
  payout_config jsonb not null,
  status text not null default 'open',
  created_by_user_id text references users(id) not null,
  created_at timestamptz default now()
);

create table money_game_entries (
  id text primary key,
  money_game_id text references money_games(id) on delete cascade,
  player_id text references players(id) on delete cascade,
  joined_at timestamptz default now(),
  paid_in boolean default false,
  unique (money_game_id, player_id)
);

create index idx_money_games_club_status on money_games(club_id, status);
