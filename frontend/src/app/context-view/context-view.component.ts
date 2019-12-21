import { Component, OnInit, Input } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

@Component({
  selector: 'app-context-view',
  templateUrl: './context-view.component.html',
  styleUrls: ['./context-view.component.scss']
})
export class ContextViewComponent implements OnInit {
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  TREE_DATA: TreeNode[] = [
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

  constructor() {
    this.dataSource.data = this.TREE_DATA;
  }

  ngOnInit() {

  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  update(TREE_DATA: TreeNode[]){
    this.dataSource.data = TREE_DATA;
  }

}