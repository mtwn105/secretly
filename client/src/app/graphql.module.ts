/* eslint-disable @typescript-eslint/naming-convention */
import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

const uri = environment.graphQlUrl;

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

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
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
