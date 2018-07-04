'use strict';

const knex = require('../knex');


////Get All Notes accepts a searchTerm and finds notes with titles 
////which contain the term. It returns an array of objects.

// let searchTerm = 'cats';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });



// // Get Note By Id accepts an ID. It returns the note as an object

// let searchId = 1001;
// knex
//   .select('notes.id','title','content')
//   .from('notes')
//   .where('id',`${searchId}`)
//   .then( ([item]) => {
//     console.log(item);
//   });

//Update Note By Id accepts an ID and an object with the desired updates. It returns the updated note as an object

// let updateId = 1000;
// let updatedNote = {title:'Updated Title about cats', content:'Updated content about cats'};

// knex('notes')
//   .where('notes.id',`${updateId}`)
//   .update(updatedNote)
//   .returning(['id', 'title', 'content'])
//   .then(([results]) => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.error(err);
//   });

// ///Create a Note accepts an object with the note properties and inserts it in the DB. It returns the new note (including the new id) as an object.

// let newNote = {title:'New Title about dogs', content: 'New content about dogs!'};

// knex('notes')
//   .insert(newNote)
//   .returning(['id', 'title', 'content'])
//   .then(([results]) => {
//     console.log(results);
//   })
//   .catch(err => {
//     console.error(err);
//   });




// //delete note by ID

// let deleteId = 1001;

// knex('notes')
//   .where('notes.id', deleteId)
//   .del()
//   .then(() => {
//     console.log('note deleted');
//   })
//   .catch(err => {
//     console.error(err);
//   });