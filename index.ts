import { ApolloServer, PubSub } from 'apollo-server-express';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { users } from './db';
import schema from './schema';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/_ping', (req, res) => {
  res.send('pong');
});

const pubsub = new PubSub();
const server = new ApolloServer({
  schema,
  context: () => ({
    currentUser: users.find((u) => u.id === '1'),
    pubsub
  })
});

server.applyMiddleware({
  app,
  path: '/graphql'
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
