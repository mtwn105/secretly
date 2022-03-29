import { GraphQLModule } from './../../graphql.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatInvitePageRoutingModule } from './chat-invite-routing.module';

import { ChatInvitePage } from './chat-invite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatInvitePageRoutingModule,
    GraphQLModule
  ],
  declarations: [ChatInvitePage]
})
export class ChatInvitePageModule { }
