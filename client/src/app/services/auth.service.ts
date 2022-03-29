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
    private router: Router
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
  }

  createUser(username: any, avatar: any) {
    return this.http.post(environment.apiUrl + '/user', {
      username,
      avatar
    });
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

}
