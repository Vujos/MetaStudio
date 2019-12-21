import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import * as $ from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogDataExampleDialog } from './app.component';

import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';

import { LoginComponent } from './login/login.component';
import { LifeCyclesComponent } from './life-cycles/life-cycles.component';
import { ContextViewComponent } from './context-view/context-view.component';

window['$'] = $;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LifeCyclesComponent,
    ContextViewComponent,
    DialogDataExampleDialog
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
    DialogDataExampleDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
