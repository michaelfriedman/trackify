'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/tracks', (_req, res, next) => {
  knex('tracks')
    .orderBy('id')
    .then((tracks) => {
      res.send(tracks);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/tracks/:id', (req, res, next) => {
  knex('tracks')
    .where('id', req.params.id)
    .first()
    .then((track) => {
      if (!track) {
        return next();
      }

      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/tracks', (req, res, next) => {
  knex('artists')
    .where('id', req.body.artist_id)
    .first()
    .then((artist) => {
      if (!artist) {
        const err = new Error('artist_id does not exist');

        err.status = 400;

        throw err;
      }

      return knex('tracks')
        .insert({
          artist_id: req.body.artist_id,
          title: req.body.title,
          likes: req.body.likes
        }, '*');
    })
    .then((tracks) => {
      res.send(tracks[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/tracks/:id', (req, res, next) => {
  knex('tracks')
    .where('id', req.params.id)
    .first()
    .then((track) => {
      if (!track) {
        return next();
      }

      return knex('artists')
        .where('id', req.body.artist_id)
        .first();
    })
    .then((artist) => {
      if (!artist) {
        const err = new Error('artist_id does not exist');

        err.status = 400;

        throw err;
      }

      return knex('tracks')
        .update({
          artist_id: req.body.artist_id,
          title: req.body.title,
          likes: req.body.likes
        }, '*')
        .where('id', req.params.id);
    })
    .then((tracks) => {
      res.send(tracks[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/tracks/:id', (req, res, next) => {
  let track;

  knex('tracks')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }

      track = row;

      return knex('tracks')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete track.id;
      res.send(track);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
