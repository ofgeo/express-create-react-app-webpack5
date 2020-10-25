import {Router} from 'express';

const graphql = Router();

graphql.get('*', (_, res) => {
  res.status(200).send('Hello GraphQL');
});

export default graphql;
