import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, ViewChildren } from '@angular/core';

import { AdComponent } from './ad.component';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SharedDataService } from '../shared/shared-data.service';
import { Board } from './board.model';
import { Card } from './card.model';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { DialogSaveChanges } from './dialog/dialog-save-changes';

@Component({
  selector: 'app-hero-profile',
  templateUrl: './hero-profile.component.html',
  styleUrls: ['./hero-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeroProfileComponent implements AdComponent {
  @ViewChildren('cardTitleInput') cardTitleElements: ElementRef;
  @ViewChild('listTitleInput', { static: false }) listTitleElement: ElementRef;
  @ViewChild('boardMoreTrigger', { static: false }) boardMoreTrigger: MatMenuTrigger;
  @ViewChild('listMoreTrigger', { static: false }) listMoreTrigger: MatMenuTrigger;
  @Input() data: any;
  lists = [];
  connectedTo = [];

  board: Board;

  boardDescription = "";
  boardTitle = "";
  boardBackground = "";

  listTitleRename = "";

  lightBackground = false;

  //showAddListBool = false;
  listTitle = "";

  showAddCardBool = false;
  cardTitle = {};

  constructor(private sharedDataService: SharedDataService, public dialog: MatDialog) {

    this.lists = [
      {
        id: 'list-1',
        title: 'List',
        cards: [
          new Card("1", "Card 1", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("2", "Card 2", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("3", "Card 3", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("4", "Card 4", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("5", "Card 5", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("6", "Card 6", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("7", "Card 7", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("8", "Card 8", new Date(), "", [], new Date(), new Date(), [], [], []),
        ],
        priority: 1,
        date: new Date()
      }, {
        id: 'list-2',
        title: 'Random list',
        cards: [
          new Card("9", "Card 9", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("10", "Card 10", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("11", "Card 11", new Date(), "", [], new Date(), new Date(), [], [], [])
        ],
        priority: 1,
        date: new Date()
      }, {
        id: 'list-3',
        title: 'Done',
        cards: [
          new Card("12", "Card 12", new Date(), "", [], new Date(), new Date(), [], [], []),
          new Card("13", "Card 13", new Date(), "", [], new Date(), new Date(), [], [], [])
        ],
        priority: 1,
        date: new Date()
      }
    ];
    for (let list of this.lists) {
      this.connectedTo.push(list.id);
    };

    this.board = new Board('1', 'Board 1', new Date(), "This is description", "#1a1a1a", [], this.lists, 1);

    this.boardDescription = this.board.description;
    this.boardTitle = this.board.title;
    this.boardBackground = this.board.background;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  showAddList() {
    this.boardMoreTrigger.closeMenu();
    this.listTitle = "";
    //this.showAddListBool = !this.showAddListBool
    //this.ref.detectChanges();
    if (this.listTitleElement) {
      this.listTitleElement.nativeElement.focus();
    }
  }

  addList() {
    this.lists.push({
      id: 'list-'.concat((this.lists.length + 1).toString()),
      title: this.listTitle.trim() == "" ? "Untitled list" : this.listTitle.trim(),
      cards: [],
      priority: 1,
      date: new Date()
    });
    this.listTitle = "";
  }

  showAddCard(index) {
    this.listMoreTrigger.closeMenu();
    this.cardTitle[index] = "";
    this.cardTitleElements['_results'][index].nativeElement.focus();
  }

  addCard(index) {
    this.lists[index]['cards'].push({
      id: 'list-'.concat(index.toString(), this.lists[index]['cards'].length),
      title: !this.cardTitle[index] || this.cardTitle[index].trim() == "" ? "Untitled card" : this.cardTitle[index].trim(),
      date: new Date(),
      description: "",
      members: [],
      startDate: new Date(),
      endDate: new Date(),
      attachments: [],
      labels: [],
      checklist: []
    });
    this.cardTitle[index] = "";
  }

  saveBoardDescription() {
    if (this.boardDescription.trim() != "") {
      this.board.description = this.boardDescription.trim();
      this.boardDescription = this.board.description;
    }

  }

  renameBoard() {
    if (this.boardTitle.trim() != "") {
      this.board.title = this.boardTitle.trim();
      this.boardTitle = this.board.title;
    }
  }

  saveBoardTitleDialog() {
    if (this.boardTitle.trim() != this.board.title) {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { yes: true, object: "Board Title" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameBoard()
        }
        else {
          this.boardTitle = this.board.title;
        }
      });
    }
  }

  saveBoardDescriptionDialog() {
    if (this.boardDescription.trim() != this.board.description) {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { yes: true, object: "Board Description" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveBoardDescription()
        }
        else {
          this.boardDescription = this.board.description;
        }
      });
    }
  }

  changeBackground() {
    console.log(this.boardBackground)
    this.board.background = this.boardBackground;
    this.checkBoardBackground();
  }

  checkBoardBackground() {
    let colors = ['#ffffff', '#fefefe', '#fdfdfd', '#fcfcfc', '#fbfbfb', '#fafafa', '#f9f9f9', '#f8f8f8', '#f7f7f7', '#f6f6f6', '#f5f5f5', '#f4f4f4', '#f3f3f3', '#f2f2f2', '#f1f1f1', '#f0f0f0', '#efefef', '#eeeeee', '#ededed', '#ececec', '#ebebeb', '#eaeaea', '#e9e9e9', '#e8e8e8', '#e7e7e7', '#e6e6e6', '#e5e5e5', '#e4e4e4', '#e3e3e3', '#e2e2e2', '#e1e1e1', '#e0e0e0'];
    if (colors.indexOf(this.boardBackground) != -1) {
      this.lightBackground = true;
    }
    else{
      this.lightBackground = false;
    }
    
  }

  renameList(index){
    if (this.listTitleRename.trim() != "") {
      this.lists[index].title = this.listTitleRename.trim();
      this.listTitleRename = this.lists[index].title;
    }
  }

  saveListTitleDialog(index) {
    if (this.listTitleRename.trim() != this.lists[index].title) {
      const dialogRef = this.dialog.open(DialogSaveChanges, {
        data: { yes: true, object: "List Title" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.renameList(index)
        }
        else {
          this.listTitleRename = this.lists[index].title;
        }
      });
    }
  }
}


