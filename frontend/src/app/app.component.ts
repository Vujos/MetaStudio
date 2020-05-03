import { Component, ViewContainerRef, Inject, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { LayoutService } from './shared/layout.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ContextViewComponent } from './context-view/context-view.component';
import { SharedDataService } from './shared/shared-data.service';

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

  // menu
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;

  constructor(
    private viewContainer: ViewContainerRef,
    private layoutService: LayoutService,
    public dialog: MatDialog,
    private ren: Renderer2,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    // this.setMenu();
    //this.layoutService.ViewContainerRefSetter = this.viewContainer;
    //this.layoutService.setLayout();
    this.sharedDataService.contextViewOn = this.contextViewOn;
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
    this.sharedDataService.contextViewOn = this.contextViewOn;
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
    this.sharedDataService.contextViewOn = this.contextViewOn;
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
    this.sharedDataService.contextViewOn = this.contextViewOn;
    this.TREE_DATA=[
      {name: 'Vision', route: '/vision'},
      {name: 'Project Manager', route: '/boards'},
      {name: 'Tool 3'}
    ];
    this.contextViewComponent.update(this.TREE_DATA);
  }

  contextView(){
    this.contextViewOn = !this.contextViewOn
    this.sharedDataService.contextViewOn = this.contextViewOn;
  }

  openLoginDialog() {
    this.dialog.open(LoginDialog, {panelClass: 'myapp-no-padding-dialog'});
  }


  // menu
  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1, trigger2, button) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100)
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu()
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }



}

export interface DialogData {
  
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login/login-dialog.html',
  styleUrls: ['login/login-dialog.scss']
})
export class LoginDialog {
  constructor(public dialog: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onClose(): void {
    this.dialog.close();
  }
}
