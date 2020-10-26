/* eslint-disable import/first */
// require('@babel/register')({extensions: ['.js', '.ts', '.tsx']});
import React from 'react';
import ReactDomServer from 'react-dom/server';
import express, {Router} from 'express';
import webpack from 'webpack';
import isObject from 'is-object';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import configFactory from '../config/webpack.config';
import paths from '../config/paths';
import ignoredFiles from 'react-dev-utils/ignoredFiles';
import App from '../src/App';

const config: webpack.Configuration = configFactory('development') as webpack.Configuration;
const compiler = webpack(config);

const router = Router();

router.use(
    webpackDevMiddleware(compiler, {
      serverSideRender: true,
      // logLevel: 'error',
      publicPath: config.output?.publicPath,
      stats: {
        colors: true,
      },
      watchOptions: {ignored: ignoredFiles(paths.appSrc)},
    }),
);

router.use(
    webpackHotMiddleware(compiler, {log: false, path: `/__webpack_hmr`, heartbeat: 10 * 1000}),
);

router.use(express.static(paths.appPublic));

const normalizeAssets = (assets: {[s: string]: unknown;} | ArrayLike<unknown>) => {
  if (isObject(assets)) {
    return Object.values(assets);
  }

  return Array.isArray(assets) ? assets : [assets];
};

router.use((req, res) => {

  const webpackStats = res.locals.webpackStats;
  const jsonWebpackStats = webpackStats.toJson();
  const {assets} = jsonWebpackStats;

  const app = ReactDomServer.renderToString(<App />);
  const page = (
      <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href={'/favicon.ico'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
            name="description"
            content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href={'/logo192.png'} />
        <link rel="manifest" href={'/manifest.json'} />
        {normalizeAssets(assets)
            .filter(({name}) => name.endsWith('.css'))
            .map(({name}, index) => <link key={index} rel="stylesheet" href={name} />)
            .join('\n')}
        <title>Razer Pay</title>
      </head>
      <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">{app}</div>
      {normalizeAssets(assets)
          .filter(({name}) => name.endsWith('.js'))
          .map(({name}, index) => <script key={index} src={`\\${name}`} />)}
      </body>
      </html>
  );

  const html = `<!DOCTYPE html>${ReactDomServer.renderToString(page)}`;

  res.status(200).send(html);
});

export default router;
