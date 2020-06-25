import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TeamComponent } from './team/team.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { AdminComponent } from './admin/admin.component';
import { RoleGuard } from './auth/role.guard';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: BoardsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'board/:id', component: BoardComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'board/:id/:listId/:cardId', component: BoardComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'card/:id/:listIndex/:cardIndex', component: BoardComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'card/:id/:listIndex/:cardIndex/:tabIndex', component: BoardComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'profile/:idUser', component: ProfileDetailsComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'team/:id', component: TeamComponent, canActivate: [RoleGuard], data: { expectedRoles: ['user'] } },
  { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin'] } },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
