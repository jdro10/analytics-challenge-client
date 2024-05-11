import { Component, Input, ViewChild } from '@angular/core';
import { ApexTheme, NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  theme: ApexTheme;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-linear-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './linear-chart.component.html',
  styleUrl: './linear-chart.component.css',
})
export class LinearChartComponent {
  @Input() simulationData: any;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Percentile 5',
          data: [],
        },
        {
          name: 'Percentile 50',
          data: [],
        },
        {
          name: 'Percentile 75',
          data: [],
        },
      ],
      theme: {
        mode: 'dark',
      },
      chart: {
        height: 500,
        type: 'line',
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: 'Simulation',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },

      xaxis: {
        labels: {
          show: false,
        },
      },
    };
  }

  ngAfterViewInit(): void {
    this.chartOptions.series[0].data =
      this.simulationData.wealth.total.percentile75;
    this.chartOptions.series[1].data =
      this.simulationData.wealth.total.percentile50;
    this.chartOptions.series[2].data =
      this.simulationData.wealth.total.percentile5;
  }
}
