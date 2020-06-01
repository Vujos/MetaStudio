import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { PieChartItem } from '../models/pie-chart-item.model';
import { DataService } from './data.service';
import { PieChartData } from '../models/pie-chart-data.model';
import { PieChartLegend } from '../models/pie-chart-legend.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {
  @Input() pieChartData: PieChartData;

  public title;
  private labels;
  private values;
  private height;
  private width;
  private innerRadius;

  private tooltip: any;
  private total: number;

  radius: number;
  // Arcs & pie
  private arc: any; private pie: any; private slices: any;
  private color: any;
  // Drawing containers
  private svg: any; private mainContainer: any;
  // Data
  dataSource: PieChartItem[];

  private arcLabel: any;
  private texts: any;

  legend = [];

  noData: boolean = false;

  constructor(private service: DataService) { }

  ngOnInit() {
    let id = "id" + Date.now();
    this.svg = d3.select('#pie').attr("id", id).select('svg');
    this.title = this.pieChartData.title;
    this.values = this.pieChartData.values;
    this.labels = this.pieChartData.labels;
    for (let index = 0; index < this.values.length; index++) {
      if(this.values[index]==0){
        this.values.splice(index, 1);
        this.labels.splice(index, 1);
        index--;
      }
    }
    if(this.values.length==0){
      this.noData = true;
      return;
    }
    this.height = this.pieChartData.height;
    this.width = this.pieChartData.width;
    this.innerRadius = this.pieChartData.innerRadiusInPercentage;
    this.dataSource = this.service.getData(this.labels, this.values);
    this.total = this.dataSource.reduce((sum, it) => sum += Math.abs(it.value), 0);
    this.setSVGDimensions();
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.radius},${this.radius})`);
    this.pie = d3.pie().sort(null).value((d: any) => Math.abs(d.value));
    this.draw();
    window.addEventListener('resize', this.resize.bind(this));
    this.tooltip = d3.select('#' + id)
      .append('div').attr('class', 'item-pie-chart-tooltip').style('display', 'none').style('opacity', 0);

    this.labels.forEach((label, index) => {
      // this.legend.push(new PieChartLegend(label, this.color(index)));
      this.legend.unshift(new PieChartLegend(label, this.color(index)));
    });
  }

  private resize() {
    this.setSVGDimensions();
    this.repaint();
  }

  private repaint() {
    this.draw();
    this.drawLabels();
  }

  private setSVGDimensions() {
    this.radius = (Math.min(this.width, this.height)) / 2;
    this.svg.attr('width', 2 * this.radius).attr('height', 2 * this.radius);
    this.svg.select('g').attr('transform', 'translate(' + this.radius + ',' + this.radius + ')');
  }

  private draw() {
    this.setArcs();
    this.drawSlices();
    this.drawLabels();
  }

  private setArcs() {
    this.arc = d3.arc().outerRadius(this.radius).innerRadius(this.radius * this.innerRadius);
    this.arcLabel = d3.arc().innerRadius(this.radius * .8).outerRadius(this.radius * .8);
  }

  private drawSlices() {
    this.slices = this.mainContainer.selectAll('path')
      .remove().exit()
      .data(this.pie(this.dataSource))
      .enter().append('g').append('path')
      .attr('d', this.arc);
    this.slices
      .attr('fill', (d, i) => this.color(i));
    this.slices
      .attr('fill', (d, i) => this.color(i))
      .on('mousemove', function (s) {
        const percent = (Math.abs(Math.abs(s.data.value) / this.total) * 100).toFixed(2) + '%';
        this.tooltip.style('top', (d3.event.layerY + 20) + 'px').style('left', (d3.event.layerX) + 'px')
          .style('display', 'block').style('opacity', 1).style('border', '1px solid' + this.color(s.index));
        this.tooltip.html(`${s.data.name}: ${s.data.value} (${percent})`);
      }.bind(this))
      .on('mouseout', function () {
        this.tooltip.style('display', 'none').style('opacity', 0);
      }.bind(this));
  }

  private drawLabels() {
    this.texts = this.mainContainer.selectAll('text')
      .remove().exit()
      .data(this.pie(this.dataSource))
      .enter().append('text')
      .attr('text-anchor', 'middle').attr('transform', d => `translate(${this.arcLabel.centroid(d)})`);
    /* this.texts.append('tspan').filter(d => (d.endAngle - d.startAngle) > 0.05)
      .attr('x', 0).attr('y', 0).style('font-weight', 'bold')
      .text(d => d.data.name); */
    /* this.texts.append('tspan').filter(d => (d.endAngle - d.startAngle) > 0.25)
      .attr('x', 0).attr('y', '1.3em').attr('fill-opacity', 0.7)
      .text(d => d.data.value); */
    this.texts.append('tspan')
      .attr('x', 0).attr('y', 0).attr('fill-opacity', 0.7).style('font-weight', 'bold')
      .text(d => d.data.value);
  }
}
