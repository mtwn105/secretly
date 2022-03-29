import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatScreenPage } from './chat-screen.page';

const routes: Routes = [
  {
    path: '',
    component: ChatScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatScreenPageRoutingModule {}
