/* eslint-disable import/first */

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import('../config/env');
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import configFactory from '../config/webpack.config';
import paths from '../config/paths';
import ignoredFiles from 'react-dev-utils/ignoredFiles';

const config: webpack.Configuration = configFactory('development') as webpack.Configuration;
const compiler = webpack(config);

const app = express();

const PORT = 3000;

app.use(
    webpackDevMiddleware(compiler, {
      // logLevel: 'error',
      publicPath: config.output?.publicPath,
      stats: {
        colors: true,
      },
      watchOptions: {ignored: ignoredFiles(paths.appSrc)},
    }),
);

app.use(
    webpackHotMiddleware(compiler, {log: false, path: `/__webpack_hmr`, heartbeat: 10 * 1000}),
);

app.use(express.static(paths.appPublic));

app.use('/graphql', (req, res, next) => {
  res.send('Hello Graphql2');
});

app.listen(PORT, () => {
  console.log(`Razer Pay Web Apps listening at http://localhost:${PORT}`);
});
