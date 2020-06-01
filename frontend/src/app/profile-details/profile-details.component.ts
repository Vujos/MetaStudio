import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BoardService } from '../boards/board.service';
import { ColorsService } from '../shared/colors.service';
import { UserService } from '../users/user.service';
import { PieChartData } from '../models/pie-chart-data.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileDetailsComponent implements OnInit {

  pieChartTasks: PieChartData;
  pieChartCards: PieChartData;

  loadingData = true;

  currentUser = undefined;
  loggedUser = undefined;

  boards = [];

  finishedTasks = 0;
  unfinishedTasks = 0;

  finishedCards = 0;
  unfinishedCards = 0;

  selectedTabIndex = 0;

  constructor(private authService: AuthService, private router: Router, public userService: UserService, private route: ActivatedRoute, private boardService: BoardService, public colorsService: ColorsService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return
    }

    this.userService.getByQuery(this.authService.getCurrentUser()).subscribe(loggedUser => {
      this.loggedUser = loggedUser;
    });

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
            if(card.done){
              this.finishedCards++;
            }
            else{
              this.unfinishedCards++;
            }
            card.checklists.forEach(checklist => {
              checklist.tasks.forEach(task => {
                if (task.done) {
                  this.finishedTasks++;
                }
                else {
                  this.unfinishedTasks++;
                }
              });
            });
          });
        });
      });

      let labelsTasks = ["Finished", "Unfinished"];
      let valuesTasks = [this.finishedTasks, this.unfinishedTasks];
      this.pieChartTasks = new PieChartData("Tasks", labelsTasks, valuesTasks, 100, 100);

      let labelsCards = ["Finished", "Unfinished"];
      let valuesCards = [this.finishedCards, this.unfinishedCards];
      this.pieChartCards = new PieChartData("Cards", labelsCards, valuesCards, 100, 100);
    });
    
  }

  selectedTabChange(event) {
    this.selectedTabIndex = event.index;
  }

  getLocaleDateTime(isoDate){
    return new Date(isoDate).toLocaleString();
  }
}
