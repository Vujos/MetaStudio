import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisionComponent } from './vision/vision.component';
import { LifeCyclesComponent } from './life-cycles/life-cycles.component';
import { ProjectManagerComponent } from './app/project-manager.component';


const routes: Routes = [
  { path: '', component: LifeCyclesComponent },
  { path: 'vision', component: VisionComponent },
  { path: 'projectManager', component: ProjectManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
