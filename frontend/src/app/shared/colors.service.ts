import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor() { }

  checkBackground(color) {
    let colors = ['#ffffff', '#fefefe', '#fdfdfd', '#fcfcfc', '#fbfbfb', '#fafafa', '#f9f9f9', '#f8f8f8', '#f7f7f7', '#f6f6f6', '#f5f5f5', '#f4f4f4', '#f3f3f3', '#f2f2f2', '#f1f1f1', '#f0f0f0', '#efefef', '#eeeeee', '#ededed', '#ececec', '#ebebeb', '#eaeaea', '#e9e9e9', '#e8e8e8', '#e7e7e7', '#e6e6e6', '#e5e5e5', '#e4e4e4', '#e3e3e3', '#e2e2e2', '#e1e1e1', '#e0e0e0'];
    if (colors.indexOf(color) != -1) {
      return true;
    }
    else {
      return false;
    }
  }
}
