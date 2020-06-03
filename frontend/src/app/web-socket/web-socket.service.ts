import { Injectable } from '@angular/core';
import * as Stomp from "stompjs";
import { Board } from '../models/board.model';
import { User } from '../models/user.model';
import { Team } from '../models/team.model';
import { BoardService } from '../boards/board.service';
import { UserService } from '../users/user.service';
import { TeamService } from '../teams/team.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private url = "ws://localhost:8080/ws";

  constructor(private boardService: BoardService, private userService: UserService, private teamService: TeamService) { }

  getClient() {
    let client = Stomp.client(this.url);
    client.debug = false;
    return client;
  }

  updateBoard(board: Board, wc) {
    this.boardService.update(board.id, board).subscribe(_ => {
      wc.send("/app/boards/update/" + board.id);
    })
  }

  updateUser(user: User, wc) {
    this.userService.update(user.id, user).subscribe(_ => {
      wc.send("/app/users/update/" + user.email);
    })
  }

  notifyUser(user: User, wc){
    wc.send("/app/users/update/" + user.email);
  }

  updateTeam(team: Team, wc) {
    this.teamService.update(team.id, team).subscribe(_ => {
      wc.send("/app/teams/update/" + team.id);
    })
  }
}
