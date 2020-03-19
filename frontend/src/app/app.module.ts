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
    VisionComponent
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
    LoginDialog,
    PluginManagerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
