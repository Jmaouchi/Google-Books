import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

function App() {
  return (
    <ApolloProvider client={client}> 
      <Router>
        <>
          <Navbar />
            <Routes>
              <Route path='/' element={<SearchBooks />} />
              <Route path='/saved' element={<SavedBooks />} />
              <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} />
            </Routes>
        </>
      </Router>
    </ApolloProvider>  
  );
}

// set httpLink to get the data 
const httpLink = createHttpLink({
  uri: '/graphql',  // uri stands for Uniform Resource Identifier
});

// set the authLink to get the token from localStorage
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// instruct the Apollo instance in App.js to retrieve this token every time we make a GraphQL request,
// this will return the token everytime we make a request to the DB
const client = new ApolloClient({ // create the connection from the client server to the api endpoint or graphql server that will give us the data
  // combine both authLink and httpLink 
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // if he we get the data this will save it for next time 
});


export default App;
