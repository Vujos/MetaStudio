import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Role } from '../models/role.model';
import { DialogService } from '../shared/dialog.service';
import { RoleService } from '../shared/role.service';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild('roleNameInput') roleNameElement: ElementRef;

  loading = true;
  length: number;
  roleName = "";
  roles: Role[] = [];
  displayedColumns: string[] = ['no', 'name', 'actions'];
  dataSourceRoles = new MatTableDataSource<Role>(this.roles);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private dialogService: DialogService, private roleService: RoleService, private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.dataSourceRoles.paginator = this.paginator;
    this.getAll({ 'pageIndex': 0, 'pageSize': 5 });
  }

  getAll(event) {
    this.roleService.getAllPageable(event.pageIndex, event.pageSize).subscribe((value: { content: Role[] }) => {
      this.roles = value.content;
      this.dataSourceRoles.data = value.content;
      this.loading = false;
      this.length = value['totalElements'];
    });
  }

  addRole() {
    this.roleName = this.roleName.trim();
    if (this.roleName != "") {
      this.roleService.add(new Role(null, this.roleName)).subscribe(data => {
        this.getAll({ 'pageIndex': 0, 'pageSize': 5 });
        this.roleName = "";
        this.roleNameElement.nativeElement.focus();
      })
    }
    else {
      this.roleName = "";
      this.roleNameElement.nativeElement.focus();
    }
  }


  delete(id: string) {
    this.roleService.delete(id).subscribe(() => {
      this.getAll({ 'pageIndex': 0, 'pageSize': 5 });
      this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
    });
  }

  openDialog(role: Role): void {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this role");
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(role.id);
      }
    });
  }

  /* getPatientsByQuery(pageIndex, pageSize, query) {
    this.patientsService.getAllByQuery(pageIndex, pageSize, query).subscribe((value: { content: Patient[] }) => {
      let data = value.content;
      this.patients = data;
      this.dataSource.data = data;
      this.loading = false;
      this.length = value['totalElements'];
    });
  }

  search(query) {
    query = query.trim();
    if (query != "") {
      this.loading = true;
      this.getPatientsByQuery(0, this.paginator.pageSize, query);
    }
    else {
      this.getAll({ 'pageIndex': 0, 'pageSize': this.paginator.pageSize });
    }
  }

  checkQuery(query) {
    query = query.trim();
    if (query == "") {
      this.getAll({ 'pageIndex': 0, 'pageSize': this.paginator.pageSize });
    }
  } */

}