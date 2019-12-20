import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-life-cycles',
  templateUrl: './life-cycles.component.html',
  styleUrls: ['./life-cycles.component.scss']
})
export class LifeCyclesComponent implements OnInit {

  panelOpenState = false;
  isLinear = false;

  lifeCycles = [
    {
      "name":"Waterfall model", 
      "processes":[
        {"name":"Requirements"}, 
        {"name":"System design"}, 
        {"name":"Program design"}]
    },
    {
      "name":"V model", 
      "processes":[
        {"name":"Requirements"}, 
        {"name":"System design"}, 
        {"name":"Program design"}]
    }
  ];

  todo = [
    'Requirements',
    'System design',
    'Program design'
  ];

  done = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  constructor() { }

  ngOnInit() {

  }

}
