import { Injectable, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';

import * as GoldenLayout from 'golden-layout';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private layout: any;
    public viewContainer: ViewContainerRef;

    set printPortalRef(vcr: ViewContainerRef) {
        this.viewContainer = vcr;
    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver) {
    }

    setLayout() {
        const savedState = localStorage.getItem('savedState');
        if(savedState){
            this.layout = new GoldenLayout(JSON.parse(savedState), document.getElementById('layout'));
        }
        else{
            let config = {
                content: [{
                    type: 'row',
                    content: [{
                        type: 'component',
                        title: 'First one title',
                        componentName: 'MainLayout',
                        componentState: {
                            component: 'LoginComponent'
                        }
                    }, {
                        type: 'column',
                        content: [{
                            type: 'component',
                            title: 'Second one title',
                            tooltip: 'Second one tooltip',
                            componentName: 'MainLayout',
                            componentState: {
                                component: 'LoginComponent'
                            }
                        }]
                    }]
                }]
            };
            this.layout = new GoldenLayout(config, document.getElementById('layout'));
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

    addConponent(config) {
        this.layout.root.contentItems[0].addChild(config);
    }
}