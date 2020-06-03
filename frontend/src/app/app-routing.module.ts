import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TeamComponent } from './team/team.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';


const routes: Routes = [
  { path: '', component: BoardsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'board/:id', component: BoardComponent },
  { path: 'board/:id/:listId/:cardId', component: BoardComponent },
  { path: 'card/:id/:listIndex/:cardIndex', component: BoardComponent },
  { path: 'card/:id/:listIndex/:cardIndex/:tabIndex', component: BoardComponent },
  { path: 'profile/:idUser', component: ProfileDetailsComponent },
  { path: 'team/:id', component: TeamComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
