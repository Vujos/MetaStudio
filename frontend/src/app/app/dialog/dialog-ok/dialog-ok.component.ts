import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogSaveChangesData } from '../dialog-save-changes-data.model';

@Component({
  selector: 'app-dialog-ok',
  templateUrl: './dialog-ok.component.html',
  styleUrls: ['./dialog-ok.component.scss']
})
export class DialogOkComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogOkComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogSaveChangesData) { }

  ngOnInit() {
  }

}
