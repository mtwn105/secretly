import { ToastController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const GET_USER = gql`
query getUser($user_id: uuid!) {
  users (where:{user_id:{_eq: $user_id}}) {
    id
    username
  }
}`;

const CREATE_CHAT = gql`
mutation createChat($user_1: Int!, $user_2: Int!) {
  insert_chats_one(object: {user_1: $user_1, user_2: $user_2, active: true}) {
    id
    chat_id
    active
    created_at
  }
}
`;

@Component({
  selector: 'app-chat-invite',
  templateUrl: './chat-invite.page.html',
  styleUrls: ['./chat-invite.page.scss'],
})
export class ChatInvitePage implements OnInit {
  inviteUserId: string;
  inviteUsername: string;
  inviteUserIdId: number;
  sameUser: boolean;
  username: any;
  querySubscription: any;

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.inviteUserId = this.activatedRoute.snapshot.paramMap.get('user_id');

    this.querySubscription = this.apollo.query<any>({
      query: GET_USER,
      variables: {
        user_id: this.inviteUserId
      }
    })
      .subscribe(({ data }) => {
        this.inviteUsername = data?.users[0]?.username;
        this.inviteUserIdId = data?.users[0]?.id;
        console.log('username', this.inviteUsername);
      });

    if (this.authService.isLoggedIn) {
      if (this.inviteUserId === this.authService.user.user_id) {
        this.sameUser = true;
      }
    }

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

      // Create chat with user
      this.createChat();

      // this.router.navigate(['/chats']);
    }, async (error) => {

      const toast = await this.toastController.create({
        message: 'There is some error. Please try again later.',
        duration: 3000
      });
      toast.present();

    });

  }

  createChat() {

    this.apollo.mutate<any>({
      mutation: CREATE_CHAT,
      variables: {
        user_1: this.authService.user.id,
        user_2: this.inviteUserIdId
      }
    })
      .subscribe(({ data }) => {
        console.log('chat created', data);
      });

  }

}
