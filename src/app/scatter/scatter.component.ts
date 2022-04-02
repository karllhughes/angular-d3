import { Component, OnInit } from '@angular/core';

import {
  axisBottom,
  axisLeft,
  format,
  scaleLinear,
  select,
  Selection,
} from 'd3';

interface Framework {
  Framework: string;
  Stars: number;
  Released: number;
}

// Adopted from Scatterplot example on D3 Graph Gallery:
// https://www.d3-graph-gallery.com/graph/scatter_tooltip.html
@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss'],
})
export class ScatterComponent implements OnInit {
  private data: Framework[] = [
    { Framework: 'Vue', Stars: 166443, Released: 2014 },
    { Framework: 'React', Stars: 150793, Released: 2013 },
    { Framework: 'Angular', Stars: 62342, Released: 2016 },
    { Framework: 'Backbone', Stars: 27647, Released: 2010 },
    { Framework: 'Ember', Stars: 21471, Released: 2011 },
  ];
  private svg?: Selection<SVGGElement, Framework, HTMLElement, Framework>;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  ngOnInit(): void {
    this.createSvg();
    this.drawPlot();
  }

  private createSvg(): void {
    this.svg = select<SVGGElement, Framework>('figure#scatter')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    // Add X axis
    const x = scaleLinear().domain([2009, 2017]).range([0, this.width]);
    this.svg
      ?.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(axisBottom(x).tickFormat(format('d')));

    // Add Y axis
    const y = scaleLinear().domain([0, 200000]).range([this.height, 0]);
    this.svg?.append('g').call(axisLeft(y));

    // Add dots
    const dots = this.svg?.append('g');

    dots
      ?.selectAll('dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.Released))
      .attr('cy', (d) => y(d.Stars))
      .attr('r', 7)
      .style('opacity', 0.5)
      .style('fill', '#69b3a2');

    dots
      ?.selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .text((d) => d.Framework)
      .attr('x', (d) => x(d.Released))
      .attr('y', (d) => y(d.Stars));
  }
}
