import { Apollo, gql } from 'apollo-angular';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

const GET_CHAT_DETAILS = gql`
query getChat($chat_id: uuid!) {
  chats (where:{chat_id:{_eq: $chat_id}}) {
    id
    chat_id
    user2 {
      id
      user_id
      username
    }
    user1 {
      id
      user_id
      username
    }
    active
    created_at
    last_message_at
    messages {
      chat_id
      from
      created_at
      message
      to
    }
  }
}`;

const GET_MESSAGES = gql`
subscription getMessages($chat_id: Int!, $to_id: Int!, $curr_date: timestamptz!) {
  messages(where: {chat_id: {_eq: $chat_id}, to: {_eq: $to_id}, created_at: {_gte: $curr_date} }, order_by: {created_at: desc}, limit: 1) {
    id
    chat_id
    created_at
    from
    message
    message_id
    to
  }
}
`;

const SEND_MESSAGE = gql`
mutation sendMessage($chat_id: Int!, $from: Int!, $to: Int!, $message: String!) {
  insert_messages_one(object: {chat_id: $chat_id, from: $from, to: $to, message: $message}) {
    id
    chat_id
    created_at
    from
    message
    message_id
    to
  }
}
`;

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.page.html',
  styleUrls: ['./chat-screen.page.scss'],
})
export class ChatScreenPage implements OnInit, AfterViewChecked, OnDestroy {


  @ViewChild('chatContainer') private chatContainer: ElementRef;

  chatId: string;
  querySubscription: any;
  chat: any;

  loggedInUser;
  username: string;

  message;
  messages: any;
  messagesSubscription: any;
  sendMessageSubscription: any;



  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private apollo: Apollo,
    private router: Router
  ) { }


  ngOnInit() {

    const date = new Date().toISOString();

    this.chatId = this.activatedRoute.snapshot.paramMap.get('chat_id');
    this.username = this.activatedRoute.snapshot.paramMap.get('username');

    this.querySubscription = this.apollo.query<any>({
      query: GET_CHAT_DETAILS,
      variables: {
        chat_id: this.chatId
      }
    }).subscribe(({ data }) => {
      this.chat = data?.chats[0];
      this.messages = this.chat?.messages;

      console.log(this.chat);

      this.scrollToBottom();

      this.messagesSubscription = this.apollo.subscribe<any>({
        query: GET_MESSAGES,
        variables: {
          chat_id: this.chat.id,
          to_id: this.loggedInUser.id,
          curr_date: date
        }
      }).subscribe(({ data: messageSubcriptionData }) => {

        console.log(messageSubcriptionData.messages);

        if (messageSubcriptionData.messages.length > 0) {

          this.messages = [...this.messages, messageSubcriptionData.messages[0]];

          // this.messages.push(messageSubcriptionData.messages[0]);
          console.log('message updated');
          this.scrollToBottom();
        }
      });

    });

    this.loggedInUser = this.authService.user;

  }

  sendMessage() {

    console.log(this.message);

    const trimmedMessage = this.message.trim();

    if (trimmedMessage.length === 0) {
      return;
    }

    this.message = '';



    this.sendMessageSubscription = this.apollo.mutate<any>({
      mutation: SEND_MESSAGE,
      variables: {
        chat_id: this.chat.id,
        from: this.loggedInUser.id,
        to: (this.loggedInUser.username === this.chat?.user2?.username ? this.chat?.user1?.id : this.chat?.user2?.id),
        message: trimmedMessage
      }
    }).subscribe(({ data }) => {
      this.messages = [...this.messages, data.insert_messages_one];
      console.log('message sent');
      this.scrollToBottom();
    }
      , (error) => {
        console.log(error);
      }
    );

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      // this.chatContainer.nativeElement.scrollTop = Math.max(0, this.chatContainer.nativeElement.scrollHeight - this.chatContainer.nativeElement.offsetHeight);
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;

      // console.log(
      //   this.chatContainer.nativeElement.scrollTop, this.chatContainer.nativeElement.scrollHeight
      // );

    } catch (err) { }
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.sendMessageSubscription) {
      this.sendMessageSubscription.unsubscribe();
    }
  }

}
