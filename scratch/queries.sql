-- psql -U dev -d noteful-app -f .\scratch\queries.sql


-- get all notes
-- SELECT id, title
-- FROM notes
-- WHERE title LIKE '%gaga%';

SELECT id, title
FROM notes;
-- WHERE id = '1001';