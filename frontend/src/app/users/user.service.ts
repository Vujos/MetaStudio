import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = "http://localhost:8080/api/users";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<User[]>(this.userUrl);
  }

  getOne(id: String) {
    return this.http.get<User>(this.userUrl + `/${id}`);
  }

  getByQuery(query: String) {
    return this.http.get<User>(this.userUrl + `/query/${query}`);
  }

  delete(id: String) {
    return this.http.delete(this.userUrl + `/${id}`);
  }

  add(user: User) {
    return this.http.post(this.userUrl + '/register', user);
  }

  update(id: string, user: User) {
    return this.http.put(this.userUrl + `/${id}`, user);
  }

  updateWithPassword(id: string, user: User) {
    return this.http.put(this.userUrl + `/update/${id}`, user);
  }

  checkPassword(id: string, user: User) {
    return this.http.put(this.userUrl + `/password/${id}`, user);
  }

  getBoards(email: string) {
    return this.http.get<Board[]>(this.userUrl + `/boards/${email}`);
  }

  leaveBoard(boardId: string, userId: string) {
    return this.http.delete(this.userUrl + `/leaveBoard/${boardId}/${userId}`);
  }
}
