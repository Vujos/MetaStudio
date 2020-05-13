import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BoardService } from './board.service';
import { Board } from '../board.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { WebSocketService } from '../web-socket/web-socket.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  @ViewChild('boardTitleInput', { static: false }) boardTitleElement: ElementRef;

  currentUser = undefined;

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
        if(JSON.parse(msg.body).statusCodeValue == 204){
          /* const dialogRef = this.dialog.open(DialogOkComponent, {
            data: { title: "Content Deleted", content: "The owner has deleted the content" }
          });
    
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate(['/boards']);
          }); */
          this.loadBoards();
        }
        else{
          let data = JSON.parse(msg.body).body;
          this.boards = data.boards;
        }
        
      })
    })

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      this.currentUser = currentUser;
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

  loadBoards() {
    this.userService.getBoards(this.authService.getCurrentUser()).subscribe(data => {
      this.boards = data;
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(currentUser => {
      currentUser.boards = this.boards;
      this.updateUser(currentUser);
    })
  }

  updateUser(user){
    this.userService.update(user.id, user).subscribe();
  }

  checkBackground(color) {
    let colors = ['#ffffff', '#fefefe', '#fdfdfd', '#fcfcfc', '#fbfbfb', '#fafafa', '#f9f9f9', '#f8f8f8', '#f7f7f7', '#f6f6f6', '#f5f5f5', '#f4f4f4', '#f3f3f3', '#f2f2f2', '#f1f1f1', '#f0f0f0', '#efefef', '#eeeeee', '#ededed', '#ececec', '#ebebeb', '#eaeaea', '#e9e9e9', '#e8e8e8', '#e7e7e7', '#e6e6e6', '#e5e5e5', '#e4e4e4', '#e3e3e3', '#e2e2e2', '#e1e1e1', '#e0e0e0'];
    if (colors.indexOf(color) != -1) {
      return true;
    }
    else {
      return false;
    }
  }

}
