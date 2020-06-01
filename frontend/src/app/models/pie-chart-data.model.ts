export class PieChartData {
    title: string;
    labels: string[];
    values: number[];
    height: number;
    width: number;
    innerRadiusInPercentage: number;


    constructor(title: string, labels: string[], values: number[], height: number, width: number, innerRadiusInPercentage: number = 0) {
        this.title = title;
        this.labels = labels;
        this.values = values;
        this.height = height;
        this.width = width;
        this.innerRadiusInPercentage = innerRadiusInPercentage;
    }
}