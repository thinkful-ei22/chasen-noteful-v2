-- psql -U dev -d noteful-app -f ./db/noteful-app.sql

DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

CREATE TABLE tags(
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE folders(
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);
ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE notes (
    id serial PRIMARY KEY,
    title text NOT NULL,
    content text,
    created timestamp with time zone,
    folder_id int REFERENCES folders(id) ON DELETE SET NULL
);
ALTER SEQUENCE notes_id_seq RESTART WITH 1000;

CREATE TABLE notes_tags(
  note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
  );

INSERT INTO folders(name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

INSERT INTO notes (title, content, folder_id) VALUES 
  (
    '5 life lessons learned from cats',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
    , 100
  ),
  (
    'What the government doesn''t want you to know about cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum'
    , 100
  ),
  (
    'The most boring article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    , 100
  ),
  (
    '7 things lady gaga has in common with cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit.' 
    , 100
  ),
  (
    'The most incredible article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, boring consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    , 103
  ),
  (
    '10 ways cats can help you live to 100',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit.'
    , 102
  ),
  (
    '9 reasons you can blame the recession on cats',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    , 101
  ),
  (
    '10 ways marketers are making you addicted to cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit.' 
    , NULL
  ),
  (
    '11 ways investing in cats can make you a millionaire',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    , NULL
  ),
  (
    'Why you should forget everything you learned about cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit.' 
    , NULL
  );


  INSERT INTO tags(name) VALUES
    ('cats'),
    ('dogs'),
    ('thinkful'),
    ('code');
  

  INSERT INTO notes_tags(note_id, tag_id) VALUES
    (1000,1), (1000,2),
    (1001,2),
    (1002,3),
    (1003,4),
    (1004,1),
    (1005,1),
    (1006,1),
    (1007,1),
    (1008,1);
  
  
