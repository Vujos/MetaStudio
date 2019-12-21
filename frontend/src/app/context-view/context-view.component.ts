import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-context-view',
  templateUrl: './context-view.component.html',
  styleUrls: ['./context-view.component.scss']
})
export class ContextViewComponent implements OnInit {
  @Input() content = [];

  constructor() { }

  ngOnInit() {

  }

}
