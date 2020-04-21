import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { AdDirective } from './ad.directive';
import { AdItem }      from './ad-item';
import { AdComponent } from './ad.component';
import { AdService } from './ad.service';
import { ProjectManagerComponent } from './project-manager.component';

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.scss']
})
export class AdBannerComponent implements OnInit, OnDestroy {
  ads: AdItem[];
  currentAdIndex = -1;
  @ViewChild(AdDirective, {static: true}) adHost: AdDirective;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private adService: AdService) { }

  ngOnInit() {
    this.ads = this.adService.getAds();
    this.loadComponent();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  addList(){
    const adItem = new AdItem(ProjectManagerComponent, {})
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);

    const viewContainerRef = this.adHost.viewContainerRef;

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<AdComponent>componentRef.instance).data = adItem.data;
  }

  loadComponent() {
    this.ads.forEach(adItem => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);

      const viewContainerRef = this.adHost.viewContainerRef;

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<AdComponent>componentRef.instance).data = adItem.data;
    });
  }

}
