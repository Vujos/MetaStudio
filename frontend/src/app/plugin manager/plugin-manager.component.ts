import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { PluginConfig } from './plugin-config.model';
import { SelectionModel } from '@angular/cdk/collections';

//const fs = (<any>window).require("fs");

@Component({
  selector: 'app-plugin-manager',
  templateUrl: './plugin-manager.component.html',
  styleUrls: ['./plugin-manager.component.scss']
})
export class PluginManagerComponent implements OnInit {

  displayedColumns: string[] = ['name', 'author', 'version', 'status'];
  plugins: MatTableDataSource<PluginConfig>;
  selection = new SelectionModel<PluginConfig>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() {
    this.plugins = new MatTableDataSource();
  }

  ngOnInit() {
    this.getPluginList().then((data: PluginConfig[]) => {
      this.plugins.data = data;
      this.plugins.paginator = this.paginator;
      this.plugins.sort = this.sort;
      this.selection = new SelectionModel<PluginConfig>(true, [this.plugins.data[6]]);
    }).catch(function (reject) {
      console.log(reject);
    });
  }

  getPluginList(): Promise<PluginConfig[]> {
    /*return new Promise(function (resolve, reject) {
      fs.readFile("\plugin_conf.json", "utf8", function (err, data) {
        if (err)
          reject(err);
        else {
          resolve(<Array<PluginConfig>>JSON.parse(data));
        }
      });
    });*/
    return;
  }

  applyFilter(filterValue: string) {
    this.plugins.filter = filterValue.trim().toLowerCase();

    if (this.plugins.paginator) {
      this.plugins.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.plugins.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.plugins.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PluginConfig): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

}
