import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatMenuTrigger, ThemePalette } from '@angular/material';
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
import { Team } from '../models/team.model';
import { TeamService } from '../teams/team.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent {
  @ViewChildren('cardTitleInput') cardTitleElements: ElementRef;
  @ViewChild('listTitleInput') listTitleElement: ElementRef;
  @ViewChild('boardMoreTrigger') boardMoreTrigger: MatMenuTrigger;
  @ViewChild('listMoreTrigger') listMoreTrigger: MatMenuTrigger;
  @Input() data: any;

  private dialogRef: MatDialogRef<CardDetailsComponent>;

  checkboxColor: ThemePalette = 'warn';

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

  newTeam: Team;
  errorMessageNewTeam = undefined;

  template: Board;
  errorMessageCreateFromTemplate = undefined;

  listTitleRename = "";

  selectedCopyAllCards;
  selectedMoveAllCards;
  selectedMoveListPosition;
  selectedMoveList;

  lightBackground = true;

  listTitle = "";

  showAddCardBool = false;
  cardTitle = {};

  selectedTeam: Team;
  checkedTeamMembers = [];
  errorMessageNewUsersFromTeam = undefined;

  checked: number[] = [];

  private wc;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private boardService: BoardService, private webSocketService: WebSocketService, private userService: UserService, private authService: AuthService, private router: Router, private colorsService: ColorsService, private dialogService: DialogService, private snackBarService: SnackBarService, private teamService: TeamService) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return
    }
    let id = this.route.snapshot.paramMap.get("id");
    let listId = this.route.snapshot.paramMap.get("listId");
    let cardId = this.route.snapshot.paramMap.get("cardId");

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

      if (listId && cardId) {
        let listIndex = this.board.lists.indexOf(this.board.lists.filter((list) => list.id == listId)[0]);
        let cardIndex = this.board.lists[listIndex].cards.indexOf(this.board.lists[listIndex].cards.filter((card) => card.id == cardId)[0]);
        this.openCardDetailsDialog(listIndex, cardIndex);
      }
    }, error => {
      this.router.navigate(['/']);
    });

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
    });

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.wc.subscribe("/topic/boards/update/" + id, (msg) => {
        if (JSON.parse(msg.body).statusCodeValue == 204) {
          const dialogRef = this.dialogService.openDialog(DialogOkComponent, "Content Deleted", "The owner has deleted the board");

          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/']);
          });

        }
        else {
          let data = JSON.parse(msg.body).body;
          this.board = data;

          if (!this.board.users.some(user => user.id == this.currentUser.id)) {
            const dialogRef = this.dialogService.openDialog(DialogOkComponent, "Content not available", "You have been deleted from board");

            dialogRef.afterClosed().subscribe(result => {
              this.router.navigate(['/']);
            });
          }

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
  }

  ngOnDestroy() {
    if (this.wc && this.authService.isLoggedIn()) {
      this.wc.disconnect();
    }
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
        done: false,
        doneDate: null,
        activities: [],
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
    this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
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
      this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
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
    this.router.navigate(['/']);
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
      let index = this.board.users.findIndex((user) => user.id == this.currentUser.id);
      this.board.users.splice(index, 1);
      this.updateBoard();
      this.wc.disconnect();
      this.router.navigate(['/']);
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
    this.newUser = this.newUser.trim()
    if (this.newUser != "") {
      if (this.newUser.startsWith("@")) {
        this.newUser = this.newUser.slice(1);
      }
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

  resetAddUser() {
    this.newUser = "";
    this.errorMessageNewUser = undefined;
  }

  deleteUser(index) {
    this.userService.leaveBoard(this.board.id, this.board.users[index].id).subscribe(data => {
      this.wc.send("/app/users/update/" + this.board.users[index].email, {}, JSON.stringify(this.board.users[index]));
      this.board.lists.forEach((list, listIndex) => {
        list.cards.forEach((card, cardIndex) => {
          members_loop:
          for (let memberIndex = 0; memberIndex < card.members.length; memberIndex++) {
            if (card.members[memberIndex].id == this.board.users[index].id) {
              for (let teamIndex = 0; teamIndex < this.board.teams.length; teamIndex++) {
                if (!this.board.teams[teamIndex].members.some(member => card.members[memberIndex].id == member.id)) {
                  this.board.lists[listIndex].cards[cardIndex].members.splice(memberIndex, 1);
                  break members_loop;
                }
              }
            }
          }
        })
      })
      this.board.users.splice(index, 1);
      this.updateBoard();
      this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
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

  addTeam() {
    if (this.newTeam != undefined) {
      this.teamService.getOne(this.newTeam.id, this.currentUser.email).subscribe(data => {
        if (data) {
          this.errorMessageNewTeam = undefined;
          this.board.teams.forEach(team => {
            if (team.id == data.id) {
              this.errorMessageNewTeam = "That team already exists";
            }
          });
          if (this.errorMessageNewTeam) {
            return;
          }
          this.board.teams.push(data);
          this.updateBoard();
          this.board.teams = []
          data.boards.push(this.board);
          this.wc.send("/app/teams/update/" + data.id, {}, JSON.stringify(data));
          this.resetAddTeam();
          this.snackBarService.openSuccessSnackBar("Successfully added", "X");
        }
      }, error => {
        this.errorMessageNewTeam = "That team does not exist"
      });
    }
    else {
      this.resetAddTeam();
    }
  }

  resetAddTeam() {
    this.newTeam = undefined;
    this.errorMessageNewTeam = undefined;
  }

  deleteTeam(index) {
    this.board.lists.forEach((list, listIndex) => {
      list.cards.forEach((card, cardIndex) => {
        for (let memberIndex = 0; memberIndex < card.members.length; memberIndex++) {
          for (let teamIndex = 0; teamIndex < this.board.teams.length; teamIndex++) {
            if (this.board.teams[teamIndex].members.some(member => card.members[memberIndex].id == member.id)) {
              if (!this.board.users.some(user => user.id == this.board.lists[listIndex].cards[cardIndex].members[memberIndex].id)) {
                this.board.lists[listIndex].cards[cardIndex].members.splice(memberIndex, 1);
                break;
              }
            }
          }
        }
      })
    })
    this.teamService.leaveBoard(this.board.id, this.board.teams[index].id).subscribe();
    this.board.teams.splice(index, 1);
    this.updateBoard();
    this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");

  }

  deleteTeamDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this team");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTeam(index);
      }
    });
  }

  createFromTemplate() {
    if (this.template) {
      this.template.id = this.board.id;
      this.template.title = this.board.title;
      this.board = this.template;
      if (this.dialogRef && this.dialogRef.componentInstance) {
        if (this.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex] == undefined || this.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex].id != this.dialogRef.componentInstance.data.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex].id) {
          this.dialogRef.close();
        }
        this.dialogRef.componentInstance.data.board = this.board;
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
      this.updateBoard();
      this.resetCreateFromTemplate();
    }
  }

  resetCreateFromTemplate() {
    this.template = undefined;
    this.errorMessageCreateFromTemplate = undefined;
  }

  addTemplate() {
    this.currentUser.templates.push(this.board);
    this.wc.send("/app/users/update/" + this.currentUser.email, {}, JSON.stringify(this.currentUser));
    this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
  }

  renameList(index) {
    if (this.listTitleRename.trim() != this.board.lists[index].title && this.listTitleRename.trim() != "") {
      this.board.lists[index].title = this.listTitleRename.trim();
      this.updateBoard();
      this.listTitleRename = this.board.lists[index].title;
      this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
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
      this.snackBarService.openSuccessSnackBar("Successfully copied", "X");
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
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
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
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
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

  addUsersFromTeam() {
    if (this.selectedTeam) {
      if (this.checkedTeamMembers.includes(true)) {
        for (let index = 0; index < this.checkedTeamMembers.length; index++) {
          if (this.checkedTeamMembers[index]) {
            let newUser = this.selectedTeam.members[index];

            let userExists = false;
            this.board.users.forEach(user => {
              if (user.id == newUser.id) {
                userExists = true;
              }
            });
            if (userExists) {
              continue;
            }
            this.board.users.push(newUser);
            this.updateBoard();
            this.board.users = []
            newUser.boards.push(this.board);
            this.wc.send("/app/users/update/" + newUser.email, {}, JSON.stringify(newUser));
          }
        }
        this.resetAddUsersFromTeam();
        this.snackBarService.openSuccessSnackBar("Successfully added", "X");
      }
      else {
        this.snackBarService.openErrorSnackBar("No users selected", "X");
      }
    }
    else {
      this.snackBarService.openErrorSnackBar("No team selected", "X");
    }
  }

  setTeamMembersChecked() {
    this.checkedTeamMembers = [];
    this.selectedTeam.members.forEach(member => {
      this.checkedTeamMembers.push(true);
    })
  }

  resetAddUsersFromTeam() {
    this.selectedTeam = undefined;
    this.errorMessageNewUsersFromTeam = undefined;
  }

  openCardDetailsDialog(listIndex, cardIndex, tabIndex = 0) {
    this.dialogRef = this.dialog.open(CardDetailsComponent, { data: { board: this.board, listIndex: listIndex, cardIndex: cardIndex, checkedNumber: this.calculateCheckedTasks(listIndex, cardIndex), tabIndex: tabIndex }, autoFocus: false, width: '50%' });
  }

  updateBoard() {
    this.wc.send("/app/boards/update/" + this.board.id, {}, JSON.stringify(this.board));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
