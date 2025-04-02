import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const BASE_URL = "http://localhost:5000";

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${BASE_URL}/graphql`,
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
});

export default client;
