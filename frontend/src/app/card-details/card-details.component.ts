import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BoardService } from '../boards/board.service';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Activity } from '../models/activity.model';
import { CardDetailsData } from '../models/card-details-data.model';
import { Card } from '../models/card.model';
import { Checklist } from '../models/checklist.model';
import { List } from '../models/list.model';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { DateService } from '../shared/date.service';
import { DialogService } from '../shared/dialog.service';
import { RoutesService } from '../shared/routes.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Board } from '../models/board.model';
import { ParentBoard } from '../models/parent-board.model';
import { ChildBoard } from '../models/child-board.model';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {

  @ViewChild('checklistTrigger') checklistTrigger: MatMenuTrigger;
  @ViewChild('labelsTrigger') labelsTrigger: MatMenuTrigger;
  @ViewChild('labelUpdateTrigger') labelUpdateTrigger: MatMenuTrigger;
  @ViewChild('cardRenameTrigger') cardRenameTrigger: MatMenuTrigger;
  @ViewChild('checklistRenameTrigger') checklistRenameTrigger: MatMenuTrigger;
  @ViewChild('addUsersTrigger') addUsersTrigger: MatMenuTrigger;

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

  selectedCopyCard;
  selectedMoveCard;
  selectedMoveBoard: Board;
  allUserBoards: Board[];

  currentUser = undefined;

  private wc;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CardDetailsData, public dateService: DateService, private fb: FormBuilder, private dialogRef: MatDialogRef<CardDetailsComponent>, private webSocketService: WebSocketService, public userService: UserService, private authService: AuthService, private boardService: BoardService, private router: Router, private snackBarService: SnackBarService, private dialogService: DialogService, private routesService: RoutesService) { }

  ngOnInit() {
    this.cardForm = this.fb.group({
      description: [this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description],
      startDate: [this.dateService.getAngularDateTimeLocal(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate)],
      endDate: [this.dateService.getAngularDateTimeLocal(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate)]
    });
    this.cardForm.patchValue({ description: this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description });

    this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;

    this.wc = this.webSocketService.getClient();

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
      this.allUserBoards = this.currentUser.boards.concat(...this.currentUser.teams.map(team => team.boards));
    })
  }

  copyCard(indexToList, selectedMoveBoard) {
    if (this.data.listIndex != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      let newCard = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex];
      newCard.id = null;
      selectedMoveBoard.lists[indexToList].cards.push(newCard);
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `copied card from list ${this.data.board.lists[this.data.listIndex].title} to list ${selectedMoveBoard.lists[indexToList].title}` + " on board " + selectedMoveBoard.title);
      this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
      this.selectedCopyCard = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully copied", "X");
    }
  }

  copyCardDialog(indexToList, selectedMoveBoard) {
    if (this.data.listIndex != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Copy Card from " + this.data.board.lists[this.data.listIndex].title + " to " + selectedMoveBoard.lists[indexToList].title + " on board " + selectedMoveBoard.title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.copyCard(indexToList, selectedMoveBoard);
        }
        else {
          this.selectedCopyCard = undefined;
          this.selectedMoveBoard = undefined;
        }
      });
    }
    else {
      this.selectedCopyCard = undefined;
      this.selectedMoveBoard = undefined;
    }
  }

  moveCard(indexToList, selectedMoveBoard) {
    if (this.data.listIndex != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      selectedMoveBoard.lists[indexToList].cards.push(this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex]);
      this.data.board.lists[this.data.listIndex].cards.splice(this.data.cardIndex, 1);
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `moved card from list ${this.data.board.lists[this.data.listIndex].title} to list ${selectedMoveBoard.lists[indexToList].title}` + " on board " + selectedMoveBoard.title);
      if (this.data.board.id == selectedMoveBoard.id) {
        selectedMoveBoard.lists[this.data.listIndex].cards = [];
      }
      this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
      this.selectedMoveCard = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
    }

  }

  moveCardDialog(indexToList, selectedMoveBoard) {
    if (indexToList != undefined && selectedMoveBoard != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Move Card from " + this.data.board.lists[this.data.listIndex].title + " to " + selectedMoveBoard.lists[indexToList].title + " on board " + selectedMoveBoard.title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close();
          this.moveCard(indexToList, selectedMoveBoard);
        }
        else {
          this.selectedMoveCard = undefined;
          this.selectedMoveBoard = undefined;
        }
      });
    }
    else {
      this.selectedMoveCard = undefined;
      this.selectedMoveBoard = undefined;
    }
  }

  addLabel() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].labels.push(this.label);
    this.addActivity(this.currentUser.id, this.currentUser.fullName, "added label to card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
    this.labelsTrigger.closeMenu();
  }

  updateLabel(index) {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].labels[index] = this.labelUpdate;
    this.addActivity(this.currentUser.id, this.currentUser.fullName, "changed label on card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
    this.labelUpdateTrigger.closeMenu();
  }

  deleteLabel(index) {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].labels.splice(index, 1);
    this.addActivity(this.currentUser.id, this.currentUser.fullName, "deleted label from card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
  }

  deleteCard() {
    const dialogSaveChanges = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this card");

    dialogSaveChanges.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].deleted = true;
        this.addActivity(this.currentUser.id, this.currentUser.fullName, "deleted card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
      }
    });
  }

  renameCard() {
    if (this.cardTitle.trim() != this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title && this.cardTitle.trim() != "") {
      let oldCardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title = this.cardTitle.trim();
      this.cardTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title;
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `renamed card ${oldCardTitle} to`, this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.cardTitle);
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
      let oldChecklistTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title = this.checklistRenameTitle.trim();
      this.checklistRenameTitle = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title;
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `renamed checklist ${oldChecklistTitle} to`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.checklistRenameTitle, "on card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
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
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `added checklist`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.checklistTitle, "to card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
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
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `added task`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.itemTitle, "to checklist", this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title);
    }
    this.itemTitle = "";
  }

  updateTask(checklistIndex, taskIndex) {
    if (this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].done) {
      this.checkedPlus(checklistIndex);
      this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].doneDate = new Date();
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `finished task`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].title, "on checklist", this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].title);
    }
    else {
      this.checkedMinus(checklistIndex);
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `marked as unfinished task`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].title, "on checklist", this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].title);
    }
  }

  deleteTask(checklistIndex, taskIndex) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this checkbox");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].deleted = true;
        this.addActivity(this.currentUser.id, this.currentUser.fullName, `deleted task`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].tasks[taskIndex].title, "from checklist", this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[checklistIndex].title);
      }
    });
  }

  deleteChecklist(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this checklist");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].deleted = true;
        this.addActivity(this.currentUser.id, this.currentUser.fullName, `deleted checklist`, this.routesService.getCardRouteIndicesChecklists(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].checklists[index].title, "from card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
      }
    });
  }

  saveCardDescription() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description = this.cardForm.get("description").value.trim();
    this.cardForm.patchValue({ "description": this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].description });
    this.addActivity(this.currentUser.id, this.currentUser.fullName, `updated description of card`, this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
  }

  saveStartDate() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate = new Date(this.cardForm.get("startDate").value.trim());
    this.cardForm.patchValue({ "startDate": this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].startDate });
    this.addActivity(this.currentUser.id, this.currentUser.fullName, `updated start date of card`, this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
  }

  saveEndDate() {
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate = new Date(this.cardForm.get("endDate").value.trim());
    this.cardForm.patchValue({ "endDate": this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].endDate });
    this.addActivity(this.currentUser.id, this.currentUser.fullName, `updated due date of card`, this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
  }

  checkedPlus(index) {
    this.data.checkedNumber[index]++;
  }

  checkedMinus(index) {
    this.data.checkedNumber[index]--;
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
          this.addActivity(this.currentUser.id, this.currentUser.fullName, `added member`, this.routesService.getUserRoute(data.id), data.fullName, "to card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
          this.addUsersTrigger.closeMenu();
          let cardMembers = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members;
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
          this.webSocketService.updateUser(data, this.wc);
          data.boards = [];
          this.data.board.users.push(data);
          this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members = cardMembers;
          this.webSocketService.updateBoard(this.data.board, this.wc);
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
    let oldMember = this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members[index];
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members.splice(index, 1);
    this.addActivity(this.currentUser.id, this.currentUser.fullName, `deleted member`, this.routesService.getUserRoute(oldMember.id), oldMember.fullName, "from card", this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
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

    let users: User[] = [];
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].members.forEach(member => {
      users.push(member);
    });
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
          parentBoard: new ParentBoard(null, this.data.board.id, this.data.board.title, new Date(), false),
          childBoards: [],
          deleted: false
        }
      ).subscribe(data => {
        let newBoard: any = data;
        users.forEach(user => {
          user.boards.push(newBoard);
          this.webSocketService.updateUser(user, this.wc);
        })
        this.data.board.childBoards.push(new ChildBoard(null, newBoard.id, newBoard.title, new Date(), false));
        this.webSocketService.updateBoard(this.data.board, this.wc);
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
        if (!task.done) {
          task.done = true;
          task.doneDate = new Date();
          this.checkedPlus(checklistIndex);
        }
      });
    });
    this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].doneDate = new Date();
    let action = "finished card";
    if (!this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done) {
      action = "marked as unfinished card";
    }
    this.addActivity(this.currentUser.id, this.currentUser.fullName, action, this.routesService.getCardRouteIndices(this.data.board.id, this.data.listIndex, this.data.cardIndex), this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].title);
  }

  doneCardDialog() {
    let dialogContent = "Mark this card as finished";
    if (!this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done) {
      dialogContent = "Mark this card as unfinished";
    }
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", dialogContent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doneCard()
      }
      else {
        this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done = !this.data.board.lists[this.data.listIndex].cards[this.data.cardIndex].done;
      }
    });
  }

  addActivity(performerId: string, performerFullName: string, action: string, objectLink: string = null, objectName: string = null, location: string = null, locationObjectLink: string = null, locationObjectName: string = null, boardId: string = this.data.board.id, boardName: string = this.data.board.title) {
    let activity = new Activity(null, performerId, performerFullName, action, boardId, boardName, objectLink, objectName, location, locationObjectLink, locationObjectName);
    this.data.board.activities.unshift(activity);
    this.webSocketService.updateBoard(this.data.board, this.wc);
    this.currentUser.activities.unshift(activity);
    this.webSocketService.updateUser(this.currentUser, this.wc);
  }
}
