import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private roleUrl = "http://localhost:8080/api/roles";

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Role[]>(this.roleUrl);
  }

  getAllPageable(pageIndex, pageSize) {
    return this.http.get<{ content: Role[] }>(this.roleUrl + `/${pageIndex}` + `/${pageSize}`);
  }

  getOne(id: String) {
    return this.http.get<Role>(this.roleUrl + `/${id}`);
  }

  delete(id: String) {
    return this.http.delete(this.roleUrl + `/${id}`);
  }

  add(role: Role) {
    return this.http.post(this.roleUrl + '/add', role);
  }

  update(id: string, role: Role) {
    return this.http.put(this.roleUrl + `/${id}`, role);
  }
}
