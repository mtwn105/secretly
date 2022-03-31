import { ToastController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class ChatInvitePage implements OnInit, OnDestroy {
  inviteUserId: string;
  inviteUsername: string;
  inviteUserIdId: number;
  sameUser: boolean;
  // username: any;
  querySubscription: any;
  createChatSubscription: any;

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {

    this.inviteUserId = this.activatedRoute.snapshot.paramMap.get('user_id');

    if (this.authService.isLoggedIn) {
      if (this.inviteUserId === this.authService.user.user_id) {
        this.sameUser = true;
      }
    }

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

      this.getUserDetailsAndCreateChat();
      // this.router.navigate(['/chats']);
    }, async (error) => {

      const toast = await this.toastController.create({
        message: 'There is some error. Please try again later.',
        duration: 3000
      });
      toast.present();

    });

  }

  getUserDetailsAndCreateChat() {
    this.querySubscription = this.apollo.query<any>({
      query: GET_USER,
      variables: {
        user_id: this.inviteUserId
      },
      fetchPolicy: 'network-only',
    }).subscribe(({ data }) => {
      this.inviteUsername = data?.users[0]?.username;
      this.inviteUserIdId = data?.users[0]?.id;
      console.log('username', this.inviteUsername);

      // Create chat with user
      this.createChat();
    });
  }

  createChat() {

    this.createChatSubscription = this.apollo.mutate<any>({
      mutation: CREATE_CHAT,
      variables: {
        user_1: this.authService.user.id,
        user_2: this.inviteUserIdId
      }
    })
      .subscribe(async ({ data }) => {
        console.log('chat created', data);

        const toast = await this.toastController.create({
          message: 'You can now chat secretly with ' + this.inviteUsername + '.',
          duration: 3000
        });
        toast.present();

        this.router.navigate(['/chats']);

      }, async (error) => {

        console.log(error.message);

        if (!!error.message && error.message.includes('Uniqueness violation')) {
          const toast = await this.toastController.create({
            message: 'You are already connected with ' + this.inviteUsername + '.',
            duration: 3000
          });
          toast.present();
          this.router.navigate(['/chats']);
        } else {
          const toast = await this.toastController.create({
            message: 'There is some error. Please try again later.',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.createChatSubscription) {
      this.createChatSubscription.unsubscribe();
    }
  }

}
