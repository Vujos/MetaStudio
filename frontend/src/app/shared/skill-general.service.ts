import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SkillGeneral } from '../models/skill-general.model';

@Injectable({
  providedIn: 'root'
})
export class SkillGeneralService {

  private skillGeneralUrl = "http://localhost:8080/api/skillGenerals";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<SkillGeneral[]>(this.skillGeneralUrl);
  }

  getAllPageable(pageIndex, pageSize) {
    return this.http.get<{ content: SkillGeneral[] }>(this.skillGeneralUrl + `/${pageIndex}` + `/${pageSize}`);
  }

  getOne(id: String) {
    return this.http.get<SkillGeneral>(this.skillGeneralUrl + `/${id}`);
  }

  delete(id: String) {
    return this.http.delete(this.skillGeneralUrl + `/${id}`);
  }

  add(skillGeneral: SkillGeneral) {
    return this.http.post(this.skillGeneralUrl + '/add', skillGeneral);
  }

  update(id: string, skillGeneral: SkillGeneral) {
    return this.http.put(this.skillGeneralUrl + `/${id}`, skillGeneral);
  }
}
