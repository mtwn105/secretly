import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const GET_CHATS = gql`
  subscription getChats {
  chats(order_by: {last_message_at: desc}) {
    id
    chat_id
    user2 {
      user_id
      username
    }
    user1 {
      user_id
      username
    }
    active
    created_at
    last_message_at
    messages(limit: 1, order_by: {created_at: desc}) {
      created_at
      from
      message
    }
  }
}
`;

const DELETE_USER = gql`
  mutation deleteUser($user_id: Int!) {
  delete_users(where: {id: {_eq: $user_id}}) {
    affected_rows
  }
}`;

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit, OnDestroy {

  secretlyLink = environment.appUrl;

  chats;
  loggedInUser;
  chatsSubscription: any;

  constructor(
    public authService: AuthService,
    private toastController: ToastController,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    this.secretlyLink += '/chats/invite/' + this.authService.user.user_id;

    this.loggedInUser = this.authService.user;

    this.getChats();


  }

  getChats() {

    this.chatsSubscription = this.apollo.subscribe<any>({
      query: GET_CHATS,
    }).subscribe(({ data }) => {
      // console.log('chats', data);

      // sort my message created at desc
      data.chats.sort((a: any, b: any) => new Date(b.messages[0]?.created_at).getTime() - new Date(a.messages[0]?.created_at).getTime());

      this.chats = data.chats;
    }, async error => {
      const toast = await this.toastController.create({
        message: 'There is some error. Please try again later.',
        duration: 3000
      });
      toast.present();
    });

  }

  openChat(chat) {
    console.log(chat);

    this.router.navigateByUrl('/chat/' + (this.loggedInUser.username === chat?.user2?.username ? chat?.user1?.username : chat?.user2?.username) + '/' + chat.chat_id);

  }

  async copyLink() {
    navigator.clipboard.writeText(this.secretlyLink);
    const toast = await this.toastController.create({
      message: 'Link copied to clipboard.',
      duration: 3000
    });
    toast.present();
  }

  signOut() {

    this.apollo.mutate({
      mutation: DELETE_USER,
      variables: {
        user_id: this.loggedInUser.id
      }
    }).subscribe(({ data }) => {
      console.log('delete user', data);
      this.authService.signOut();
    }
      , async error => {
        const toast = await this.toastController.create({
          message: 'There is some error. Please try again later.',
          duration: 3000
        });
        toast.present();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.chatsSubscription) {
      this.chatsSubscription.unsubscribe();
    }
  }

}
