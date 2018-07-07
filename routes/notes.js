'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);
const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const {folderId} = req.query;
  const {tagId} = req.query;

  knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id','notes_tags.tag_id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .modify(function (queryBuilder) {
      if (tagId) {
        queryBuilder.where('tag_id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Get/read a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('notes.id','title','content', 'folders.id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id','notes_tags.tag_id')
    .where('notes.id', id)
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result)[0];
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// Put update an item
router.put('/:id', (req, res, next) => {
  const noteId = req.params.id;
  const {title, content, folderId, tags=[]} = req.body; //tags=[] so if there are no tags will run still

  /***** Never trust users - validate input *****/
  const updateObj = { 
    title,
    content,
    folder_id: folderId
  };
  // const updateableFields = ['title', 'content'];

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  //update note in notes table//
  knex('notes')
    .update(updateObj)
    .where('id', noteId)
    .returning('id')
    .then(([id]) => {
      //then delete current related tags from notes_tabs table//
      return knex('notes_tags')
        .where('note_id', id)
        .del();
    })      
    .then(() => {
      //insert related tags into notes_tags table
      const tagsInsert = tags.map(tagId => ({note_id: noteId, tag_id: tagId}));
      return knex.insert(tagsInsert).into('notes_tags');
    }) 
    .then(() => {
      //select the new note and leftJoinon folders and tags
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName','tags.id as tagId', 'tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id','notes_tags.tag_id')
        .where('notes.id', noteId);
    })
    .then(result => {
      if (result) {
        const [hydrated] = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags=[]} = req.body; //tags=[] so if there are no tags will run still
  const newItem = { 
    title, 
    content, 
    folder_id: folderId ? folderId: null
  };

  /***** validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  let noteId;
  //Insert new note into table
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      //Insert realted tags into notes_tags table
      const tagsInsert = tags.map(tagId => ({note_id: noteId, tag_id: tagId}));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => {
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id','notes_tags.tag_id')
        .where('notes.id', noteId);
    })
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result)[0];
        res.location(`${req.originalUrl}/${hydrated.id}`).status(201).json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where('notes.id', id)
    .del()
    .then(() => res.sendStatus(204))
    .catch(err => {
      next(err);
    });
});

module.exports = router;
