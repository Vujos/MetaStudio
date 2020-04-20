import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { CardDetailsDialogData } from '../hero-profile.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsDialogData, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, public dialog: MatDialog) { }

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

  private toDateString(date: Date): string {
    return (date.getFullYear().toString() + '-'
      + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
      + ("0" + (date.getDate())).slice(-2))
      + 'T' + date.toTimeString().slice(0, 5);
  }

}
