import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { PerpetualsChartData } from '../model/perpetualsChartData.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-perpetuals-details',
  templateUrl: './perpetuals-details.component.html',
  styleUrls: ['./perpetuals-details.component.css']
})
export class PerpetualsDetailsComponent {
  currencyId!: string;
  perpetualsChartData: PerpetualsChartData[] = [];

  priceChart!: Chart;
  volumeChart!: Chart;

  leqChart!: Chart;
  yieldChart!: Chart;


  isLoading = true;

  constructor(private route: ActivatedRoute, private globalDataTableService: GlobalDataTableService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currencyId = params.get('id')!;
      console.log('Ticker ID:', this.currencyId);
      this.fetchPerpetualDetails();
    });
  }

  fetchPerpetualDetails(): void {
    this.globalDataTableService.getPerpetualDetails(this.currencyId).subscribe(data => {
      console.log('Fetched Data:', data);
      this.perpetualsChartData = data;
      this.createCharts();
      this.isLoading = false;
    });
  }

  createCharts(): void {
    this.createPriceChart();
    this.createVolumeChart();
    this.createLeqChart();
    this.createYieldChart();
  }

  createPriceChart(): void {
    const ctx = document.getElementById('priceChart') as HTMLCanvasElement;
    const data = this.perpetualsChartData.map(item => ({
      x: item.date,
      y: item.price
    }));

    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

    this.priceChart = new Chart(ctx, {
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
              text: 'Price $',
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


  createVolumeChart(): void {
    const ctx = document.getElementById('volumeChart') as HTMLCanvasElement;
    const data = this.perpetualsChartData.map(item => ({
      x: item.date,
      y: item.volume
    }));

    this.volumeChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Volume',
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
              text: 'Volume',
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




  createLeqChart(): void {
    const ctx = document.getElementById('leqChart') as HTMLCanvasElement;
    const dataleqS= this.perpetualsChartData.map(item => ({
      x: item.date,
      y: item.liquidations_long
    }));
    const dataleqL = this.perpetualsChartData.map(item => ({
      x: item.date,
      y: item.liquidations_short
    }));

    this.leqChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'liquidations Short',
            data: dataleqS,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            tension: 0.1
          },
          {
            label: 'liquidations Long',
            data: dataleqL,
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


  createYieldChart(): void {
    const ctx = document.getElementById('yieldChart') as HTMLCanvasElement;
    const data = this.perpetualsChartData.map(item => ({ x: item.date, y: item.yield }));

    this.yieldChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'APR',
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
