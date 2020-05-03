import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatMenuTrigger, MAT_DIALOG_DATA, ThemePalette } from '@angular/material';
import { Board } from '../board.model';
import { Checklist } from '../checklist.model';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Task } from '../task.model';
import { WebSocketService } from '../web-socket/web-socket.service';

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

  private wc;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsData, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, public dialog: MatDialog, private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      description: [],
      startDate: [this.toDateString(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate)],
      endDate: [this.toDateString(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate)]
    });
    this.cardForm.patchValue({ description: this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description });

    let sum = 0;
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.forEach(checklist => {
      checklist.tasks.forEach(task => {
        if (task.done) {
          sum += 1;
        }
      })
      this.checked.push(sum);
      sum = 0;
    })

    this.wc = this.webSocketService.getClient();
  }

  addLabel() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].labels.push(this.label);
    this.updateBoard();
    this.labelsTrigger.closeMenu();
  }

  updateLabel(index) {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].labels[index] = this.labelUpdate;
    this.updateBoard();
    this.labelUpdateTrigger.closeMenu();
  }

  deleteLabel(index) {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].labels.splice(index, 1);
    this.updateBoard();
  }

  deleteCard() {
    const dialogSaveChanges = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this card" }
    });

    dialogSaveChanges.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this.data.board.lists[this.data.listIndex].cards.splice(this.data.cardIndex, 1);
        this.updateBoard();
      }
    });
  }

  addChecklist() {
    if (this.checklistTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.push(new Checklist(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.length.toString(), this.checklistTitle, new Date(), []));
      this.updateBoard();
      this.checklistTrigger.closeMenu();
      this.checked[this.checked.length] = 0;
    }
    this.checklistTitle = "";
  }

  addItem(index) {
    if (this.itemTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].tasks.push(new Task(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].tasks.length.toString(), this.itemTitle, false, new Date()));
      this.updateBoard();
    }
    this.itemTitle = "";
  }

  deleteTask(checklistIndex, taskIndex) {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this checkbox" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks.splice(taskIndex, 1);
        this.updateBoard();
      }
    });
  }

  deleteChecklist(index) {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this checklist" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.splice(index, 1);
        this.updateBoard();
      }
    });
  }

  private toDateString(date: Date): string {
    date = new Date(date);
    return (date.getFullYear().toString() + '-'
      + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
      + ("0" + (date.getDate())).slice(-2))
      + 'T' + date.toTimeString().slice(0, 5);
  }

  checkedPlus(index) {
    this.checked[index]++;
  }

  checkedMinus(index) {
    this.checked[index]--;
  }

  updateBoard() {
    this.wc.send("/app/boards/update/" + this.data.board.id, {}, JSON.stringify(this.data.board));
  }
}

export interface CardDetailsData {
  board: Board;
  listIndex: string;
  cardIndex: string;
}