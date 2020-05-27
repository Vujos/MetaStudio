import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../users/user.service';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../boards/board.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  loadingData = true;

  currentUser = undefined;

  boards = [];

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute, private boardService: BoardService) { }

  ngOnInit() {
    let idBoard = this.route.snapshot.paramMap.get("idBoard");
    let idUser = this.route.snapshot.paramMap.get("idUser");
    this.userService.getOne(idUser).subscribe(data => {
      this.loadingData = false;
      this.currentUser = data;
    })

    this.boardService.getCommonBoards(idUser, this.authService.getCurrentUser()).subscribe(boards => {
      this.boards = boards;
      console.log(boards)
    })
  }

}
