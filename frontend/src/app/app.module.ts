import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as $ from 'jquery';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardsComponent } from './boards/boards.component';
import { CardDetailsComponent } from './card-details/card-details.component';
import { DialogOkComponent } from './dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from './dialog/dialog-save-changes';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardComponent } from './board/board.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';

window['$'] = $;

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
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
    BoardComponent,
    DialogSaveChanges,
    CardDetailsComponent,
    DialogOkComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
