import { NumberFormatterPipe } from './../number-formatter.pipe';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { FuturesChartData } from '../model/FuturesChartData.model';

@Component({
  selector: 'app-futures-details',
  templateUrl: './futures-details.component.html',
  styleUrls: ['./futures-details.component.css']
})
export class FuturesDetailsComponent {

  tickerId!: string;
  futuresChartData: FuturesChartData[] = [];
  priceChart!: Chart;
  oiChart!: Chart;

  basisChart!: Chart;
  yieldChart!: Chart;
  isLoading = true;

  constructor(private route: ActivatedRoute, private globalDataTableService: GlobalDataTableService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tickerId = params.get('id')!;
      console.log('Ticker ID:', this.tickerId);
      this.fetchFuturesDetails();
    });
  }

  fetchFuturesDetails(): void {
    this.globalDataTableService.getFuturesDetails(this.tickerId).subscribe(data => {
      console.log('Fetched Data:', data);
      this.futuresChartData = data;
      this.createCharts();
      this.isLoading = false;
    });
  }

  createCharts(): void {
    this.createPriceChart();
    this.createOiChart();
    this.createBasisChart();
    this.createYieldChart();
  }
  createPriceChart(): void {
    const ctx = document.getElementById('priceChart') as HTMLCanvasElement;
    const data = this.futuresChartData.map(item => ({
      x: item.date,
      y: item.p
    }));

    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

    this.priceChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Price',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
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
              text: 'Price',
              color: '#ffffff'
            },
            ticks: {
              color: '#ffffff',
              callback: function(value) {
                return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
              }
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



  createOiChart(): void {
    const ctx = document.getElementById('oiChart') as HTMLCanvasElement;
    const data = this.futuresChartData.map(item => ({
      x: item.date,
      y: item.oi
    }));

    const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 99, 132, 0)');

    this.oiChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Open Interest',
          data: data,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.4
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
              text: 'Open Interest',
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
    const data = this.futuresChartData.map(item => ({
      x: item.date,
      y: item.b
    }));

    this.basisChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.futuresChartData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [{
          label: 'Basis',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
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

  createYieldChart(): void {
    const ctx = document.getElementById('yieldChart') as HTMLCanvasElement;
    const data = this.futuresChartData.map(item => ({
      x: item.date,
      y: item.y
    }));

    this.yieldChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.futuresChartData.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [{
          label: 'Yield',
          data: data,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
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
              text: 'Yield',
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
