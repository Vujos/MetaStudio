import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import * as $ from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, LoginDialog } from './app.component';

import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';

import { LoginComponent } from './login/login.component';
import { UserAddEditComponent } from './user/user-add-edit/user-add-edit.component';
import { LifeCyclesComponent } from './life-cycles/life-cycles.component';
import { ContextViewComponent } from './context-view/context-view.component';
import { PluginManagerComponent } from './plugin manager/plugin-manager.component';
import { VisionComponent } from './vision/vision.component';


import { AdBannerComponent }    from './app/ad-banner.component';
import { ProjectManagerComponent } from './app/project-manager.component';
import { AdDirective }          from './app/ad.directive';
import { AdService }            from './app/ad.service';
import { DialogSaveChanges } from './app/dialog/dialog-save-changes';
import { CardDetailsComponent } from './app/card-details/card-details.component';
import { BoardsComponent } from './app/boards/boards.component';


window['$'] = $;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserAddEditComponent,
    LifeCyclesComponent,
    ContextViewComponent,
    LoginDialog,
    PluginManagerComponent,
    VisionComponent,
    AdBannerComponent,
    ProjectManagerComponent,
    AdDirective,
    DialogSaveChanges,
    CardDetailsComponent,
    BoardsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule
  ],
  entryComponents: [
    LoginComponent,
    LifeCyclesComponent,
    PluginManagerComponent,  
    ProjectManagerComponent,
    LoginDialog,
    DialogSaveChanges,
    CardDetailsComponent
  ],
  providers: [AdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
