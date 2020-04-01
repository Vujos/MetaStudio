import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogSaveChangesData } from './dialog-save-changes-data.model';

@Component({
    selector: 'dialog-save-changes',
    templateUrl: 'dialog-save-changes.html',
})
export class DialogSaveChanges {

constructor(
    public dialogRef: MatDialogRef<DialogSaveChanges>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSaveChangesData) {}

onNoClick(): void {
    this.dialogRef.close();
}

}


