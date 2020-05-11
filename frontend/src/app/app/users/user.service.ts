import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user.model';
import { Board } from '../board.model';

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
    return this.http.get<User>(this.userUrl+`/${id}`);
  }

  getByQuery(query: String) {
    return this.http.get<User>(this.userUrl+`/query/${query}`);
  }

  delete(id: String) {
    return this.http.delete(this.userUrl+`/${id}`);
  }

  add(user:User) {
    return this.http.post(this.userUrl+'/register', user);
  }

  update(id:string, user:User) {
    return this.http.put(this.userUrl+`/${id}`, user)
  }

  getBoards(email: String) {
    return this.http.get<Board[]>(this.userUrl+`/boards/${email}`);
  }
}
