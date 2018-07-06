-- psql -U dev -d noteful-app -f .\scratch\queries.sql


-- get all notes
-- SELECT id, title
-- FROM notes
-- WHERE title LIKE '%gaga%';

SELECT id, title
FROM notes;
-- WHERE id = '1001';


-- SELECT title, tags.name, folders.name FROM notes
-- LEFT JOIN folders ON notes.folder_id = folders.id
-- LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
-- LEFT JOIN tags ON notes_tags.tag_id = tags.id;