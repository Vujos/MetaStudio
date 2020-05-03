import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './app/boards/boards.component';
import { LifeCyclesComponent } from './life-cycles/life-cycles.component';
import { VisionComponent } from './vision/vision.component';
import { ProjectManagerComponent } from './app/project-manager.component';


const routes: Routes = [
  { path: '', component: LifeCyclesComponent },
  { path: 'vision', component: VisionComponent },
  { path: 'boards', component: BoardsComponent },
  { path: 'projectManager/:id', component: ProjectManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
