import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TeamComponent } from './team/team.component';


const routes: Routes = [
  { path: '', component: BoardsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'boards', component: BoardsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'board/:id', component: BoardComponent },
  { path: 'team/:id', component: TeamComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
