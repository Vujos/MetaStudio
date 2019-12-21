import { Injectable, ViewContainerRef, ComponentFactoryResolver, Type, ChangeDetectorRef } from '@angular/core';

import * as GoldenLayout from 'golden-layout';
//const fs = (<any>window).require("fs");

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private layout: any;
    public viewContainer: ViewContainerRef;

    set ViewContainerRefSetter(vcr: ViewContainerRef) {
        this.viewContainer = vcr;
    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver) {
    }

    setLayout() {
        const savedState = localStorage.getItem('savedState');
        if(savedState){
            try {
                this.layout = new GoldenLayout(JSON.parse(savedState), document.getElementById('layout'));
                // this.setDefaultLayout();
            }
            catch(error){
                this.setDefaultLayout();
            }
        }
        else{
            this.setDefaultLayout();
        }
        var cmp = this.componentFactoryResolver;
        var vc = this.viewContainer;
        this.layout.registerComponent('MainLayout', function (container, state) {
            const factories = Array.from(cmp['_factories'].keys());
            const factoryClass = <Type<any>>factories.find((x: any) => x.name === state.component);
            let factory = cmp.resolveComponentFactory(factoryClass);

            let compRef = vc.createComponent(factory);
            container.getElement().append($(compRef.location.nativeElement));
        });

        this.layout.on('tabCreated', function (tab) {
            tab.element.attr('title', tab.contentItem.config.tooltip);
        });

        this.layout.on('stateChanged', () => {
            var state = JSON.stringify(this.layout.toConfig());
            localStorage.setItem('savedState', state);
        });

        this.layout.init();
    }

    setDefaultLayout(){
        //const data = fs.readFileSync("\layout_conf.json", "utf8");
        //this.layout = new GoldenLayout(JSON.parse(data), document.getElementById('layout'));
    }

    addComponent(config) {
        this.layout.root.contentItems[0].addChild(config);
    }
}