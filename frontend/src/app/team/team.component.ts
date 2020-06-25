import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BoardService } from '../boards/board.service';
import { DialogOkComponent } from '../dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Activity } from '../models/activity.model';
import { Board } from '../models/board.model';
import { Team } from '../models/team.model';
import { ColorsService } from '../shared/colors.service';
import { DialogService } from '../shared/dialog.service';
import { RoutesService } from '../shared/routes.service';
import { SnackBarService } from '../shared/snack-bar.service';
import { TeamService } from '../teams/team.service';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeamComponent implements OnInit {

  @ViewChild('boardTitleInput') boardTitleElement: ElementRef;
  @ViewChild('newMemberInput') newMemberElement: ElementRef;

  loading = true;

  currentUser = undefined;

  private wc;
  private subscription;

  team: Team;

  teamDescription = "";
  teamName = "";
  teamBackground = "";

  boards: Board[];

  teams: Team[];

  boardTitle = "";
  newMember = "";

  lightBackground = false;

  constructor(private boardService: BoardService, private routesService: RoutesService, private snackBarService: SnackBarService, private dialogService: DialogService, private route: ActivatedRoute, private authService: AuthService, private router: Router, public userService: UserService, private webSocketService: WebSocketService, public colorsService: ColorsService, private teamService: TeamService) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    let id = this.route.snapshot.paramMap.get("id");

    this.teamService.getOne(id, this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.team = data;

      this.teamDescription = this.team.description;
      this.teamName = this.team.name;
      this.teamBackground = this.team.background;
      this.lightBackground = this.colorsService.checkBackground(this.teamBackground);
    }, error => {
      this.router.navigate(['/home']);
    });

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.subscription = this.wc.subscribe("/topic/teams/update/" + id, (msg) => {
        if (JSON.parse(msg.body).statusCodeValue == 204 && this.team.members[0].id != this.currentUser.id) {
          const dialogRef = this.dialogService.openDialog(DialogOkComponent, "Content Deleted", "The owner has deleted the team");
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/home']);
          });
        }
        else {
          this.teamService.getOne(id, this.authService.getCurrentUser()).subscribe(team => {
            let data = team;
            this.team = data;

            this.teamDescription = this.team.description;
            this.teamName = this.team.name;
            this.teamBackground = this.team.background;
            this.lightBackground = this.colorsService.checkBackground(this.teamBackground);
          }, error => {
            this.router.navigate(['/home']);
          })
        }
      })
    })

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
    })
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  addBoard() {
    if (this.boardTitle.trim() != "") {
      this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
        this.boardService.add(
          {
            id: null,
            title: this.boardTitle.trim(),
            date: new Date(),
            description: "",
            background: "#55aa55",
            users: [currentUser],
            teams: [this.team],
            lists: [],
            priority: 1,
            activities: [],
            parentBoard: null,
            childBoards: [],
            deleted: false
          }
        ).subscribe(data => {
          let newBoard: any = data;
          let activity = new Activity(null, this.currentUser.id, this.currentUser.fullName, "created board", null, null, this.routesService.getBoardRoute(newBoard.id), newBoard.title);
          newBoard.activities.unshift(activity);
          this.webSocketService.updateBoard(newBoard, this.wc);
          this.team.boards.push(newBoard);
          this.webSocketService.updateTeam(this.team, this.wc);
          this.boardTitle = "";
          this.boardTitleElement.nativeElement.focus();
        });
      })
    }
    else {
      this.boardTitle = "";
      this.boardTitleElement.nativeElement.focus();
    }

  }

  addMember() {
    this.newMember = this.newMember.trim();
    if (this.newMember != "") {
      if (this.newMember.startsWith("@")) {
        this.newMember = this.newMember.slice(1);
      }
      this.userService.getByQuery(this.newMember).subscribe(data => {
        if (data) {
          let errorMessageNewUser = undefined;
          this.team.members.forEach(member => {
            if (member.id == data.id) {
              errorMessageNewUser = "That user already exists";
            }
          });
          if (errorMessageNewUser) {
            this.snackBarService.openErrorSnackBar(errorMessageNewUser, "X");
            return;
          }
          data.teams.push(this.team);
          this.webSocketService.updateUser(data, this.wc);
          data.teams = [];
          this.team.members.push(data);
          this.webSocketService.updateTeam(this.team, this.wc);
          this.newMember = "";
          this.newMemberElement.nativeElement.focus();
          this.snackBarService.openSuccessSnackBar("Successfully added", "X");
        }
      }, error => {
        this.snackBarService.openErrorSnackBar("That user does not exist", "X");
      });
    }
    else {
      this.newMember = "";
      this.newMemberElement.nativeElement.focus();
    }
  }

  deleteMember(index) {
    this.userService.leaveTeam(this.team.id, this.team.members[index].id).subscribe(data => {
      this.webSocketService.notifyUser(this.team.members[index], this.wc);
      this.team.boards.forEach((board, boardIndex) => {
        board.lists.forEach((list, listIndex) => {
          list.cards.forEach((card, cardIndex) => {
            for (let memberIndex = 0; memberIndex < card.members.length; memberIndex++) {
              if (card.members[memberIndex].id == this.team.members[index].id) {
                this.team.boards[boardIndex].lists[listIndex].cards[cardIndex].members.splice(memberIndex, 1);
                break;
              }
            }
          })
        })
      })
      this.team.members.splice(index, 1);
      this.webSocketService.updateTeam(this.team, this.wc);
      this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");
    });

  }

  deleteMemberDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this member");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMember(index);
      }
    });
  }

  saveTeamDescription() {
    this.team.description = this.teamDescription.trim();
    this.teamDescription = this.team.description;
    this.webSocketService.updateTeam(this.team, this.wc);
    this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
  }

  renameTeam() {
    if (this.teamName.trim() != this.team.name && this.teamName.trim() != "") {
      this.team.name = this.teamName.trim();
      this.teamName = this.team.name;
      this.webSocketService.updateTeam(this.team, this.wc);
      this.snackBarService.openSuccessSnackBar("Successfully saved", "X");
    }
    else {
      this.teamName = this.team.name;
    }
  }

  saveTeamNameDialog() {
    if (this.teamName.trim() != this.team.name && this.teamName.trim() != "") {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to Team Name");

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameTeam()
        }
        else {
          this.teamName = this.team.name;
        }
      });
    }
    else {
      this.teamName = this.team.name;
    }
  }

  saveTeamDescriptionDialog() {
    if (this.teamDescription.trim() != this.team.description) {
      const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Unsaved Changes", "Save Changes to Board Description");

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveTeamDescription()
        }
        else {
          this.teamDescription = this.team.description;
        }
      });
    }
  }

  changeBackground() {
    this.team.background = this.teamBackground;
    this.webSocketService.updateTeam(this.team, this.wc);
    this.lightBackground = this.colorsService.checkBackground(this.teamBackground);
  }

  deleteTeam() {
    this.team.deleted = true;
    this.teamService.update(this.team.id, this.team).subscribe();
    this.router.navigate(['/home']);
  }

  deleteTeamDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete Team " + this.team.name);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTeam();
      }
    });
  }

  leaveTeam(index?) {
    this.userService.leaveTeam(this.team.id, this.currentUser.id).subscribe(data => {
      if (!index) {
        index = this.team.members.findIndex((member) => member.id == this.currentUser.id);
      }
      this.team.members.splice(index, 1);
      this.webSocketService.updateTeam(this.team, this.wc);
      this.wc.disconnect();
      this.router.navigate(['/home']);
    });
  }

  leaveTeamDialog(index?) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Leave Team " + this.team.name);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leaveTeam(index);
      }
    });
  }

  logout() {
    this.authService.logout();
    //this.router.navigate(['/login']);
  }

  dropBoard(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.team.boards, event.previousIndex, event.currentIndex);
    this.webSocketService.updateTeam(this.team, this.wc);
  }

  disconnectWebSocket(){
    try {
      this.subscription.unsubscribe();
      this.wc.disconnect();
    }
    catch {

    }
  }

  /* dropMember(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.team.members, event.previousIndex, event.currentIndex);
    this.webSocketService.updateTeam(this.team, this.wc);
  } */

}
