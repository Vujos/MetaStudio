import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private boardUrl = "http://localhost:8080/api/boards";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Board[]>(this.boardUrl);
  }

  getOne(id: String, email: String) {
    return this.http.get<Board>(this.boardUrl+`/${id}/${email}`);
  }

  delete(id: String) {
    return this.http.delete(this.boardUrl+`/${id}`);
  }

  add(board:Board) {
    return this.http.post(this.boardUrl+'/add', board);
  }

  update(id:string, board:Board) {
    return this.http.put(this.boardUrl+`/${id}`, board)
  }
}
