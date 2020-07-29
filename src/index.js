import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import Routes from "./routes";
import * as serviceWorker from "./serviceWorker";
// import ApolloClient from "apollo-boost";
import "semantic-ui-css/semantic.min.css";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
  // ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const middlewareLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-token": token,
      "x-token-refresh": refreshToken,
    },
  };
});

const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get("x-token");
    const refreshToken = headers.get("x-token-refresh");

    if (token) {
      localStorage.setItem("token", token);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  return forward(operation);
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
