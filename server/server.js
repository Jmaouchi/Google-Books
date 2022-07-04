const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const path = require('path');
const db = require('./config/connection');

const { typeDefs, resolvers } = require('./schemas'); // get the queries and mutations from the schema folder
const { authMiddleware } = require('./utils/auth'); // get the token from the auth file 

const PORT = process.env.PORT || 3001;


const server = new ApolloServer({ // attach the apolloServer to the express server, to get the data 
  typeDefs,
  resolvers,
  context: authMiddleware
});
const app = express();

// connect both servers and add the token context to it
server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}




// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

