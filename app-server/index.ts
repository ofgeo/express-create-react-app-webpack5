/* eslint-disable import/first */

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import('../config/env');
import express from 'express';
import router from './router.development';

const app = express();
const PORT = 3000;


app.use('/graphql', (req, res, next) => {
  res.send('Hello Graphql2');
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Razer Pay Web Apps listening at http://localhost:${PORT}`);
});
