import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { TeamComponent } from './team/team.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from './lower-case-url-serializer';
import { PieChartComponent } from './pie-chart/pie-chart.component';

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
    DialogOkComponent,
    TeamComponent,
    ProfileDetailsComponent,
    PieChartComponent
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
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
