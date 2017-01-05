/* eslint consistent-return: 0 */  // --> OFF
/* eslint strict: 0 */  // --> OFF


'use strict';

const express = require('express');

const router = express.Router();

const knex = require('../knex');

router.get('/artists', (_req, res, next) => {
  knex('artists')
    .orderBy('id')
    .then((artists) => {
      res.send(artists);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/artists/:id', (req, res, next) => {
  knex('artists')
    .where('id', req.params.id)
    .first()

    .then((artist) => {
      if (!artist) {
        return next();
      }

      res.send(artist);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/artists', (req, res, next) => {
  knex('artists')
    .insert({ name: req.body.name }, '*')
    .then((artists) => {
      res.send(artists[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/artists/:id', (req, res, next) => {
  knex('artists')
    .where('id', req.params.id)
    .first()
    .then((artist) => {
      if (!artist) {
        return next();
      }

      return knex('artists')
        .update({ name: req.body.name }, '*')
        .where('id', req.params.id);
    })
    .then((artists) => {
      res.send(artists[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/artists/:id', (req, res, next) => {
  let artist;

  knex('artists')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }
      artist = row;

      return knex('artists')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete artist.id;
      res.send(artist);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/artists/:id/tracks', (req, res, next) => {
  knex('tracks')
    .where('artists_id', req.params.id)
    .orderBy('id')
    .then((track) => {
      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
