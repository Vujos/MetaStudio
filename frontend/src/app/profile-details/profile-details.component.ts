import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BoardService } from '../boards/board.service';
import { BarChartData } from '../models/bar-chart-data.model';
import { PieChartData } from '../models/pie-chart-data.model';
import { Skill } from '../models/skill.model';
import { ColorsService } from '../shared/colors.service';
import { DateService } from '../shared/date.service';
import { SkillGeneralService } from '../shared/skill-general.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileDetailsComponent implements OnInit {

  pieChartTasks: PieChartData;
  pieChartCards: PieChartData;

  barChartBoards: BarChartData;
  barChartCards: BarChartData;

  loadingData = true;

  currentUser = undefined;
  loggedUser = undefined;

  boards = [];
  filteredBoards = [];
  selectedFilterBoards = "";

  selectedSkill = undefined;
  skillGenerals = [];

  finishedTasks = 0;
  unfinishedTasks = 0;
  finishedCards = 0;
  unfinishedCards = 0;

  cardsPerBoards = [];
  boardsPerTeams = [];
  cardsPerBoardsLabels = [];
  boardsPerTeamsLabels = [];

  selectedTabIndex = 0;

  constructor(private authService: AuthService, private skillGeneralService: SkillGeneralService, private router: Router, public userService: UserService, private route: ActivatedRoute, private boardService: BoardService, public colorsService: ColorsService, public dateService: DateService) {
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


      this.boardService.getCommonBoards(idUser, this.authService.getCurrentUser()).subscribe(boards => {
        this.boards = boards;
        this.filteredBoards = boards;

        this.boards.forEach(board => {
          let cards = 0;
          this.cardsPerBoardsLabels.push(board.title);
          board.lists.forEach(list => {
            list.cards.forEach(card => {
              cards++;
              if (card.done) {
                this.finishedCards++;
              }
              else {
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
          this.cardsPerBoards.push(cards);
        });

        this.boardsPerTeamsLabels = this.currentUser.teams.map(team => team.name);
        this.boardsPerTeams = this.currentUser.teams.map(team => team.boards.length);

        let labelsTasks = ["Finished", "Unfinished"];
        let valuesTasks = [this.finishedTasks, this.unfinishedTasks];
        this.pieChartTasks = new PieChartData("Tasks", labelsTasks, valuesTasks, 100, 100);

        this.barChartBoards = new BarChartData("Number of boards per teams", this.boardsPerTeamsLabels, this.boardsPerTeams);

        let labelsCards = ["Finished", "Unfinished"];
        let valuesCards = [this.finishedCards, this.unfinishedCards];
        this.pieChartCards = new PieChartData("Cards", labelsCards, valuesCards, 100, 100);

        this.barChartCards = new BarChartData("Number of cards per boards", this.cardsPerBoardsLabels, this.cardsPerBoards);
      });

      this.skillGeneralService.getAll().subscribe(data => {
        this.skillGenerals = data.filter((skillGeneral => !this.currentUser.skills.map(skill => skill.name.id).includes(skillGeneral.id)));
      });

    }, error => {
      this.router.navigate(['/']);
    })
  }

  selectedTabChange(event) {
    this.selectedTabIndex = event.index;
  }

  setFilterBoards() {
    if (this.selectedFilterBoards == "all") {
      this.filteredBoards = this.boards;
    }
    else if (this.selectedFilterBoards == "cards") {
      this.filteredBoards = this.boards.filter(board => board.lists.length > 0);
    }
    else if (this.selectedFilterBoards == "noCards") {
      this.filteredBoards = this.boards.filter(board => board.lists.length == 0);
    }
  }

  addSkill() {
    if (this.selectedSkill) {
      this.currentUser.skills.push(new Skill(null, this.selectedSkill, 1, false));
      this.userService.update(this.currentUser.id, this.currentUser).subscribe(user => {
        this.currentUser = user;
        this.skillGenerals = this.skillGenerals.filter((skillGeneral => !this.currentUser.skills.map(skill => skill.name.id).includes(skillGeneral.id)));
      });
      this.selectedSkill = undefined;
    }
  }

  skillLevelColor(skillLevelInPercentage) {
    if (skillLevelInPercentage >= 90) {
      return "#4caf50";
    }
    else if (skillLevelInPercentage >= 80 && skillLevelInPercentage < 90) {
      return "#2196f3";
    }
    else if (skillLevelInPercentage >= 70 && skillLevelInPercentage < 80) {
      return "#ff8c00";
    }
    else if (skillLevelInPercentage >= 60 && skillLevelInPercentage < 70) {
      return "#f44336";
    }
    else if (skillLevelInPercentage < 60) {
      return "#808080";
    }
  }
}
