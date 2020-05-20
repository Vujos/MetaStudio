import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(dialogComponent, title, content, autoFocus=false){
    const dialogRef = this.dialog.open(dialogComponent, {
      data: { title: title, content: content }, autoFocus: autoFocus
    });
    return dialogRef
  }
}
