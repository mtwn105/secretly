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

  constructor(
    private authService: AuthService,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  createUser() {
    this.authService.createUser().subscribe(async (res: any) => {
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
