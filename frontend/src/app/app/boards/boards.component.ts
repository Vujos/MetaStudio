import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BoardService } from './board.service';
import { Board } from '../board.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  @ViewChild('boardTitleInput', { static: false }) boardTitleElement: ElementRef;

  private wc;

  boards: Board[];

  boardTitle = "";

  lightBackground = false;

  constructor(private boardService: BoardService, private authService: AuthService, private router: Router, private userService: UserService, private webSocketService: WebSocketService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadBoards();
    }
    else {
      this.router.navigate(['/login']);
    }

    this.wc = this.webSocketService.getClient();
    this.wc.connect({}, () => {
      this.wc.subscribe("/topic/users/update/" + this.authService.getCurrentUser(), (msg) => {
        let data = JSON.parse(msg.body).body;
        this.boards = data.boards;
      })
    })
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
            users: [],
            lists: [],
            priority: 1
          }
        ).subscribe(data => {
          let newBoard:any = data;
          currentUser.boards.push(newBoard);
          this.userService.update(currentUser.id, currentUser).subscribe(_ => {
            this.loadBoards();
            this.boardTitle = "";
            this.boardTitleElement.nativeElement.focus();
          });
        });
    })
    }
    else{
      this.boardTitle = "";
      this.boardTitleElement.nativeElement.focus();
    }
    
  }

  loadBoards() {
    this.userService.getBoards(this.authService.getCurrentUser()).subscribe(data => {
      this.boards = data;
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
