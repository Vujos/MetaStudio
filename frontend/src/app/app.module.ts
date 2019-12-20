import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import * as $ from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';

import { LoginComponent } from './login/login.component';
import { PluginManagerComponent } from './plugin manager/plugin-manager.component';

window['$'] = $;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PluginManagerComponent
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
    PluginManagerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
