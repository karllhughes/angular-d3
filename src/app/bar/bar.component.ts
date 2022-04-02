import { Component, OnInit } from '@angular/core';

import { axisBottom, axisLeft } from 'd3-axis';
// import { csv } from 'd3-fetch';
import { scaleBand, scaleLinear } from 'd3-scale';
import { select, Selection } from 'd3-selection';

interface Framework {
  Framework: string;
  Stars: number;
  Released: number;
}

// Adopted from Basic barplot example on D3 Graph Gallery:
// https://www.d3-graph-gallery.com/graph/barplot_basic.html
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
})
export class BarComponent implements OnInit {
  private data: Framework[] = [
    { Framework: 'Vue', Stars: 166443, Released: 2014 },
    { Framework: 'React', Stars: 150793, Released: 2013 },
    { Framework: 'Angular', Stars: 62342, Released: 2016 },
    { Framework: 'Backbone', Stars: 27647, Released: 2010 },
    { Framework: 'Ember', Stars: 21471, Released: 2011 },
  ];
  // private data: Framework[] = [];
  private svg?: Selection<SVGGElement, Framework, HTMLElement, Framework>;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);

    // Parse data from a CSV
    // csv('/assets/frameworks.csv', (d) => {
    //   const framework: Framework = {
    //     Framework: d.Framework,
    //     Stars: +d.Stars,
    //     Released: +d.Released,
    //   };
    //   return framework;
    // }).then((data) => this.drawBars(data));

    // Fetch JSON from an external endpoint (no more resources)
    // d3.json('https://api.jsonbin.io/b/5eee6a5397cb753b4d149343').then(data => this.drawBars(data));
  }

  private createSvg(): void {
    this.svg = select<SVGGElement, Framework>('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawBars(data: Framework[]): void {
    // Add X axis
    const x = scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.Framework))
      .padding(0.2);

    this.svg
      ?.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    const y = scaleLinear().domain([0, 200000]).range([this.height, 0]);

    this.svg?.append('g').call(axisLeft(y));

    // Create and fill the bars
    this.svg
      ?.selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.Framework)!)
      .attr('y', (d) => y(d.Stars))
      .attr('width', x.bandwidth())
      .attr('height', (d) => this.height - y(d.Stars))
      .attr('fill', '#d04a35');
  }
}
