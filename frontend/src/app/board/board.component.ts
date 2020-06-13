import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BoardService } from '../boards/board.service';
import { CardDetailsComponent } from '../card-details/card-details.component';
import { DialogOkComponent } from '../dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Activity } from '../models/activity.model';
import { Board } from '../models/board.model';
import { Team } from '../models/team.model';
import { ColorsService } from '../shared/colors.service';
import { DateService } from '../shared/date.service';
import { DialogService } from '../shared/dialog.service';
import { RoutesService } from '../shared/routes.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { TeamService } from '../teams/team.service';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';

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

  selectedCopyListPosition;
  selectedCopyList;
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

  selectedMoveBoard: Board;
  allUserBoards: Board[];

  private wc;
  private subscription;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private routesService: RoutesService, private boardService: BoardService, private webSocketService: WebSocketService, public userService: UserService, private authService: AuthService, private router: Router, private colorsService: ColorsService, private dialogService: DialogService, private snackBarService: SnackBarService, private teamService: TeamService, public dateService: DateService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return
    }
    let id = this.route.snapshot.paramMap.get("id");
    let listId = this.route.snapshot.paramMap.get("listId");
    let cardId = this.route.snapshot.paramMap.get("cardId");
    let listIndex = this.route.snapshot.paramMap.get("listIndex");
    let cardIndex = this.route.snapshot.paramMap.get("cardIndex");
    let tabIndex = this.route.snapshot.paramMap.get("tabIndex") ? +this.route.snapshot.paramMap.get("tabIndex") : 0;

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
        let listIndexFromId = this.board.lists.indexOf(this.board.lists.filter((list) => list.id == listId)[0]);
        let cardIndexFromId = this.board.lists[listIndexFromId].cards.indexOf(this.board.lists[listIndexFromId].cards.filter((card) => card.id == cardId)[0]);
        if (this.board.lists[listIndexFromId].cards[cardIndexFromId]) {
          this.openCardDetailsDialog(listIndexFromId, cardIndexFromId);
        }
      }

      if (listIndex && cardIndex && this.board.lists[listIndex].cards[cardIndex]) {
        this.openCardDetailsDialog(listIndex, cardIndex, tabIndex);
      }
    }, error => {
      this.router.navigate(['/'])
      return;
    });

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
      this.allUserBoards = this.currentUser.boards.concat(...this.currentUser.teams.map(team => team.boards));
    });

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.subscription = this.wc.subscribe("/topic/boards/update/" + id, (msg) => {
        if (JSON.parse(msg.body).statusCodeValue == 204 && this.board.users[0].id != this.currentUser.id) {
          const dialogRef = this.dialogService.openDialog(DialogOkComponent, "Content Deleted", "The owner has deleted the board");
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/']);
          });
        }
        else {
          this.boardService.getOne(id, this.authService.getCurrentUser()).subscribe(board => {
            this.board = board;
            if (this.dialogRef && this.dialogRef.componentInstance) {
              if (this.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex] == undefined || this.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex].id != this.dialogRef.componentInstance.data.board.lists[this.dialogRef.componentInstance.data.listIndex].cards[this.dialogRef.componentInstance.data.cardIndex].id) {
                this.dialogRef.close();
              }
              this.dialogRef.componentInstance.data.board = board;
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
            });
            this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
              this.currentUser = currentUser;
              this.allUserBoards = this.currentUser.boards.concat(...this.currentUser.teams.map(team => team.boards));
            });
          }, error => {
            this.router.navigate(['/']);
          })
        }
      })
    })
  }

  ngOnDestroy() {
    try {
      this.dialogRef.close();
      this.subscription.unsubscribe();
      this.wc.disconnect();
    }
    catch {

    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.webSocketService.updateBoard(this.board, this.wc);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.webSocketService.updateBoard(this.board, this.wc);
    }
  }

  dropList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.board.lists, event.previousIndex, event.currentIndex);
    this.webSocketService.updateBoard(this.board, this.wc);
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
      this.addActivity(this.currentUser.id, this.currentUser.fullName, "added list", this.routesService.getBoardRoute(this.board.id), this.listTitle.trim(), "to board");
    }
    else{
      this.snackBarService.openErrorSnackBar("No list title entered", "X");
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
        activities: [new Activity(null, this.currentUser.id, this.currentUser.fullName, "created this card", this.board.id, this.board.title)],
        skills: [],
        deleted: false
      });
      this.addActivity(this.currentUser.id, this.currentUser.fullName, "added card", this.routesService.getCardRouteIndices(this.board.id, index, this.board.lists[index]['cards'].length - 1), this.cardTitle[index].trim(), `to list ${this.board.lists[index].title}`);
    }
    else{
      this.snackBarService.openErrorSnackBar("No card title entered", "X");
    }
    this.cardTitle[index] = "";
    this.cardTitleElements['_results'][index].nativeElement.focus();
  }

  saveBoardDescription() {
    this.board.description = this.boardDescription.trim();
    this.boardDescription = this.board.description;
    this.addActivity(this.currentUser.id, this.currentUser.fullName, "updated description of board");
    this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
  }

  deleteAllListsDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete All Lists");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists = [];
        this.addActivity(this.currentUser.id, this.currentUser.fullName, "deleted all lists");
      }
    });
  }

  renameBoard() {
    if (this.boardTitle.trim() != this.board.title && this.boardTitle.trim() != "") {
      let oldBordTitle = this.board.title;
      this.board.title = this.boardTitle.trim();
      this.boardTitle = this.board.title;
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `renamed board ${oldBordTitle} to ${this.board.title}`);
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
    this.addActivity(this.currentUser.id, this.currentUser.fullName, "changed background of board");
    this.lightBackground = this.colorsService.checkBackground(this.boardBackground);
  }

  deleteBoard() {
    this.board.deleted = true;
    this.addActivityWebSocketFromServer(this.currentUser.id, this.currentUser.fullName, "deleted board");
    //this.router.navigate(['/']);
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
      this.addActivity(this.currentUser.id, this.currentUser.fullName, "left board");
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
          this.addActivity(this.currentUser.id, this.currentUser.fullName, "added user", this.routesService.getUserRoute(data.id), data.fullName, "to board");
          this.board.users = []
          data.boards.push(this.board);
          this.webSocketService.updateUser(data, this.wc);
          this.resetAddUser();
          this.snackBarService.openSuccessSnackBar("Successfully added", "X");
        }
      }, error => {
        this.errorMessageNewUser = "That user does not exist"
      });
    }
    else {
      this.resetAddUser();
      this.snackBarService.openErrorSnackBar("No email address or username entered", "X");
    }
  }

  resetAddUser() {
    this.newUser = "";
    this.errorMessageNewUser = undefined;
  }

  deleteUser(index) {
    this.userService.leaveBoard(this.board.id, this.board.users[index].id).subscribe(data => {
      this.webSocketService.notifyUser(this.board.users[index], this.wc);
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
      let oldUser = this.board.users[index];
      this.board.users.splice(index, 1);
      this.addActivity(this.currentUser.id, this.currentUser.fullName, "deleted user", this.routesService.getUserRoute(oldUser.id), oldUser.fullName, "from board");
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
          this.addActivity(this.currentUser.id, this.currentUser.fullName, "added team", this.routesService.getTeamRoute(this.newTeam.id), this.newTeam.name, "to board");
          this.board.teams = []
          data.boards.push(this.board);
          this.webSocketService.updateTeam(data, this.wc);
          this.resetAddTeam();
          this.snackBarService.openSuccessSnackBar("Successfully added", "X");
        }
      }, error => {
        this.errorMessageNewTeam = "That team does not exist"
      });
    }
    else {
      this.resetAddTeam();
      this.snackBarService.openErrorSnackBar("No team selected", "X");
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
    this.addActivity(this.currentUser.id, this.currentUser.fullName, "deleted team", this.routesService.getTeamRoute(this.board.teams[index].id), this.board.teams[index].name, "from board");
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
      this.addActivity(this.currentUser.id, this.currentUser.fullName, "created board", this.routesService.getBoardRoute(this.board.id), this.board.title, "from template", null, null, null, null);
      this.snackBarService.openSuccessSnackBar("Successfully created", "X");
      this.resetCreateFromTemplate();
    }
    else {
      this.snackBarService.openErrorSnackBar("No template selected", "X");
    }
  }

  resetCreateFromTemplate() {
    this.template = undefined;
    this.errorMessageCreateFromTemplate = undefined;
  }

  addTemplate() {
    let newTemplate = this.board;
    newTemplate.id = null;
    this.currentUser.templates.push(newTemplate);
    this.webSocketService.updateUser(this.currentUser, this.wc);
    this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
  }

  renameList(index) {
    if (this.listTitleRename.trim() != this.board.lists[index].title && this.listTitleRename.trim() != "") {
      let oldListTitle = this.board.lists[index].title;
      this.board.lists[index].title = this.listTitleRename.trim();
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `renamed list ${oldListTitle} to ${this.board.lists[index].title}`);
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

  copyAllCards(indexFromList, indexToList, selectedMoveBoard) {
    if (indexFromList != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      let newCards = this.board.lists[indexFromList].cards;
      newCards.forEach(card => {
        card.id = null;
      })
      selectedMoveBoard.lists[indexToList].cards = selectedMoveBoard.lists[indexToList].cards.concat(newCards);
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `copied all cards from list ${this.board.lists[indexFromList].title} to list ${selectedMoveBoard.lists[indexToList].title}` + " on board " + selectedMoveBoard.title);
      this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
      this.selectedCopyAllCards = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully copied", "X");
    }
    else if (selectedMoveBoard == undefined) {
      this.snackBarService.openErrorSnackBar("No board selected", "X");
    }
    else if (indexToList == undefined) {
      this.snackBarService.openErrorSnackBar("No list selected", "X");
    }
  }

  copyAllCardsDialog(indexFromList, indexToList, selectedMoveBoard) {
    if (indexFromList != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Copy All Cards from " + this.board.lists[indexFromList].title + " to " + selectedMoveBoard.lists[indexToList].title + " on board " + selectedMoveBoard.title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.copyAllCards(indexFromList, indexToList, selectedMoveBoard);
        }
        else {
          this.selectedCopyAllCards = undefined;
          this.selectedMoveBoard = undefined;
        }
      });
    }
    else {
      this.selectedCopyAllCards = undefined;
      this.selectedMoveBoard = undefined;
    }
  }

  moveAllCards(indexFromList, indexToList, selectedMoveBoard) {
    if (indexFromList != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      selectedMoveBoard.lists[indexToList].cards = selectedMoveBoard.lists[indexToList].cards.concat(this.board.lists[indexFromList].cards);
      this.board.lists[indexFromList].cards = [];
      this.addActivity(this.currentUser.id, this.currentUser.fullName, `moved all cards from list ${this.board.lists[indexFromList].title} to list ${selectedMoveBoard.lists[indexToList].title}` + " on board " + selectedMoveBoard.title);
      if (this.board.id == selectedMoveBoard.id) {
        selectedMoveBoard.lists[indexFromList].cards = [];
      }
      this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
      this.selectedMoveAllCards = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
    }
    else if (selectedMoveBoard == undefined) {
      this.snackBarService.openErrorSnackBar("No board selected", "X");
    }
    else if (indexToList == undefined) {
      this.snackBarService.openErrorSnackBar("No list selected", "X");
    }
  }

  moveAllCardsDialog(indexFromList, indexToList, selectedMoveBoard) {
    if (indexToList != undefined && selectedMoveBoard != undefined) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Move All Cards from " + this.board.lists[indexFromList].title + " to " + selectedMoveBoard.lists[indexToList].title + " on board " + selectedMoveBoard.title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.moveAllCards(indexFromList, indexToList, selectedMoveBoard);
        }
        else {
          this.selectedMoveAllCards = undefined;
          this.selectedMoveBoard = undefined;
        }
      });
    }
    else {
      this.selectedMoveAllCards = undefined;
      this.selectedMoveBoard = undefined;
    }
  }

  deleteAllCardsDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete All Cards from " + this.board.lists[index].title);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists[index].cards = [];
        this.addActivity(this.currentUser.id, this.currentUser.fullName, `deleted all cards from list ${this.board.lists[index].title}`);
        this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
      }
    });
  }

  deleteListDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this list");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.lists[index].deleted = true;
        this.addActivity(this.currentUser.id, this.currentUser.fullName, `deleted list`, this.routesService.getBoardRoute(this.board.id), this.board.lists[index].title, "from board");
        this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
      }
    });
  }

  copyList(indexFromList, position, indexToList, selectedMoveBoard) {
    if (indexFromList != undefined && position != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      let index = indexToList;
      let newList = this.board.lists[indexFromList];
      newList.id = null;
      if (this.board.id != selectedMoveBoard.id) {
        if (position == "after") {
          index++;
        }
        selectedMoveBoard.lists.splice(index, 0, newList);
        this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
      }
      else {
        if (position == "before" && index != 0 && indexToList > indexFromList) {
          index--;
        }
        else if (position == "after" && index != selectedMoveBoard.lists.length - 1 && indexToList < indexFromList) {
          index++;
        }
        this.board.lists.splice(index, 0, newList);
        this.webSocketService.updateBoard(this.board, this.wc);
      }
      this.selectedCopyList = undefined;
      this.selectedCopyListPosition = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
    }
    else if (selectedMoveBoard && selectedMoveBoard.lists.length < 2) {
      let index = 0;
      let newList = this.board.lists[indexFromList];
      newList.id = null;
      if (this.board.id != selectedMoveBoard.id) {
        selectedMoveBoard.lists.splice(index, 0, newList);
        this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
      }
      else {
        this.board.lists.splice(index, 0, newList);
        this.webSocketService.updateBoard(this.board, this.wc);
      }
      this.selectedCopyList = undefined;
      this.selectedCopyListPosition = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
    }

  }

  copyListDialog(indexFromList, position, indexToList, selectedMoveBoard) {
    if ((indexFromList != undefined && position != undefined && indexToList != undefined && selectedMoveBoard) || (selectedMoveBoard && selectedMoveBoard.lists.length < 2)) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Copy List " + position + " " + this.board.lists[indexToList].title + " on board " + selectedMoveBoard?.title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.copyList(indexFromList, position, indexToList, selectedMoveBoard);
        }
        else {
          this.selectedCopyList = undefined;
          this.selectedCopyListPosition = undefined;
          this.selectedMoveBoard = undefined;
        }
      });
    }
    else {
      this.selectedCopyList = undefined;
      this.selectedCopyListPosition = undefined;
      this.selectedMoveBoard = undefined;
    }
  }

  moveList(indexFromList, position, indexToList, selectedMoveBoard) {
    if (indexFromList != undefined && position != undefined && indexToList != undefined && selectedMoveBoard != undefined) {
      let index = indexToList;
      if (this.board.id != selectedMoveBoard.id) {
        if (position == "after") {
          index++;
        }
        selectedMoveBoard.lists.splice(index, 0, this.board.lists.splice(indexFromList, 1)[0]);
        this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
        this.webSocketService.updateBoard(this.board, this.wc);
      }
      else {
        if (position == "before" && index != 0 && indexToList > indexFromList) {
          index--;
        }
        else if (position == "after" && index != selectedMoveBoard.lists.length - 1 && indexToList < indexFromList) {
          index++;
        }
        this.board.lists.splice(index, 0, this.board.lists.splice(indexFromList, 1)[0]);
        this.webSocketService.updateBoard(this.board, this.wc);
      }
      this.selectedMoveList = undefined;
      this.selectedMoveListPosition = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
    }
    else if (selectedMoveBoard && selectedMoveBoard.lists.length == 0) {
      let index = 0;
      if (this.board.id != selectedMoveBoard.id) {
        selectedMoveBoard.lists.splice(index, 0, this.board.lists.splice(indexFromList, 1)[0]);
        this.webSocketService.updateBoard(selectedMoveBoard, this.wc);
        this.webSocketService.updateBoard(this.board, this.wc);
      }
      else {
        this.board.lists.splice(index, 0, this.board.lists.splice(indexFromList, 1)[0]);
        this.webSocketService.updateBoard(this.board, this.wc);
      }
      this.selectedMoveList = undefined;
      this.selectedMoveListPosition = undefined;
      this.selectedMoveBoard = undefined;
      this.snackBarService.openSuccessSnackBar("Successfully moved", "X");
    }

  }

  moveListDialog(indexFromList, position, indexToList, selectedMoveBoard) {
    if ((indexFromList != undefined && position != undefined && indexToList != undefined && selectedMoveBoard) || (selectedMoveBoard && selectedMoveBoard.lists.length == 0)) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Move List " + position + " " + this.board.lists[indexToList].title + " on board " + selectedMoveBoard.title);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.moveList(indexFromList, position, indexToList, selectedMoveBoard);
        }
        else {
          this.selectedMoveList = undefined;
          this.selectedMoveListPosition = undefined;
          this.selectedMoveBoard = undefined;
        }
      });
    }
    else {
      this.selectedMoveList = undefined;
      this.selectedMoveListPosition = undefined;
      this.selectedMoveBoard = undefined;
    }
  }

  calculateCheckedTasks(listIndex, cardIndex) {
    let checkedNumber: number[] = [];
    let sum = 0;
    this.board.lists[listIndex].cards[cardIndex]?.checklists.forEach(checklist => {
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
            let activityAction = "added all users from team";
            if (this.selectedTeam.members.length != this.checkedTeamMembers.length) {
              activityAction = "added some users from team";
            }
            this.addActivity(this.currentUser.id, this.currentUser.fullName, activityAction, this.routesService.getTeamRoute(this.selectedTeam.id), this.selectedTeam.name);
            this.board.users = []
            newUser.boards.push(this.board);
            this.webSocketService.updateUser(newUser, this.wc);
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
    this.dialogRef = this.dialog.open(CardDetailsComponent, { data: { board: this.board, listIndex: listIndex, cardIndex: cardIndex, checkedNumber: this.calculateCheckedTasks(listIndex, cardIndex), tabIndex: tabIndex }, autoFocus: false, width: '80%' });
  }

  addActivity(performerId: string, performerFullName: string, action: string, objectLink: string = null, objectName: string = null, location: string = null, locationObjectLink: string = null, locationObjectName: string = null, boardId: string = this.board.id, boardName: string = this.board.title) {
    let activity = new Activity(null, performerId, performerFullName, action, boardId, boardName, objectLink, objectName, location, locationObjectLink, locationObjectName);
    this.board.activities.unshift(activity);
    this.webSocketService.updateBoard(this.board, this.wc);
    this.currentUser.activities.unshift(activity);
    this.webSocketService.updateUser(this.currentUser, this.wc);
  }

  addActivityWebSocketFromServer(performerId: string, performerFullName: string, action: string, objectLink: string = null, objectName: string = null, location: string = null, locationObjectLink: string = null, locationObjectName: string = null, boardId: string = this.board.id, boardName: string = this.board.title) {
    let activity = new Activity(null, performerId, performerFullName, action, boardId, boardName, objectLink, objectName, location, locationObjectLink, locationObjectName);
    this.board.activities.unshift(activity);
    this.boardService.update(this.board.id, this.board).subscribe();
    this.currentUser.activities.unshift(activity);
    this.webSocketService.updateUser(this.currentUser, this.wc);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
