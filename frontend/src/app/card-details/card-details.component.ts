import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatMenuTrigger, MAT_DIALOG_DATA, ThemePalette } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BoardService } from '../boards/board.service';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { CardDetailsData } from '../models/card-details-data.model';
import { Card } from '../models/card.model';
import { Checklist } from '../models/checklist.model';
import { List } from '../models/list.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { DialogService } from '../shared/dialog.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { UserService } from '../users/user.service';
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
  @ViewChild('addUsersTrigger', { static: false }) addUsersTrigger: MatMenuTrigger;

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

  checkboxChecked = {};

  cardTitle: string = "";
  checklistRenameTitle: string = "";

  newUser = "";
  errorMessageNewUser = undefined;

  currentUser = undefined;

  private wc;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsData, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, private webSocketService: WebSocketService, private userService: UserService, private authService: AuthService, private boardService: BoardService, private router: Router, private snackBarService: SnackBarService, private dialogService: DialogService) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      description: [this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description],
      startDate: [this.toDateString(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate)],
      endDate: [this.toDateString(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate)]
    });
    this.cardForm.patchValue({ description: this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description });

    this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;

    this.wc = this.webSocketService.getClient();

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
    })
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
    const dialogSaveChanges = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this card");

    dialogSaveChanges.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].deleted = true;
        this.updateBoard();
      }
    });
  }

  renameCard() {
    if (this.cardTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title && this.cardTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title = this.cardTitle.trim();
      this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
      this.updateBoard();
      this.cardRenameTrigger.closeMenu();
    }
    else {
      this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
    }
  }

  saveCardTitleDialog() {
    if (this.cardTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title && this.cardTitle.trim() != "") {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to Card Title");

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

  renameChecklist(index) {
    if (this.checklistRenameTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title && this.checklistRenameTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title = this.checklistRenameTitle.trim();
      this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
      this.updateBoard();
      this.checklistRenameTrigger.closeMenu();
    }
    else {
      this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
    }
  }

  saveChecklistTitleDialog(index) {
    if (this.checklistRenameTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title && this.checklistRenameTitle.trim() != "") {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to Checklist Title");

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
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.push(new Checklist(null, this.checklistTitle, new Date(), [], false));
      this.updateBoard();
      this.checklistTrigger.closeMenu();
      this.data.checkedNumber[this.data.checkedNumber.length] = 0;
    }
    this.checklistTitle = "";
  }

  addItem(index) {
    if (this.itemTitle.trim() != "") {
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].tasks.push(new Task(null, this.itemTitle, false, new Date(), null, false));
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done = false;
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].doneDate = null;
      this.updateBoard();
    }
    this.itemTitle = "";
  }

  updateTask(checklistIndex, taskIndex) {
    if (this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].done) {
      this.checkedPlus(checklistIndex);
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].doneDate = new Date();
    }
    else {
      this.checkedMinus(checklistIndex);
    }
    this.updateBoard();
  }

  deleteTask(checklistIndex, taskIndex) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this checkbox");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].deleted = true;
        this.updateBoard();
      }
    });
  }

  deleteChecklist(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this checklist");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].deleted = true;
        this.updateBoard();
      }
    });
  }

  saveCardDescription() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description = this.cardForm.get("description").value.trim();
    this.cardForm.patchValue({ "description": this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description });
    this.updateBoard();
  }

  saveStartDate() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate = this.cardForm.get("startDate").value.trim();
    this.cardForm.patchValue({ "startDate": this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate });
    this.updateBoard();
  }

  saveEndDate() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate = this.cardForm.get("endDate").value.trim();
    this.cardForm.patchValue({ "endDate": this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate });
    this.updateBoard();
  }

  private toDateString(date: string): string {
    return date.slice(0, -12);
  }

  checkedPlus(index) {
    this.data.checkedNumber[index]++;
  }

  checkedMinus(index) {
    this.data.checkedNumber[index]--;
  }

  updateBoard() {
    this.wc.send("/app/boards/update/" + this.data.board.id, {}, JSON.stringify(this.data.board));
  }

  addUser() {
    this.newUser = this.newUser.trim()
    if (this.newUser != "") {
      if (this.newUser.startsWith("@")) {
        this.newUser = this.newUser.slice(1);
      }
      this.userService.getByQuery(this.newUser).subscribe(data => {
        if (data) {
          this.errorMessageNewUser = undefined;
          this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members.forEach(user => {
            if (user.id == data.id) {
              this.errorMessageNewUser = "That user already exists";
            }
          });
          if (this.errorMessageNewUser) {
            return;
          }
          this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members.push(data);
          this.updateBoard();
          this.addUsersTrigger.closeMenu();
          this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members = [];
          let userHasBoard = false;
          data.boards.forEach(board => {
            if (board.id == this.data.board.id) {
              userHasBoard = true;
            }
          });
          for (let index = 0; index < data.teams.length; index++) {
            if (this.data.board.teams.some(team => team.id == data.teams[index].id)) {
              userHasBoard = true;
            }

          }
          if (userHasBoard) {
            return;
          }
          data.boards.push(this.data.board);
          this.wc.send("/app/users/update/" + data.email, {}, JSON.stringify(data));
          data.boards = [];
          this.data.board.users.push(data);
          this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members.push(data);
          this.updateBoard();
          this.snackBarService.openSuccessSnackBar("Successfully added", "X");
        }
      }, error => {
        this.errorMessageNewUser = "That user does not exist"
      });
    }
    else {
      this.resetAddUser();
    }
  }

  deleteMember(index) {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members.splice(index, 1);
    this.updateBoard();
    this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
  }

  deleteMemberDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this member");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMember(index);
      }
    });
  }

  resetAddUser() {
    this.newUser = "";
    this.errorMessageNewUser = undefined;
  }

  makeCardBoard() {
    let lists: List[] = [];
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.forEach(checklist => {
      let cards: Card[] = [];
      checklist.tasks.forEach(task => {
        cards.push(new Card(null, task.title, new Date(), "", [], new Date(), new Date(), [], [], [], false, null, [], false));
      })
      lists.push(new List(null, checklist.title, cards, 1, new Date(), false));
    })

    let users: User[] = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members;
    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      if (!users.includes(currentUser)) {
        users.unshift(currentUser);
      }
      this.boardService.add(
        {
          id: null,
          title: this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title.trim(),
          date: new Date(),
          description: this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description.trim(),
          background: "#55aa55",
          users: users,
          teams: [],
          lists: lists,
          priority: 1,
          activities: [],
          deleted: false
        }
      ).subscribe(data => {
        let newBoard: any = data;
        users.forEach(user => {
          user.boards.push(newBoard);
          this.wc.send("/app/users/update/" + user.email, {}, JSON.stringify(user));
        })
        this.dialogRef.close();
        this.router.navigate(['/']);
      });
    })
  }

  makeCardBoardDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Make this card a board");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.makeCardBoard()
      }
    });
  }

  doneCard() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists.forEach((checklist, checklistIndex) => {
      checklist.tasks.forEach(task => {
        if(!task.done){
          task.done = true;
          task.doneDate = new Date();
          this.checkedPlus(checklistIndex);
        }
      });
    });
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].doneDate = new Date();
    this.updateBoard();
  }

  doneCardDialog() {
    let dialogContent = "Mark this card as finished";
    if(!this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done){
      dialogContent = "Mark this card as unfinished";
    }
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", dialogContent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doneCard()
      }
      else{
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done = !this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done;
      }
    });
  }
}
