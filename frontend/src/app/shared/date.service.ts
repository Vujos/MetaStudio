import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getLocaleDateTime(isoDate){
    return new Date(isoDate).toLocaleString();
  }

  getAngularDateTimeLocal(isoDate){
    let year = new Date(isoDate).getFullYear()
    let month = ("0" + (new Date(isoDate).getMonth()+1)).slice(-2);
    let date = ("0" + new Date(isoDate).getDate()).slice(-2);
    let hours = ("0" + new Date(isoDate).getHours()).slice(-2);
    let minutes = ("0" + new Date(isoDate).getMinutes()).slice(-2);
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  }
}
