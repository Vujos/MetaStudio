import { Component, ViewContainerRef } from '@angular/core';
import { LayoutService } from './shared/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'popout-ex';
  constructor(
    private viewContainer: ViewContainerRef,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    // this.setMenu();
    this.layoutService.ViewContainerRefSetter = this.viewContainer;
    this.layoutService.setLayout();
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
}
