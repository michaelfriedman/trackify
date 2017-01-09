const boom = require('boom');

const bcrypt = require('bcrypt-as-promised');

const express = require('express');

const knex = require('../knex');

const { camelizeKeys } = require('humps');

const router = express.Router();

router.post('/token', (req, res, next) => {
  let user;

  const { email, password } = req.body;

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
      delete user.hashedPassword;

      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
