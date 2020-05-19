import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as $ from 'jquery';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardsComponent } from './app/boards/boards.component';
import { CardDetailsComponent } from './app/card-details/card-details.component';
import { DialogOkComponent } from './app/dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from './app/dialog/dialog-save-changes';
import { LoginComponent } from './app/login/login.component';
import { ProfileComponent } from './app/profile/profile.component';
import { ProjectManagerComponent } from './app/project-manager.component';
import { RegisterComponent } from './app/register/register.component';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';

window['$'] = $;

@NgModule({
  declarations: [
    AppComponent,
    ProjectManagerComponent,
    DialogSaveChanges,
    CardDetailsComponent,
    BoardsComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DialogOkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule
  ],
  entryComponents: [
    ProjectManagerComponent,
    DialogSaveChanges,
    CardDetailsComponent,
    DialogOkComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
