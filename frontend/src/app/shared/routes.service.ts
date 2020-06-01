import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor() { }

  getBoardRoute(boardId: string) {
    return `/board/${boardId}`;
  }

  getCardRoute(boardId: string, listId: string, cardId: string) {
    return `/board/${boardId}/${listId}/${cardId}`;
  }

  getUserRoute(userId) {
    return `/profile/${userId}`;
  }
}
