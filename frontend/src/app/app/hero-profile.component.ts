import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, ViewChildren, ChangeDetectorRef } from '@angular/core';

import { AdComponent } from './ad.component';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SharedDataService } from '../shared/shared-data.service';
import { Board } from './board.model';
import { Card } from './card.model';

@Component({
  selector: 'app-hero-profile',
  templateUrl: './hero-profile.component.html',
  styleUrls: ['./hero-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeroProfileComponent implements AdComponent {
  @ViewChildren('cardTitleInput') cardTitleElements: ElementRef;
  @ViewChild('listTitleInput', { static: false }) listTitleElement: ElementRef;
  @Input() data: any;
  lists = [];
  connectedTo = [];

  board: Board;

  showAddListBool = false;
  listTitle = "";

  showAddCardBool = false;
  cardTitle = {};

  constructor(private ref: ChangeDetectorRef, private sharedDataService: SharedDataService) {

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

    this.board = new Board('1', 'Board 1', new Date(), "", "#FF0000", [], this.lists, 1);
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
    this.listTitle = "";
    this.showAddListBool = !this.showAddListBool
    this.ref.detectChanges();
    if(this.listTitleElement){
      this.listTitleElement.nativeElement.focus();
    }
  }

  addList() {
    this.lists.push({
      id: 'list-'.concat((this.lists.length + 1).toString()),
      title: this.listTitle.trim() == "" ? "Untitled list" : this.listTitle,
      cards: [],
      priority: 1,
      date: new Date()
    });
    this.listTitle = "";
  }
  /*
  showAddCard(index) {
    this.cardTitleElements['_results'][index].nativeElement.focus();
  }
  */
  addCard(index) {
    this.lists[index]['cards'].push({
      id: 'list-'.concat(index.toString(), this.lists[index]['cards'].length),
      title: !this.cardTitle[index] || this.cardTitle[index].trim() == "" ? "Untitled card" : this.cardTitle[index],
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
}


