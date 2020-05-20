import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Board } from '../models/board.model';
import { BoardService } from '../boards/board.service';
import { CardDetailsComponent } from '../card-details/card-details.component';
import { DialogOkComponent } from '../dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';
import { ColorsService } from '../shared/colors.service';
import { DialogService } from '../shared/dialog.service';
import { SnackBarService } from '../shared/snack-bar.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent {
  @ViewChildren('cardTitleInput') cardTitleElements: ElementRef;
  @ViewChild('listTitleInput', { static: false }) listTitleElement: ElementRef;
  @ViewChild('boardMoreTrigger', { static: false }) boardMoreTrigger: MatMenuTrigger;
  @ViewChild('listMoreTrigger', { static: false }) listMoreTrigger: MatMenuTrigger;
  @Input() data: any;

  private dialogRef: MatDialogRef<CardDetailsComponent>;

  loading = true;

  currentUser = undefined;

  tasksDoneNumber = {};

  lists = [];
  connectedTo = [];

  board: Board;

  boardDescription = "";
  boardTitle = "";
  boardBackground = "";

  newUser = "";
  errorMessageNewUser = undefined;

  listTitleRename = "";

  selectedCopyAllCards;
  selectedMoveAllCards;
  selectedMoveListPosition;
  selectedMoveList;

  lightBackground = true;

  listTitle = "";

  showAddCardBool = false;
  cardTitle = {};

  checked: number[] = [];

  private wc;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private boardService: BoardService, private webSocketService: WebSocketService, private userService: UserService, private authService: AuthService, private router: Router, private colorsService: ColorsService, private dialogService: DialogService, private snackBarService: SnackBarService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");

    this.boardService.getOne(id, this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.board = data;
      for (let list of this.board.lists) {
        this.connectedTo.push(list.id);
      };

      this.boardDescription = this.board.description;
      this.boardTitle = this.board.title;
      this.boardBackground = this.board.background;
      this.lightBackground = this.colorsService.checkBackground(this.boardBackground);

      this.board.lists.forEach(list => {
        list.cards.forEach(card => {
          let done = 0;
          let size = 0;
          card.checklists.forEach(checklist => {
            checklist.tasks.forEach(task => {
              size += 1;
              if (task.done) {
                done += 1;
              }
            });
          })
          this.tasksDoneNumber[card.id] = done + "/" + size;
        })
      })
    });

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.wc.subscribe("/topic/boards/update/" + id, (msg) => {
        if (JSON.parse(msg.body).statusCodeValue == 204) {
          const dialogRef = this.dialogService.openDialog(DialogOkComponent, "Content Deleted", "The owner has deleted the content");

          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/boards']);
          });

        }
        else {
          let data = JSON.parse(msg.body).body;
          this.board = data;
          if (this.dialogRef && this.dialogRef.componentInstance) {
            if (this.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex] == undefined || this.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex].id != this.dialogRef.componentInstance.data.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex].id) {
              this.dialogRef.close();
            }
            this.dialogRef.componentInstance.data.board = data;
            this.dialogRef.componentInstance.data.checkedNumber = this.calculateCheckedTasks(this.dialogRef.componentInstance.data.listIndex, this.dialogRef.componentInstance.data.cardIndex);
          }
          this.connectedTo = [];
          for (let list of this.board.lists) {
            this.connectedTo.push(list.id);
          };
          this.boardDescription = this.board.description;
          this.boardTitle = this.board.title;
          this.boardBackground = this.board.background;
          this.lightBackground = this.colorsService.checkBackground(this.boardBackground);

          this.board.lists.forEach(list => {
            list.cards.forEach(card => {
              let done = 0;
              let size = 0;
              card.checklists.forEach(checklist => {
                checklist.tasks.forEach(task => {
                  size += 1;
                  if (task.done) {
                    done += 1;
                  }
                });
              })
              this.tasksDoneNumber[card.id] = done + "/" + size;
            })
          })
        }

      })
    })

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
    })
  }

  ngOnDestroy() {
    this.wc.disconnect();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateBoard();
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.updateBoard();
    }
  }

  dropList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.lists, event.previousIndex, event.currentIndex);
    this.updateBoard();
  }

  showAddList() {
    this.boardMoreTrigger.closeMenu();
    this.listTitle = "";
    if (this.listTitleElement) {
      this.listTitleElement.nativeElement.focus();
    }
  }

  addList() {
    if (this.listTitle.trim() != "") {
      this.board.lists.push(
        {
          id: null,
          title: this.listTitle.trim(),
          cards: [],
          priority: 1,
          date: new Date(),
          deleted: false
        }
      );
      this.updateBoard();
    }
    this.listTitle = "";
    this.listTitleElement.nativeElement.focus();
  }

  showAddCard(index) {
    this.listMoreTrigger.closeMenu();
    this.cardTitle[index] = "";
    this.cardTitleElements['_results'][index].nativeElement.focus();
  }

  addCard(index) {
    if (this.cardTitle[index] && this.cardTitle[index].trim() != "") {
      this.board.lists[index]['cards'].push({
        id: null,
        title: this.cardTitle[index].trim(),
        date: new Date(),
        description: "",
        members: [],
        startDate: new Date(),
        endDate: new Date(),
        attachments: [],
        labels: [],
        checklists: [],
        deleted: false
      });
      this.updateBoard();
    }
    this.cardTitle[index] = "";
    this.cardTitleElements['_results'][index].nativeElement.focus();
  }

  saveBoardDescription() {
    this.board.description = this.boardDescription.trim();
    this.boardDescription = this.board.description;
    this.updateBoard();
    this.snackBarService.openSnackBar("Successfully saved", "X");
  }

  deleteAllListsDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete All Lists");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists = [];
        this.updateBoard();
      }
    });
  }

  renameBoard() {
    if (this.boardTitle.trim() != this.board.title && this.boardTitle.trim() != "") {
      this.board.title = this.boardTitle.trim();
      this.boardTitle = this.board.title;
      this.updateBoard();
      this.snackBarService.openSnackBar("Successfully saved", "X");
    }
    else {
      this.boardTitle = this.board.title;
    }
  }

  saveBoardTitleDialog() {
    if (this.boardTitle.trim() != this.board.title && this.boardTitle.trim() != "") {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to Board Title");

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameBoard()
        }
        else {
          this.boardTitle = this.board.title;
        }
      });
    }
    else {
      this.boardTitle = this.board.title;
    }
  }

  saveBoardDescriptionDialog() {
    if (this.boardDescription.trim() != this.board.description) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to Board Description");

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveBoardDescription()
        }
        else {
          this.boardDescription = this.board.description;
        }
      });
    }
  }

  changeBackground() {
    this.board.background = this.boardBackground;
    this.updateBoard();
    this.lightBackground = this.colorsService.checkBackground(this.boardBackground);
  }

  deleteBoard() {
    this.board.deleted = true;
    this.updateBoard();
    this.router.navigate(['/boards']);
  }

  deleteBoardDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete Board " + this.board.title);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteBoard();
      }
    });
  }

  leaveBoard() {
    this.userService.leaveBoard(this.board.id, this.currentUser.id).subscribe(data => {
      this.router.navigate(['/boards']);
    });
  }

  leaveBoardDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Leave Board " + this.board.title);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leaveBoard();
      }
    });
  }

  addUser() {
    if (this.newUser.trim() != "") {
      this.userService.getByQuery(this.newUser).subscribe(data => {
        if (data) {
          this.errorMessageNewUser = undefined;
          this.board.users.forEach(user => {
            if (user.id == data.id) {
              this.errorMessageNewUser = "That user already exists";
            }
          });
          if (this.errorMessageNewUser) {
            return;
          }
          this.board.users.push(data);
          this.updateBoard();
          this.board.users = []
          data.boards.push(this.board);
          this.wc.send("/app/users/update/" + data.email, {}, JSON.stringify(data));
          this.resetAddUser();
          this.snackBarService.openSnackBar("Successfully added", "X");
        }
      }, error => {
        this.errorMessageNewUser = "That user does not exist"
      });
    }
    else {
      this.resetAddUser();
    }
  }

  resetAddUser() {
    this.newUser = "";
    this.errorMessageNewUser = undefined;
  }

  deleteUser(index) {
    this.userService.leaveBoard(this.board.id, this.board.users[index].id).subscribe(data => {
      this.board.lists.forEach((list, listIndex) => {
        list.cards.forEach((card, cardIndex) => {
          for (let memberIndex = 0; memberIndex < card.members.length; memberIndex++) {
            if (card.members[memberIndex].id == this.board.users[index].id) {
              this.board.lists[listIndex].cards[cardIndex].members.splice(memberIndex, 1);
              break;
            }
          }
        })
      })
      this.board.users.splice(index, 1);
      this.updateBoard();
      this.snackBarService.openSnackBar("Successfully deleted", "X");
    });

  }

  deleteUserDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this user");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(index);
      }
    });
  }

  renameList(index) {
    if (this.listTitleRename.trim() != this.board.lists[index].title && this.listTitleRename.trim() != "") {
      this.board.lists[index].title = this.listTitleRename.trim();
      this.updateBoard();
      this.listTitleRename = this.board.lists[index].title;
      this.snackBarService.openSnackBar("Successfully saved", "X");
    }
    else {
      this.listTitleRename = this.board.lists[index].title;
    }
  }

  saveListTitleDialog(index) {
    if (this.listTitleRename.trim() != this.board.lists[index].title && this.listTitleRename.trim() != "") {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to List Title");

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameList(index);
        }
        else {
          this.listTitleRename = this.board.lists[index].title;
        }
      });
    }
    else {
      this.listTitleRename = this.board.lists[index].title;
    }
  }

  copyAllCards(indexFromList, indexToList) {
    if (indexFromList != undefined && indexToList != undefined) {
      this.board.lists[indexToList].cards = this.board.lists[indexToList].cards.concat(this.board.lists[indexFromList].cards);
      this.updateBoard();
      this.selectedCopyAllCards = undefined;
      this.snackBarService.openSnackBar("Successfully copied", "X");
    }
  }

  copyAllCardsDialog(indexFromList, indexToList) {
    if (indexToList != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Copy All Cards from " + this.board.lists[indexFromList].title + " to " + this.board.lists[indexToList].title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.copyAllCards(indexFromList, indexToList);
        }
        else {
          this.selectedCopyAllCards = undefined;
        }
      });
    }
  }

  moveAllCards(indexFromList, indexToList) {
    if (indexFromList != undefined && indexToList != undefined) {
      this.board.lists[indexToList].cards = this.board.lists[indexToList].cards.concat(this.board.lists[indexFromList].cards);
      this.board.lists[indexFromList].cards = [];
      this.updateBoard();
      this.selectedMoveAllCards = undefined;
      this.snackBarService.openSnackBar("Successfully moved", "X");
    }

  }

  moveAllCardsDialog(indexFromList, indexToList) {
    if (indexToList != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Move All Cards from " + this.board.lists[indexFromList].title + " to " + this.board.lists[indexToList].title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.moveAllCards(indexFromList, indexToList);
        }
        else {
          this.selectedMoveAllCards = undefined;
        }
      });
    }
  }

  deleteAllCardsDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete All Cards from " + this.board.lists[index].title);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists[index].cards = [];
        this.updateBoard();
      }
    });
  }

  deleteListDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this list");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists[index].deleted = true;
        this.updateBoard();
      }
    });
  }

  moveList(indexFromList, position, indexToList) {
    if (indexFromList != undefined && position != undefined && indexToList != undefined) {
      let index = indexToList;
      if (position == "before") {
        index--;
      }
      this.board.lists.splice(index, 0, this.board.lists.splice(indexFromList, 1)[0]);
      this.updateBoard();
      this.selectedMoveList = undefined;
      this.selectedMoveListPosition = undefined;
      this.snackBarService.openSnackBar("Successfully moved", "X");
    }

  }

  moveListDialog(indexFromList, position, indexToList) {
    if (indexToList != undefined && position != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Move List " + position + " " + this.board.lists[indexToList].title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.moveList(indexFromList, position, indexToList);
        }
        else {
          this.selectedMoveList = undefined;
          this.selectedMoveListPosition = undefined;
        }
      });
    }
    else {
      this.selectedMoveList = undefined;
      this.selectedMoveListPosition = undefined;
    }
  }

  calculateCheckedTasks(listIndex, cardIndex) {
    let checkedNumber: number[] = [];
    let sum = 0;
    this.board.lists[listIndex].cards[cardIndex].checklists.forEach(checklist => {
      checklist.tasks.forEach(task => {
        if (task.done) {
          sum += 1;
        }
      })
      checkedNumber.push(sum);
      sum = 0;
    })
    return checkedNumber;
  }

  openCardDetailsDialog(listIndex, cardIndex) {
    this.dialogRef = this.dialog.open(CardDetailsComponent, { data: { board: this.board, listIndex: listIndex, cardIndex: cardIndex, checkedNumber: this.calculateCheckedTasks(listIndex, cardIndex) }, autoFocus: false, width: '50%' });
  }

  updateBoard() {
    this.wc.send("/app/boards/update/" + this.board.id, {}, JSON.stringify(this.board));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
