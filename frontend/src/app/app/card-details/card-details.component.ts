import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatMenuTrigger, ThemePalette } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Checklist } from '../checklist.model';
import { Task } from '../task.model';
import { Card } from '../card.model';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {

  @ViewChild('checklistTrigger', { static: false }) checklistTrigger: MatMenuTrigger;
  @ViewChild('labelsTrigger', { static: false }) labelsTrigger: MatMenuTrigger;
  @ViewChild('labelUpdateTrigger', { static: false }) labelUpdateTrigger: MatMenuTrigger;

  public cardForm: FormGroup;

  editLabels: boolean = false;
  editChecklist: boolean = false;

  label: string = "";
  labelUpdate: string = "";
  labels: string[] = [];

  checklistTitle: string = "";
  itemTitle: string = "";
  checklists: Checklist[] = [];

  deleteLabelsColor: ThemePalette = 'warn';
  checkboxColor: ThemePalette = 'warn';

  checked: number[] = [];
  checkboxChecked = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsData, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, public dialog: MatDialog) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      description: [],
      startDate: [this.toDateString(this.data.card.startDate)],
      endDate: [this.toDateString(this.data.card.endDate)]
    });
    this.cardForm.patchValue({ description: this.data.card.description });
    this.labels = this.labels.concat(this.data.card.labels);
    this.checklists = this.checklists.concat(this.data.card.checklists);
    let sum = 0;
    this.checklists.forEach(checklist => {
      checklist.tasks.forEach(task => {
        if (task.done) {
          sum += 1;
        }
      })
      this.checked.push(sum);
      sum = 0;
    })
  }

  addLabel() {
    this.labels.push(this.label);
    this.labelsTrigger.closeMenu();
  }

  updateLabel(index) {
    this.labels[index] = this.labelUpdate;
    this.labelUpdateTrigger.closeMenu();
  }

  deleteLabel(index) {
    this.labels.splice(index, 1);
  }

  deleteCard() {
    const dialogSaveChanges = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this card" }
    });

    dialogSaveChanges.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
      }
    });
  }

  addChecklist() {
    if (this.checklistTitle.trim() != "") {
      //this.data.card.checklists.push(new Checklist(this.data.card.checklists.length.toString(), this.checklistTitle, new Date(), []));
      this.checklists.push(new Checklist(this.checklists.length.toString(), this.checklistTitle, new Date(), []));
      this.checklistTrigger.closeMenu();
      this.checked[this.checked.length]=0;
    }
    this.checklistTitle = "";
  }

  addItem(index) {
    if (this.itemTitle.trim() != "") {
      this.checklists[index].tasks.push(new Task(this.checklists[index].tasks.length.toString(), this.itemTitle, false, new Date()));
    }
    this.itemTitle = "";
  }

  deleteTask(checklistIndex, taskIndex) {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this checkbox" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.checklists[checklistIndex].tasks.splice(taskIndex, 1);
      }
    });
  }

  deleteChecklist(index) {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this checklist" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.checklists.splice(index, 1);
      }
    });
  }

  private toDateString(date: Date): string {
    return (date.getFullYear().toString() + '-'
      + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
      + ("0" + (date.getDate())).slice(-2))
      + 'T' + date.toTimeString().slice(0, 5);
  }

  checkedPlus(index){
    this.checked[index]++;
  }

  checkedMinus(index){
    this.checked[index]--;
  }

}

export interface CardDetailsData {
  card: Card;
}