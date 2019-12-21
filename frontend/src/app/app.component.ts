import { Component, ViewContainerRef, Inject, ViewChild, ViewChildren } from '@angular/core';
import { LayoutService } from './shared/layout.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ContextViewComponent } from './context-view/context-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild("contextView", {static: false}) contextViewComponent:ContextViewComponent;
  contextViewOn = true;
  TREE_DATA: TreeNode[] = [];
  title = 'popout-ex';

  constructor(
    private viewContainer: ViewContainerRef,
    private layoutService: LayoutService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.setMenu();
    //this.layoutService.ViewContainerRefSetter = this.viewContainer;
    //this.layoutService.setLayout();
  }

  // setMenu () {
  //   let template = [{
  //         label: 'Menu',
  //         submenu: [
  //             {label:'Adjust Notification Value'},
  //             {label:'CoinMarketCap'},
  //             {label:'Exit',
  //               click() { 
  //                 app.quit() 
  //               } 
  //             }
  //         ]
  //     }
  //   ];
  //   var menu = Menu.buildFromTemplate(template)
  //   Menu.setApplicationMenu(menu);
  // }

  dodaj(){
    let conf = {
      type: 'component',
      title: 'Plugin settings',
      tooltip: 'Plugins',
      componentName: 'MainLayout',
      componentState: { component: 'PluginManagerComponent' }
    }
    this.layoutService.addComponent(conf);
  }

  projects(){
    this.contextViewOn = true;
    this.TREE_DATA=[
      {
        name: 'Project 1',
        children: [
          {name: 'Subproject 1'},
          {name: 'Subproject 2'},
          {name: 'Subproject 3'},
        ]
      }, {
        name: 'Project 2',
        children: [
          {
            name: 'Subproject 1',
            children: [
              {name: 'Subsubproject 1'},
              {name: 'Subsubproject 2'},
            ]
          }, {
            name: 'Subproject 2',
            children: [
              {name: 'Subsubproject 1'},
              {name: 'Subsubproject 2'},
            ]
          },
        ]
      },
    ];
    this.contextViewComponent.update(this.TREE_DATA);
  }

  teams(){
    this.contextViewOn = true;
    this.TREE_DATA=[
      {
        name: 'Team 1',
        children: [
          {name: 'Member 1'},
          {name: 'Member 2'},
          {name: 'Member 3'},
        ]
      }, {
        name: 'Team2',
        children: [
          {name: 'Member 1'},
        ]
      },
    ];
    this.contextViewComponent.update(this.TREE_DATA);
  }

  tools(){
    this.contextViewOn = true;
    this.TREE_DATA=[
      {name: 'Tool 1'},
      {name: 'Tool 2'},
      {name: 'Tool 3'},
    ];
    this.contextViewComponent.update(this.TREE_DATA);
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
