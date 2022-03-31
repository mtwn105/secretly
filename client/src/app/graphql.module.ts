/* eslint-disable @typescript-eslint/naming-convention */
import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';

const httpsUri = environment.graphQlUrl;
const wssUri = environment.graphQlUrlSubscription;

const createApollo = (httpLink: HttpLink) => {

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user || !JSON.parse(user).id) {
      return {
        headers: {
          'X-Hasura-Role': 'anonymous',
        }
      };
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
    }
  });

  const getHeaders = () => {

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user || !JSON.parse(user).id) {
      return {
        Accept: 'charset=utf-8',
        'X-Hasura-Role': 'anonymous',
      };
    } else {
      return {
        Accept: 'charset=utf-8',
        Authorization: `Bearer ${token}`,
      };
    }
  };

  // Create an http link:
  const http = httpLink.create({
    uri: httpsUri,
    // headers: new HttpHeaders(getHeaders()),
  });

  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: wssUri,
    options: {
      reconnect: true,
      lazy: true,
      timeout: 30000,
      inactivityTimeout: 30000,
      connectionParams: () => ({ headers: getHeaders() }),
    },
  });

  const link = ApolloLink.from([basic, auth, ApolloLink.split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    ws,
    http,
  )]);

  const cache = new InMemoryCache();

  return {
    link,
    cache
  };
};

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule { }
