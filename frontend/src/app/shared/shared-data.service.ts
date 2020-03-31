import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  contextViewOn: boolean;

  constructor() { }
}
