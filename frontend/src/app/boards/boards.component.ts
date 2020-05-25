import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { BoardService } from './board.service';
import { Board } from '../models/board.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ColorsService } from '../shared/colors.service';
import { Team } from '../models/team.model';
import { TeamService } from '../teams/team.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardsComponent implements OnInit {

  @ViewChild('boardTitleInput', { static: false }) boardTitleElement: ElementRef;
  @ViewChild('teamNameInput', { static: false }) teamNameElement: ElementRef;

  loading = true;

  currentUser = undefined;

  private wc;

  boards: Board[];

  teams: Team[];

  boardTitle = "";
  teamName = "";

  lightBackground = false;

  showTeams: boolean = false;

  constructor(private boardService: BoardService, private authService: AuthService, private router: Router, private userService: UserService, private webSocketService: WebSocketService, private colorsService: ColorsService, private teamService: TeamService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadBoards();
      this.loadTeams();
    }
    else {
      this.router.navigate(['/login']);
    }

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.wc.subscribe("/topic/users/update/" + this.authService.getCurrentUser(), (msg) => {
        if (JSON.parse(msg.body).statusCodeValue == 204) {
          this.loadBoards();
          this.loadTeams();
        }
        else {
          let data = JSON.parse(msg.body).body;
          this.boards = data.boards;
          this.teams = data.teams;
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
          currentUser.boards.push(newBoard);
          this.userService.update(currentUser.id, currentUser).subscribe(_ => {
            this.loadBoards();
            this.boardTitle = "";
            this.boardTitleElement.nativeElement.focus();
          });
        });
      })
    }
    else {
      this.boardTitle = "";
      this.boardTitleElement.nativeElement.focus();
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
            background: "#808080",
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
    }

  }

  loadBoards() {
    this.userService.getBoards(this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.boards = data;
    })
  }

  loadTeams() {
    this.userService.getTeams(this.authService.getCurrentUser()).subscribe(data => {
      this.loading = false;
      this.teams = data;
      if(this.teams.length>0){
        this.showTeams = true;
      }
      else{
        this.showTeams = false;
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  dropBoard(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      currentUser.boards = this.boards;
      this.updateUser(currentUser);
    })
  }

  dropTeam(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.teams, event.previousIndex, event.currentIndex);
    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      currentUser.teams = this.teams;
      this.updateUser(currentUser);
    })
  }

  updateUser(user) {
    this.userService.update(user.id, user).subscribe();
  }

}
