import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
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
import { BoardService } from './board.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardsComponent implements OnInit {

  @ViewChild('boardTitleInput') boardTitleElement: ElementRef;
  @ViewChild('teamNameInput') teamNameElement: ElementRef;

  loading = true;

  currentUser = undefined;

  private wc;
  private subscription;

  boards: Board[];

  teams: Team[];

  boardTitle = "";
  teamName = "";

  lightBackground = false;

  showTeams: boolean = false;

  constructor(private boardService: BoardService, private snackBarService: SnackBarService, private dialogService: DialogService, private authService: AuthService, private router: Router, private userService: UserService, private webSocketService: WebSocketService, public colorsService: ColorsService, private teamService: TeamService, private routesService: RoutesService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadBoards();
      this.loadTeams();
    }
    else {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;

      this.wc = this.webSocketService.getClient();
      this.wc.connect({}, () => {
        this.subscription = this.wc.subscribe("/topic/users/update/" + this.authService.getCurrentUser(), (msg) => {
          this.userService.getOne(this.currentUser.id).subscribe(user => {
            let data = user;
            this.boards = data.boards;
            this.teams = data.teams;
            if (this.teams.length > 0) {
              this.showTeams = true;
            }
            else {
              this.showTeams = false;
            }
          }, error => {
            if (error.status == 204) {
              this.loadBoards();
              this.loadTeams();
            }
          })
        })
      })
    })
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
      this.wc.disconnect();
    }
    catch {

    }
  }

  addBoard() {
    if (this.boardTitle.trim() != "") {

      this.boardService.add(
        {
          id: null,
          title: this.boardTitle.trim(),
          date: new Date(),
          description: "",
          background: "#55aa55",
          users: [this.currentUser],
          teams: [],
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
        this.webSocketService.updateBoard(newBoard, this.wc)
        this.currentUser.boards.push(newBoard);
        this.currentUser.activities.unshift(activity);
        this.userService.update(this.currentUser.id, this.currentUser).subscribe(_ => {
          this.loadBoards();
          this.boardTitle = "";
          this.boardTitleElement.nativeElement.focus();
        });
      });
    }
    else {
      this.boardTitle = "";
      this.boardTitleElement.nativeElement.focus();
      this.snackBarService.openErrorSnackBar("No board title entered", "X");
    }

  }

  addTeam() {
    if (this.teamName.trim() != "") {
      this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
        this.teamService.add(
          {
            id: null,
            name: this.teamName.trim(),
            description: "",
            background: "#55aa55",
            members: [currentUser],
            boards: [],
            date: new Date(),
            deleted: false
          }
        ).subscribe(data => {
          let newTeam: any = data;
          currentUser.teams.push(newTeam);
          this.userService.update(currentUser.id, currentUser).subscribe(_ => {
            this.loadTeams();
            this.teamName = "";
            this.teamNameElement.nativeElement.focus();
          });
        });
      })
    }
    else {
      this.teamName = "";
      this.teamNameElement.nativeElement.focus();
      this.snackBarService.openErrorSnackBar("No team name entered", "X");
    }

  }

  deleteTemplate(index) {
    this.currentUser.templates.splice(index, 1);
    this.webSocketService.updateUser(this.currentUser, this.wc);
    this.snackBarService.openSuccessSnackBar("Successfully deleted", "X");

  }

  deleteTemplateDialog(index) {
    const dialogRef = this.dialogService.openDialog(DialogSaveChanges, "Confirmation", "Delete this template");

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTemplate(index);
      }
    });
  }

  loadBoards() {
    this.userService.getBoards(this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.boards = data;
    }, error => {
      this.router.navigate(['/home']);
    })
  }

  loadTeams() {
    this.userService.getTeams(this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.teams = data;
      if (this.teams.length > 0) {
        this.showTeams = true;
      }
      else {
        this.showTeams = false;
      }
    }, error => {
      this.router.navigate(['/home']);
    })
  }

  logout() {
    this.authService.logout();
    //this.router.navigate(['/login']);
  }

  dropBoard(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      currentUser.boards = this.boards;
      this.webSocketService.updateUser(currentUser, this.wc);
    })
  }

  dropTeam(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.teams, event.previousIndex, event.currentIndex);
    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      currentUser.teams = this.teams;
      this.webSocketService.updateUser(currentUser, this.wc);
    })
  }

}
