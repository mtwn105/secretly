import { ToastController } from '@ionic/angular';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
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

    return next.handle(req).pipe(
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

  async handleAuthError() {
    const toast = await this.toastController.create({
      message: 'You are not authorized to view this.',
      duration: 3000
    });
    toast.present();
    this.authService.signOut();
  }
}
