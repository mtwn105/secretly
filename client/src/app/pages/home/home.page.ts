import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  username;

  constructor(
    private authService: AuthService,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  createUser() {
    console.log('creating user: ' + this.username);

    this.username = this.username.trim();

    this.authService.createUser(this.username, 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png').subscribe(async (res: any) => {
      const response = res.data;
      this.authService.login(response);

      const toast = await this.toastController.create({
        message: 'Your profile has been created successfully.',
        duration: 3000
      });
      toast.present();

      this.router.navigate(['/chats']);
    }, async (error) => {

      const toast = await this.toastController.create({
        message: 'There is some error. Please try again later.',
        duration: 3000
      });
      toast.present();

    });

  }

}
