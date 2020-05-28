import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, durationInMilliseconds: number = 3000) {
    this.snackBar.open(message, action, {
      duration: durationInMilliseconds,
      horizontalPosition: "right",
      verticalPosition: "bottom"
    });
  }

  openSuccessSnackBar(message: string, action: string, durationInMilliseconds: number = 3000) {
    this.snackBar.open(message, action, {
      duration: durationInMilliseconds,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: ['success-snackbar']
    });
  }

  openErrorSnackBar(message: string, action: string, durationInMilliseconds: number = 3000) {
    this.snackBar.open(message, action, {
      duration: durationInMilliseconds,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: ['error-snackbar']
    });
  }
}
