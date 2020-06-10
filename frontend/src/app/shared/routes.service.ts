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

  getCardRouteIndices(boardId: string, listIndex: number, cardIndex: number) {
    return `/card/${boardId}/${listIndex}/${cardIndex}`;
  }

  getCardRouteIndicesChecklists(boardId: string, listIndex: number, cardIndex: number) {
    return `/card/${boardId}/${listIndex}/${cardIndex}/1`;
  }

  getCardRouteIndicesMembers(boardId: string, listIndex: number, cardIndex: number) {
    return `/card/${boardId}/${listIndex}/${cardIndex}/2`;
  }

  getCardRouteIndicesSkills(boardId: string, listIndex: number, cardIndex: number) {
    return `/card/${boardId}/${listIndex}/${cardIndex}/3`;
  }

  getUserRoute(userId) {
    return `/profile/${userId}`;
  }
  
  getTeamRoute(teamId) {
    return `/team/${teamId}`;
  }
}
