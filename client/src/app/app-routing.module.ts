import { ChatInvitePage } from './pages/chat-invite/chat-invite.page';
import { ChatScreenPage } from './pages/chat-screen/chat-screen.page';
import { ChatsPage } from './pages/chats/chats.page';
import { AuthGuard } from './guards/auth.guard';
import { HomePage } from './pages/home/home.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'chats', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'chats', component: ChatsPage, canActivate: [AuthGuard] },
  { path: 'chats/invite/:user_id', component: ChatInvitePage },
  { path: 'chat/:username/:chat_id', component: ChatScreenPage, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
