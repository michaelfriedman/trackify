'use strict';

const boom = require('boom');

const express = require('express');

const jwt = require('jsonwebtoken');

const knex = require('../knex');

const { camelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.claim = payload;

    next();
  });
};

router.get('/playlists', authorize, (req, res, next) => {
  knex('playlists')
    .innerJoin('tracks', 'tracks.id', 'playlists.track_id')
    .where('playlists.user_id', req.claim.userId)
    .orderBy('tracks.title', 'ASC')
    .then((rows) => {
      const playlists = camelizeKeys(rows);

      res.send(playlists);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
