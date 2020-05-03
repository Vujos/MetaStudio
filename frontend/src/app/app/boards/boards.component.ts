import { Component, OnInit } from '@angular/core';
import { BoardService } from './board.service';
import { Board } from '../board.model';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  boards:Board[];

  constructor(private boardService: BoardService) { }

  ngOnInit() {
    this.boardService.getAll().subscribe(data => {
      this.boards = data;
    })
  }

}
