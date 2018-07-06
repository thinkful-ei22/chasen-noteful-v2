'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

// Get All Folders
router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

// Get folder by id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex
    .first('id', 'name')////gets the first object in array so no need to destructure array later///??
    .from('folders')
    .where('folders.id', id)
    .then(result => {
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

///Update Folder///
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const {name} = req.body;

  /***** Never trust users - validate input *****/
  const updateObj = { 
    name
  };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update(updateObj)
    .returning(['id', 'name'])
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
  const {name} = req.body;
  const newItem = { 
    name
  };

  /***** validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .insert(newItem)
    .returning(['id', 'name'])
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

  knex('folders')
    .where('id', id)
    .del()
    .then(() => res.sendStatus(204))
    .catch(err => {
      next(err);
    });
});



module.exports = router;