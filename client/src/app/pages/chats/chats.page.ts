import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

// We use the gql tag to parse our query string into a query document
const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
    }
  }
`;

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit, OnDestroy {

  secretlyLink = environment.appUrl;

  constructor(
    public authService: AuthService,
    private toastController: ToastController,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.secretlyLink += '/chats/invite/' + this.authService.user.user_id;
  }

  async copyLink() {
    navigator.clipboard.writeText(this.secretlyLink);
    const toast = await this.toastController.create({
      message: 'Link copied to clipboard.',
      duration: 3000
    });
    toast.present();
  }

  ngOnDestroy(): void {

  }

}
