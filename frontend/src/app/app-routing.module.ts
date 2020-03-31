import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisionComponent } from './vision/vision.component';
import { LifeCyclesComponent } from './life-cycles/life-cycles.component';
import { AdBannerComponent } from './app/ad-banner.component';
import { HeroProfileComponent } from './app/hero-profile.component';


const routes: Routes = [
  { path: '', component: LifeCyclesComponent },
  { path: 'vision', component: VisionComponent },
  { path: 'projectManager', component: HeroProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
