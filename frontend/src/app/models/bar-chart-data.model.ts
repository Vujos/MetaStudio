export class BarChartData {
    title: string;
    labels: string[];
    values: number[];
    height: number;
    width: number;


    constructor(title: string, labels: string[], values: number[], height?: number, width?: number) {
        this.title = title;
        this.labels = labels;
        this.values = values;
        this.height = height;
        this.width = width;
    }
}