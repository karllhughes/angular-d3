import { Component, OnInit } from '@angular/core';

import { arc, pie, PieArcDatum } from 'd3-shape';
import { scaleOrdinal, ScaleOrdinal } from 'd3-scale';
import { select, Selection } from 'd3-selection';

interface Framework {
  Framework: string;
  Stars: number;
  Released: number;
}

// Adopted from Basic pie chart example on D3 Graph Gallery:
// https://www.d3-graph-gallery.com/graph/pie_basic.html
@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements OnInit {
  private data: Framework[] = [
    { Framework: 'Vue', Stars: 166443, Released: 2014 },
    { Framework: 'React', Stars: 150793, Released: 2013 },
    { Framework: 'Angular', Stars: 62342, Released: 2016 },
    { Framework: 'Backbone', Stars: 27647, Released: 2010 },
    { Framework: 'Ember', Stars: 21471, Released: 2011 },
  ];
  private svg?: Selection<SVGGElement, Framework, HTMLElement, Framework>;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors?: ScaleOrdinal<number, string, never>;

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = select<SVGGElement, Framework>('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    this.colors = scaleOrdinal<number, string>()
      .domain(this.data.map((d) => d.Stars))
      .range(['#c7d3ec', '#a5b8db', '#879cc4', '#677795', '#5a6782']);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pieGen = pie<any>().value((d: any) => Number(d.Stars));

    // Create the arc generator
    const arcGen = arc<PieArcDatum<Framework>>()
      .innerRadius(0)
      .outerRadius(this.radius);

    // Build the pie chart
    this.svg
      ?.selectAll('pieces')
      .data(pieGen(this.data))
      .enter()
      .append('path')
      .attr('d', arcGen)
      .attr('fill', (datum, _) => this.colors!(datum.data.Stars))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = arc<PieArcDatum<Framework>>()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      ?.selectAll('pieces')
      .data(pieGen(this.data))
      .enter()
      .append('text')
      .text((d) => d.data.Framework)
      .attr('transform', (d) => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }
}
