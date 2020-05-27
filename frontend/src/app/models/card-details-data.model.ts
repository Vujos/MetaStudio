import { Board } from './board.model';

export interface CardDetailsData {
  board: Board;
  listIndex: string;
  cardIndex: string;
  checkedNumber: number[];
  tabIndex: number;
}