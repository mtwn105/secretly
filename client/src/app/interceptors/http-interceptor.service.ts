import { ToastController } from '@ionic/angular';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    // if (!token || !user) {
    //   return next.handle(req);
    // }

    const authReq = req.clone({
      // headers: new HttpHeaders(this.getHeaders())
    });

    console.log('Intercepted HTTP call', authReq);

    return next.handle(authReq).pipe(
      catchError(
        (err, caught) => {
          if (err.status === 401) {
            this.handleAuthError();
            return of(err);
          }
          throw err;
        }
      )
    );
  }

  getHeaders = () => {

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

  async handleAuthError() {
    const toast = await this.toastController.create({
      message: 'You are not authorized to view this.',
      duration: 3000
    });
    toast.present();
    this.authService.signOut();
  }
}
