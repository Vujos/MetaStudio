import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './app/boards/boards.component';
import { ProjectManagerComponent } from './app/project-manager.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { ProfileComponent } from './app/profile/profile.component';


const routes: Routes = [
  { path: '', component: BoardsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'boards', component: BoardsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'projectManager/:id', component: ProjectManagerComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
