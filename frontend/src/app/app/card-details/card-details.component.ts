import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
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

  public cardForm: FormGroup;

  editLabels: boolean = false;

  label: string = "";
  labels: string[] = [];

  checklistTitle: string = "";
  itemTitle: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsData, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, public dialog: MatDialog) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      description: [],
      startDate: [this.toDateString(this.data.card.startDate)],
      endDate: [this.toDateString(this.data.card.endDate)]
    });
    this.cardForm.patchValue({description: this.data.card.description});
    this.labels = this.labels.concat(this.data.card.labels);
  }

  addLabel() {
    this.labels.push(this.label);
  }

  deleteLabel(index){
    this.labels.splice(index, 1);
  }

  deleteCard(){
    const dialogSaveChanges = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this card" }
    });

    dialogSaveChanges.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
      }
    });
  }

  addChecklist(){
    if(this.checklistTitle.trim()!=""){
      this.data.card.checklists.push(new Checklist(this.data.card.checklists.length.toString(), this.checklistTitle, new Date(), []));
    }
    this.checklistTitle = "";
  }

  addItem(index){
    if(this.itemTitle.trim()!=""){
      this.data.card.checklists[index].tasks.push(new Task(this.data.card.checklists[index].tasks.length.toString(), this.itemTitle, false, new Date()));
    }
    this.itemTitle = "";
  }

  private toDateString(date: Date): string {
    return (date.getFullYear().toString() + '-'
      + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
      + ("0" + (date.getDate())).slice(-2))
      + 'T' + date.toTimeString().slice(0, 5);
  }

}

export interface CardDetailsData {
  card: Card;
}