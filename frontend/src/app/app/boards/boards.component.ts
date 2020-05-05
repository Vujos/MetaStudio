import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BoardService } from './board.service';
import { Board } from '../board.model';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  @ViewChild('boardTitleInput', { static: false }) boardTitleElement: ElementRef;

  boards:Board[];

  boardTitle = "";

  lightBackground = false;

  constructor(private boardService: BoardService) { }

  ngOnInit() {
    this.loadBoards();
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
          users: [],
          lists: [],
          priority: 1
        }
      ).subscribe(data => {
        this.loadBoards();
      });      
    }
    this.boardTitle = "";
    this.boardTitleElement.nativeElement.focus();
  }

  loadBoards(){
    this.boardService.getAll().subscribe(data => {
      this.boards = data;
    })
  }

}
