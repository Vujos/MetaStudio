import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teamUrl = "http://localhost:8080/api/teams";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Team[]>(this.teamUrl);
  }

  getOne(id: String, email: String) {
    return this.http.get<Team>(this.teamUrl+`/${id}/${email}`);
  }

  delete(id: String) {
    return this.http.delete(this.teamUrl+`/${id}`);
  }

  add(team:Team) {
    return this.http.post(this.teamUrl+'/add', team);
  }

  update(id:string, team:Team) {
    return this.http.put(this.teamUrl+`/${id}`, team)
  }
}
