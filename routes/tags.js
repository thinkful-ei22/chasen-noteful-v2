'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

/* ========== GET ALL TAGS ========== */

router.get('/', (req, res, next) =>{
  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET TAG BY ID ========== */

router.get('/:id', (req, res, next) =>{
  const {id} = req.params;
  knex.first('id', 'name')
    .from('tags')
    .where('id', id)
    .then(result => {
      if (result){
        res.json(result);
      }else{
        next();
      }
    })  
    .catch(err => next(err));
});

/* ========== UPDATE TAG ========== */

router.put('/:id', (req,res,next) => {
  const {id} = req.params;
  const { name } = req.body;
  const updateObj = {
    name
  };

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .where('id', id)
    .update(updateObj)
    .returning(['id', 'name'])
    .then(([result]) => {
      if (result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => next(err));
});


/* ========== POST/CREATE TAG ========== */
router.post('/', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

/* ========== DELETE TAG ========== */

router.delete('/:id', (req,res,next) =>  {
  const {id} = req.params;
  
  knex('tags')
    .where('id', id)
    .del()
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});





module.exports= router;