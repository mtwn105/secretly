import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatInvitePage } from './chat-invite.page';

const routes: Routes = [
  {
    path: '',
    component: ChatInvitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatInvitePageRoutingModule {}
