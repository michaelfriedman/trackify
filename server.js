/* eslint-disable no-console */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const path = require('path');

const port = process.env.PORT || 8000;

const app = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const artists = require('./routes/artists');

const tracks = require('./routes/tracks');

const playlists = require('./routes/playlists');

const users = require('./routes/users');

const token = require('./routes/token');

app.use(bodyParser.json());

app.use(cookieParser());

app.use(users);

app.disable('x-powered-by');

app.use(morgan('short'));

app.use(express.static(path.join('public')));

app.use(artists);

app.use(tracks);

app.use(token);

app.use(playlists);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
