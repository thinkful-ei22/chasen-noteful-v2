'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);
const knex = require('../knex');

// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;

  knex.select('id', 'title', 'content')
    .from('notes')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// Get/read a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('notes.id','title','content')
    .from('notes')
    .where('notes.id', id)
    .then(([result]) => {
      if (result){
        res.json(result);
      }else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {title, content} = req.body;

  /***** Never trust users - validate input *****/
  const updateObj = { 
    title,
    content
  };
  // const updateableFields = ['title', 'content'];

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .where('notes.id', id)
    .update(updateObj)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if(result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { 
    title, 
    content 
  };

  /***** validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert(newItem)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      res.json(result).status(201);
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
