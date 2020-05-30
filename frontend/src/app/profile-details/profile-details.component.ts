import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BoardService } from '../boards/board.service';
import { ColorsService } from '../shared/colors.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  loadingData = true;

  currentUser = undefined;

  boards = [];

  doneTasks = [];
  tasks = [];

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private route: ActivatedRoute, private boardService: BoardService, private colorsService: ColorsService) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return
    }
    let idUser = this.route.snapshot.paramMap.get("idUser");
    this.userService.getOne(idUser).subscribe(data => {
      this.loadingData = false;
      this.currentUser = data;
    }, error => {
      this.router.navigate(['/']);
    })

    this.boardService.getCommonBoards(idUser, this.authService.getCurrentUser()).subscribe(boards => {
      this.boards = boards;

      this.boards.forEach(board => {
        board.lists.forEach(list => {
          list.cards.forEach(card => {
            card.checklists.forEach(checklist => {
              checklist.tasks.forEach(task => {
                if (task.done) {
                  this.doneTasks.push(task);
                }
                else {
                  this.tasks.push(task);
                }
              });
            });
          });
        });
      });
    });
  }

}
