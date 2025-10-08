import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartConfiguration } from 'chart.js';
import { OptionsChartData } from '../model/OptionsChartData.model';
import { GlobalDataTableService } from '../services/global-data-table.service';
import * as moment from 'moment';


@Component({
  selector: 'app-options-details',
  templateUrl: './options-details.component.html',
  styleUrls: ['./options-details.component.css']
})
export class OptionsDetailsComponent {
  tickerId!: string;
  optionsChartData: OptionsChartData[] = [];

  upChart!: Chart;
  atmVolChart!: Chart;
  d25Chart!: Chart;
  basisChart!: Chart;

  isLoading = true;

  constructor(private route: ActivatedRoute, private globalDataTableService: GlobalDataTableService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tickerId = params.get('id')!;
      console.log('Ticker ID:', this.tickerId);
      this.fetchOptionsDetails();
    });
  }

  fetchOptionsDetails(): void {
    this.globalDataTableService.getOptionsDetails(this.tickerId).subscribe(data => {
      console.log('Fetched Data:', data);
      this.optionsChartData = data;
      this.createCharts();
      this.isLoading = false;
    });
  }

  createCharts(): void {
    this.createUpChart();
    this.createAtmVolChart();
    this.createD25Chart();
    this.createBasisChart();
  }

  createUpChart(): void {
    const ctx = document.getElementById('upChart') as HTMLCanvasElement;
    const data = this.optionsChartData.map(item => ({
      x: item.date,
      y: item.up
    }));

    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

    this.upChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Underlying Price',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          fill: true,
          tension: 0.1 // smooth curves
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD/MM/YYYY',
              displayFormats: {
                day: 'DD/MM/YYYY'
              }
            },
            title: {
              display: true,
              text: 'Date',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Underlying Price $',
              color: '#ffffff'
            },
            ticks: {
              callback: function(tickValue: string | number) {
                return typeof tickValue === 'number'
                  ? tickValue.toLocaleString("en-US", { style: "currency", currency: "USD" })
                  : tickValue;
              },
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });
  }
  createAtmVolChart(): void {
    const ctx = document.getElementById('atmVolChart') as HTMLCanvasElement;
    const data = this.optionsChartData.map(item => ({
      x: item.date,
      y: item.atm_vol
    }));

    this.atmVolChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'ATM Volatility',
          data: data,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderWidth: 1,
          pointRadius: 0,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD/MM/YYYY',
              displayFormats: {
                day: 'DD/MM/YYYY'
              }
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            title: {
              display: true,
              text: 'Date',
              color: '#ffffff'
            },
          },
          y: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            title: {
              display: true,
              text: 'ATM Volatility',
              color: '#ffffff'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });
  }




  createD25Chart(): void {
    const ctx = document.getElementById('d25Chart') as HTMLCanvasElement;
    const dataRR = this.optionsChartData.map(item => ({
      x: item.date,
      y: item.d_25_rr
    }));
    const dataBF = this.optionsChartData.map(item => ({
      x: item.date,
      y: item.d_25_bf
    }));

    this.d25Chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: '25 Delta Risk Reversal',
            data: dataRR,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            tension: 0.1
          },
          {
            label: '25 Delta Butterfly',
            data: dataBF,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD/MM/YYYY',
              displayFormats: {
                day: 'DD/MM/YYYY'
              }
            },
            title: {
              display: true,
              text: 'Date',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });
  }

  createBasisChart(): void {
    const ctx = document.getElementById('basisChart') as HTMLCanvasElement;
    const data = this.optionsChartData.map(item => ({ x: item.date, y: item.basis }));

    this.basisChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Basis',
          data: data,
          borderColor: 'rgba(0, 255, 0, 1)',
          backgroundColor: 'rgba(0, 255, 0, 0.4)',
          borderWidth: 1,
          pointRadius: 0,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD/MM/YYYY',
              displayFormats: { day: 'DD/MM/YYYY' }
            },
            title: {
              display: true,
              text: 'Date',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Basis',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    });
  }
}
