import { Component, ViewContainerRef, OnInit, OnDestroy, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import { LayoutService } from './shared/layout.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  contextViewOn = true;
  content = ["CONTEXT VIEW"];
  title = 'popout-ex';
  constructor(
    private viewContainer: ViewContainerRef,
    private layoutService: LayoutService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    //this.layoutService.printPortalRef = this.viewContainer;
    //this.layoutService.setLayout();
  }

  ngOnDestroy() {

  }

  dodaj(){
    let conf = {
      type: 'component',
      title: 'Title example',
      tooltip: 'Tooltip example',
      componentName: 'MainLayout',
      componentState: { component: 'LoginComponent' }
    }
    this.layoutService.addConponent(conf);
  }

  projects(){
    this.contextViewOn = true;
    this.content=["Project 1", "Project 2", "Project 3"];
  }

  teams(){
    this.contextViewOn = true;
    this.content=["Team 1", "Team 2"];
  }

  tools(){
    this.contextViewOn = true;
    this.content=["Tool 1", "Tool 2", "Tool 3", "Tool 4", "Tool 5", "Tool 6"];
  }

  contextView(){
    this.contextViewOn = !this.contextViewOn
  }

  openLoginDialog() {
    this.dialog.open(DialogDataExampleDialog, {

    });
  }
}

export interface DialogData {
  
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
