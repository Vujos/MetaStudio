import { Component, ViewContainerRef, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
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
    this.layoutService.printPortalRef = this.viewContainer;
    this.layoutService.setLayout();
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
}
