/* eslint-disable no-console */

'use strict';

const express = require('express');

const path = require('path');

const port = process.env.PORT || 8000;

const morgan = require('morgan');

const bodyParser = require('body-parser');

const artists = require('./routes/artists');

const tracks = require('./routes/tracks');

const app = express();

app.disable('x-powered-by');

app.use(morgan('short'));

app.use(bodyParser.json());

app.use(express.static(path.join('public')));

app.use(artists);
app.use(tracks);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res
      .status(err.status)
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
