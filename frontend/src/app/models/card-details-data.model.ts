import { Board } from './board.model';

export interface CardDetailsData {
  board: Board;
  listIndex: number;
  cardIndex: number;
  checkedNumber: number[];
  tabIndex: number;
}