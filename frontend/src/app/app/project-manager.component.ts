import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SharedDataService } from '../shared/shared-data.service';
import { AdComponent } from './ad.component';
import { Board } from './board.model';
import { BoardService } from './boards/board.service';
import { CardDetailsComponent } from './card-details/card-details.component';
import { DialogOkComponent } from './dialog/dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from './dialog/dialog-save-changes';
import { UserService } from './users/user.service';
import { WebSocketService } from './web-socket/web-socket.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectManagerComponent implements AdComponent {
  @ViewChildren('cardTitleInput') cardTitleElements: ElementRef;
  @ViewChild('listTitleInput', { static: false }) listTitleElement: ElementRef;
  @ViewChild('boardMoreTrigger', { static: false }) boardMoreTrigger: MatMenuTrigger;
  @ViewChild('listMoreTrigger', { static: false }) listMoreTrigger: MatMenuTrigger;
  @Input() data: any;

  private dialogRef: MatDialogRef<CardDetailsComponent>;

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

  lightBackground = false;

  listTitle = "";

  showAddCardBool = false;
  cardTitle = {};

  checked: number[] = [];

  private wc;

  constructor(public dialog: MatDialog, public sharedDataService: SharedDataService, private route: ActivatedRoute, private boardService: BoardService, private webSocketService: WebSocketService, private userService: UserService, private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");

    this.boardService.getOne(id, this.authService.getCurrentUser()).subscribe(data => {
      this.board = data;
      for (let list of this.board.lists) {
        this.connectedTo.push(list.id);
      };

      this.boardDescription = this.board.description;
      this.boardTitle = this.board.title;
      this.boardBackground = this.board.background;

      this.board.lists.forEach(list => {
        list.cards.forEach(card => {
          let done = 0;
          let size = 0;
          card.checklists.forEach(checklist => {
            checklist.tasks.forEach(task => {
              size += 1;
              if(task.done){
                done+=1;
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
          const dialogRef = this.dialog.open(DialogOkComponent, {
            data: { title: "Content Deleted", content: "The owner has deleted the content" }
          });

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

          this.board.lists.forEach(list => {
            list.cards.forEach(card => {
              let done = 0;
              let size = 0;
              card.checklists.forEach(checklist => {
                checklist.tasks.forEach(task => {
                  size += 1;
                  if(task.done){
                    done+=1;
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
  }

  deleteAllListsDialog() {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete All Lists" }
    });

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
    }
    else {
      this.boardTitle = this.board.title;
    }
  }

  saveBoardTitleDialog() {
    if (this.boardTitle.trim() != this.board.title && this.boardTitle.trim() != "") {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Save Changes to Board Title" }
      });

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
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Save Changes to Board Description" }
      });

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
    this.checkBoardBackground();
  }

  checkBoardBackground() {
    let colors = ['#ffffff', '#fefefe', '#fdfdfd', '#fcfcfc', '#fbfbfb', '#fafafa', '#f9f9f9', '#f8f8f8', '#f7f7f7', '#f6f6f6', '#f5f5f5', '#f4f4f4', '#f3f3f3', '#f2f2f2', '#f1f1f1', '#f0f0f0', '#efefef', '#eeeeee', '#ededed', '#ececec', '#ebebeb', '#eaeaea', '#e9e9e9', '#e8e8e8', '#e7e7e7', '#e6e6e6', '#e5e5e5', '#e4e4e4', '#e3e3e3', '#e2e2e2', '#e1e1e1', '#e0e0e0'];
    if (colors.indexOf(this.boardBackground) != -1) {
      this.lightBackground = true;
    }
    else {
      this.lightBackground = false;
    }
  }

  deleteBoard() {
    this.board.deleted = true;
    this.updateBoard();
    this.router.navigate(['/boards']);
  }

  deleteBoardDialog() {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete Board " + this.board.title }
    });

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
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Leave Board " + this.board.title }
    });

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

  renameList(index) {
    if (this.listTitleRename.trim() != this.board.lists[index].title && this.listTitleRename.trim() != "") {
      this.board.lists[index].title = this.listTitleRename.trim();
      this.updateBoard();
      this.listTitleRename = this.board.lists[index].title;
    }
    else {
      this.listTitleRename = this.board.lists[index].title;
    }
  }

  saveListTitleDialog(index) {
    if (this.listTitleRename.trim() != this.board.lists[index].title && this.listTitleRename.trim() != "") {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Save Changes to List Title" }
      });

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
    }
  }

  copyAllCardsDialog(indexFromList, indexToList) {
    if (indexToList != undefined) {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Copy All Cards from " + this.board.lists[indexFromList].title + " to " + this.board.lists[indexToList].title }
      });

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
    }

  }

  moveAllCardsDialog(indexFromList, indexToList) {
    if (indexToList != undefined) {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Move All Cards from " + this.board.lists[indexFromList].title + " to " + this.board.lists[indexToList].title }
      });

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
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete All Cards from " + this.board.lists[index].title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists[index].cards = [];
        this.updateBoard();
      }
    });
  }

  deleteListDialog(index) {
    const dialogRef = this.dialog.open(DialogSaveChanges, {
      data: { title: "Confirmation", content: "Delete this list" }
    });

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
    }

  }

  moveListDialog(indexFromList, position, indexToList) {
    if (indexToList != undefined && position != undefined) {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { title: "Unsaved Changes", content: "Move List " + position + " " + this.board.lists[indexToList].title }
      });

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

  calculateCheckedTasks(listIndex, cardIndex){
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
    this.dialogRef = this.dialog.open(CardDetailsComponent, { data: { board: this.board, listIndex: listIndex, cardIndex: cardIndex , checkedNumber: this.calculateCheckedTasks(listIndex, cardIndex)}, autoFocus: false });
  }

  updateBoard() {
    this.wc.send("/app/boards/update/" + this.board.id, {}, JSON.stringify(this.board));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
