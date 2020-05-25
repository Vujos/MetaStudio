import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BoardService } from '../boards/board.service';
import { DialogOkComponent } from '../dialog-ok/dialog-ok.component';
import { DialogSaveChanges } from '../dialog/dialog-save-changes';
import { Board } from '../models/board.model';
import { Team } from '../models/team.model';
import { ColorsService } from '../shared/colors.service';
import { DialogService } from '../shared/dialog.service';
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

  @ViewChild('boardTitleInput', { static: false }) boardTitleElement: ElementRef;
  @ViewChild('newMemberInput', { static: false }) newMemberElement: ElementRef;

  loading = true;

  currentUser = undefined;

  private wc;

  team: Team;

  teamDescription = "";
  teamName = "";
  teamBackground = "";

  boards: Board[];

  teams: Team[];

  boardTitle = "";
  newMember = "";

  lightBackground = false;

  constructor(private boardService: BoardService, private snackBarService: SnackBarService, private dialogService: DialogService, private route: ActivatedRoute, private authService: AuthService, private router: Router, private userService: UserService, private webSocketService: WebSocketService, private colorsService: ColorsService, private teamService: TeamService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");

    this.teamService.getOne(id, this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.team = data;

      this.teamDescription = this.team.description;
      this.teamName = this.team.name;
      this.teamBackground = this.team.background;
      this.lightBackground = this.colorsService.checkBackground(this.teamBackground);
    });

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.wc.subscribe("/topic/teams/update/" + id, (msg) => {
        if (JSON.parse(msg.body).statusCodeValue == 204) {
          const dialogRef = this.dialogService.openDialog(DialogOkComponent, "Content Deleted", "The owner has deleted the content");

          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/boards']);
          });

        }
        else {
          let data = JSON.parse(msg.body).body;
          this.team = data;

          this.teamDescription = this.team.description;
          this.teamName = this.team.name;
          this.teamBackground = this.team.background;
          this.lightBackground = this.colorsService.checkBackground(this.teamBackground);
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
            lists: [],
            priority: 1,
            deleted: false
          }
        ).subscribe(data => {
          let newBoard: any = data;
          this.team.boards.push(newBoard);
          this.updateTeam();
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
    if (this.newMember.trim() != "") {
      this.userService.getByQuery(this.newMember).subscribe(data => {
        if (data) {
          let errorMessageNewUser = undefined;
          this.team.members.forEach(member => {
            if (member.id == data.id) {
              errorMessageNewUser = "That user already exists";
            }
          });
          if (errorMessageNewUser) {
            this.snackBarService.openSnackBar(errorMessageNewUser, "X");
            return;
          }
          data.teams.push(this.team);
          this.wc.send("/app/users/update/" + data.email, {}, JSON.stringify(data));
          data.teams = [];
          this.team.members.push(data);
          this.updateTeam();
          this.newMember = "";
          this.newMemberElement.nativeElement.focus();
          this.snackBarService.openSnackBar("Successfully added", "X");
        }
      }, error => {
        this.snackBarService.openSnackBar("That user does not exist", "X");
      });
    }
    else {
      this.newMember = "";
      this.newMemberElement.nativeElement.focus();
    }
  }

  saveTeamDescription() {
    this.team.description = this.teamDescription.trim();
    this.teamDescription = this.team.description;
    this.updateTeam();
    this.snackBarService.openSnackBar("Successfully saved", "X");
  }

  renameTeam() {
    if (this.teamName.trim() != this.team.name && this.teamName.trim() != "") {
      this.team.name = this.teamName.trim();
      this.teamName = this.team.name;
      this.updateTeam();
      this.snackBarService.openSnackBar("Successfully saved", "X");
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
    this.updateTeam();
    this.lightBackground = this.colorsService.checkBackground(this.teamBackground);
  }

  deleteTeam() {
    this.team.deleted = true;
    this.updateTeam();
    this.router.navigate(['/boards']);
  }

  deleteTeamDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete Team " + this.team.name);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTeam();
      }
    });
  }

  leaveTeam() {
    this.userService.leaveTeam(this.team.id, this.currentUser.id).subscribe(data => {
      this.router.navigate(['/boards']);
    });
  }

  leaveBoardDialog() {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Leave Team " + this.team.name);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leaveTeam();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  dropBoard(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.team.boards, event.previousIndex, event.currentIndex);
    this.updateTeam();
  }

  dropMember(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.team.members, event.previousIndex, event.currentIndex);
    this.updateTeam();
  }

  updateTeam() {
    this.wc.send("/app/teams/update/" + this.team.id, {}, JSON.stringify(this.team));
  }

}
