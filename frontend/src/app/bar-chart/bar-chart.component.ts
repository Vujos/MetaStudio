import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { BarChartData } from '../models/bar-chart-data.model';
import { BarChartItem } from '../models/bar-chart-item.model';
import { DataService } from '../pie-chart/data.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnInit {
  @Input() barChartData: BarChartData;

  public title;
  private labels;
  private values;
  private height;
  private width;
  private barWidth;
  private barHeight;

  private color: any;

  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  // group containers (X axis, Y axis and bars)
  private gx: any; private gy: any; private bars: any;
  // Scales and Axis
  private xAxis: any; private xScale: any; private yAxis: any; private yScale: any;
  // Drawing containers
  private svg: any; private mainContainer: any;
  // Data
  dataSource: BarChartItem[];

  private tooltip: any;
  private total: number;

  noData: boolean = false;

  constructor(private service: DataService) {

  }

  ngOnInit() {
    let id = "id" + Date.now();
    this.svg = d3.select('#bar').attr("id", id).select('svg');
    this.title = this.barChartData.title;
    this.values = this.barChartData.values;
    this.labels = this.barChartData.labels;
    if (!this.values || !this.labels) {
      this.noData = true;
      return;
    }
    for (let index = 0; index < this.values.length; index++) {
      if (this.values[index] == 0) {
        this.values.splice(index, 1);
        this.labels.splice(index, 1);
        index--;
      }
    }
    if (this.values.length == 0) {
      this.noData = true;
      return;
    }
    this.height = this.barChartData.height ? this.barChartData.height : parseInt(d3.select('app-bar-chart').style('height'), 10);
    this.width = this.barChartData.width ? this.barChartData.width : parseInt(d3.select('app-bar-chart').style('width'), 10);
    this.barHeight = this.height - this.margin.top - this.margin.bottom;
    this.barWidth = this.width - this.margin.left - this.margin.right;
    this.dataSource = <BarChartItem[]>this.service.getData(this.labels, this.values);
    this.total = this.dataSource.reduce((sum, it) => sum += Math.abs(it.value), 0);
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    this.setSVGDimensions();
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.gy = this.mainContainer.append('g').attr('class', 'axis axis--y');
    this.gx = this.mainContainer.append('g').attr('class', 'axis axis--x');
    this.draw();
    window.addEventListener('resize', this.resize.bind(this));
    this.tooltip = d3.select('#' + id)
      .append('div').attr('class', 'item-bar-chart-tooltip').style('display', 'none').style('opacity', 0);
  }

  private resize() {
    this.setSVGDimensions();
    this.setAxisScales();
    this.repaint();
  }

  private repaint() {
    this.drawAxis();
    this.drawBars();
    this.drawLabels();
  }

  private drawBars() {
    this.bars = this.mainContainer.selectAll('.bar')
      .remove().exit()
      .data(this.dataSource).enter().append('rect');

    this.bars
      .attr('x', d => this.xScale(d.name))
      .attr('y', d => this.yScale(d.value))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => this.yScale(0) - this.yScale(d.value))
      .attr('fill', (d, i) => this.color(i))
      .on('mousemove', function (s) {
        const percent = (Math.abs(Math.abs(s.value) / this.total) * 100).toFixed(2) + '%';
        this.tooltip.style('top', (d3.event.layerY + 20) + 'px').style('left', (d3.event.layerX) + 'px')
          .style('display', 'block').style('opacity', 1)
          .html(`${s.name}: ${s.value} (${percent})`);
      }.bind(this))
      .on('mouseout', function () {
        this.tooltip.style('display', 'none').style('opacity', 0);
      }.bind(this));

  }

  private drawAxis() {
    this.gy.attr('transform', `translate(0, 0)`).call(this.yAxis);
    this.gx.attr('transform', `translate(0, ${this.yScale(0)})`).call(this.xAxis);
  }

  private setSVGDimensions() {
    this.svg.style('width', this.width).style('height', this.height);
  }

  private setAxisScales() {
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();

    this.xScale
      .rangeRound([0, this.barWidth]).padding(.1)
      .domain(this.dataSource.map(d => d.name));
    this.yScale
      .range([this.barHeight, 0])
      .domain([0, Math.max(...this.dataSource.map(x => x.value))]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
  }

  private draw() {
    this.setAxisScales();
    this.drawAxis();
    this.drawBars();
    this.drawLabels();
  }

  private drawLabels() {
    this.labels = this.mainContainer.selectAll('.bar-chart-label')
      .remove().exit()
      .data(this.dataSource)
      .enter().append('text').attr('class', 'bar-chart-label')
      .attr('x', d => this.xScale(d.name) + (this.xScale.bandwidth() / 2))
      .attr('y', d => this.yScale(d.value) - 5)
      .text(d => Math.floor(d.value));
  }
}
