import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { SkillGeneral } from '../models/skill-general.model';
import { DialogService } from '../shared/dialog.service';
import { SkillGeneralService } from '../shared/skill-general.service';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @ViewChild('skillNameInput') skillNameElement: ElementRef;

  loading = true;
  length: number;
  skillName = "";
  skills: SkillGeneral[] = [];
  displayedColumns: string[] = ['no', 'name', 'actions'];
  dataSourceSkills = new MatTableDataSource<SkillGeneral>(this.skills);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private dialogService: DialogService, private skillGeneralService: SkillGeneralService, private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.dataSourceSkills.paginator = this.paginator;
    this.getAll({ 'pageIndex': 0, 'pageSize': 5 });
  }

  getAll(event) {
    this.skillGeneralService.getAllPageable(event.pageIndex, event.pageSize).subscribe((value: { content: SkillGeneral[] }) => {
      this.skills = value.content;
      this.dataSourceSkills.data = value.content;
      this.loading = false;
      this.length = value['totalElements'];
    });
  }

  addSkill() {
    this.skillName = this.skillName.trim();
    if (this.skillName != "") {
      this.skillGeneralService.add(new SkillGeneral(null, this.skillName, false)).subscribe(data => {
        this.getAll({ 'pageIndex': 0, 'pageSize': 5 });
        this.skillName = "";
        this.skillNameElement.nativeElement.focus();
      })
    }
    else {
      this.skillName = "";
      this.skillNameElement.nativeElement.focus();
    }
  }


  delete(id: string) {
    this.skillGeneralService.delete(id).subscribe(() => {
      this.getAll({ 'pageIndex': 0, 'pageSize': 5 });
      this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
    });
  }

  openDialog(skill: SkillGeneral): void {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this skill");
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(skill.id);
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