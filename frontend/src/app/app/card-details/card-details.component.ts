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
  @ViewChild('cardRenameTrigger', { static: false }) cardRenameTrigger: MatMenuTrigger;
  @ViewChild('checklistRenameTrigger', { static: false }) checklistRenameTrigger: MatMenuTrigger;

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

  cardTitle: string = "";
  checklistRenameTitle: string = "";

  private wc;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsData, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, public dialog: MatDialog, private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      description: [this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description],
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

    this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;

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

  renameCard(){
    if (this.cardTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title && this.cardTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title = this.cardTitle.trim();
      this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
      this.updateBoard();
      this.cardRenameTrigger.closeMenu();
    }
    else{
      this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
    }
  }

  saveCardTitleDialog() {
    if (this.cardTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title && this.cardTitle.trim() != "") {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Save Changes to Card Title" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameCard()
        }
        else {
          this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
        }
      });
    }
    else {
      this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
    }
  }

  renameChecklist(index){
    if (this.checklistRenameTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title && this.checklistRenameTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title = this.checklistRenameTitle.trim();
      this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
      this.updateBoard();
      this.checklistRenameTrigger.closeMenu();
    }
    else{
      this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
    }
  }

  saveChecklistTitleDialog(index) {
    if (this.checklistRenameTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title && this.checklistRenameTitle.trim() != "") {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Save Changes to Checklist Title" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameChecklist(index)
        }
        else {
          this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
        }
      });
    }
    else {
      this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
    }
  }

  addChecklist() {
    if (this.checklistTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.push(new Checklist(null, this.checklistTitle, new Date(), []));
      this.updateBoard();
      this.checklistTrigger.closeMenu();
      this.checked[this.checked.length] = 0;
    }
    this.checklistTitle = "";
  }

  addItem(index) {
    if (this.itemTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].tasks.push(new Task(null, this.itemTitle, false, new Date()));
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

  saveCardDescription(){
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description = this.cardForm.get("description").value.trim();
    this.cardForm.patchValue({"description":this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description});
    this.updateBoard();
  }

  saveStartDate(){
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate = this.cardForm.get("startDate").value.trim();
    this.cardForm.patchValue({"startDate":this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate});
    this.updateBoard();
  }

  saveEndDate(){
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate = this.cardForm.get("endDate").value.trim();
    this.cardForm.patchValue({"endDate":this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate});
    this.updateBoard();
  }

  private toDateString(date: string): string {
    return date.slice(0, -12);
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