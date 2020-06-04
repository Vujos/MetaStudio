import { Injectable } from '@angular/core';
import { PieChartItem } from '../models/pie-chart-item.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  private readonly MIN_ITEM = 10;
  private readonly MAX_ITEM = 20;

  private readonly MAX_VALUE = 100;

  constructor() { }

  private generateRandomValue(start: number, end: number) {
    return Math.ceil(Math.random() * (end - start) + start);
  }

  getData(labels: string[], values: number[]) {
    const samples = [];
    for (let i = 0; i < values.length; i++) {
      samples.push({
        name: labels[i],
        value: values[i]
      });
    }
    return samples;
  }
}