import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getLocaleDateTime(isoDate){
    return new Date(isoDate).toLocaleString();
  }
}
