/* eslint-disable import/first */
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

require('../config/env');
const express = require('express');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const hotRouterMiddleware = require('../config/hot-router-middleware');

const config = configFactory('development');
const compiler = webpack(config);

const app = express();

const PORT = 3000;

app.use(
    webpackDevMiddleware(compiler, {
      // logLevel: 'error',
      serverSideRender: true,
      publicPath: config.output.publicPath,
      stats: {
        colors: true,
      },
      watchOptions: {ignored: ignoredFiles(paths.appSrc)},
    }),
);

app.use(
    webpackHotMiddleware(compiler,
        {log: false, path: `/__webpack_hmr`, heartbeat: 10 * 1000}),
);

// app.use(express.static(paths.appPublic));

app.use(hotRouterMiddleware);

app.listen(PORT, () => {
  console.log(`Razer Pay Web Apps listening at http://localhost:${PORT}`);
});
