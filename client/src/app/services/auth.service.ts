import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private apollo: Apollo
  ) { }

  get isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  get user(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    this.apollo.client.clearStore().then(() => {
      this.apollo.client.resetStore();
    });
  }

  createUser() {
    return this.http.post(environment.apiUrl + '/user', {});
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.apollo.client.clearStore().then(() => {
      this.apollo.client.resetStore();
      this.router.navigate(['/home']);
    });

  }

}
