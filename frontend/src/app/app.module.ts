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
import { PluginManagerComponent } from './plugin manager/plugin-manager.component';
import { VisionComponent } from './vision/vision.component';


import { AdBannerComponent }    from './app/ad-banner.component';
import { HeroProfileComponent } from './app/hero-profile.component';
import { AdDirective }          from './app/ad.directive';
import { AdService }            from './app/ad.service';


window['$'] = $;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LifeCyclesComponent,
    ContextViewComponent,
    DialogDataExampleDialog,
    PluginManagerComponent,
    VisionComponent,
    AdBannerComponent,
    HeroProfileComponent,
    AdDirective
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
    DialogDataExampleDialog,
    PluginManagerComponent,  
    HeroProfileComponent
  ],
  providers: [AdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
