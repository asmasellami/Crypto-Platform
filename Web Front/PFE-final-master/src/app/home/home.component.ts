import { Component, OnDestroy, OnInit } from '@angular/core';
import axios from 'axios';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  chart!: Chart;
  cryptoChart!: Chart;
  intervalId: any;

  cryptoIds: string[] = ['bitcoin', 'ethereum'];

  ngOnInit(): void {
    this.fetchBitcoinData();
    this.fetchCryptoData();
    this.intervalId = setInterval(() => {
      this.fetchBitcoinData();
      this.fetchCryptoData();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  fetchBitcoinData() {
    axios.get('https://api.coindesk.com/v1/bpi/historical/close.json', {
      params: {
        currency: 'USD'
      }
    })
    .then(response => {
      const bitcoinData: { [date: string]: number } = response.data.bpi;
      const dates: string[] = Object.keys(bitcoinData);
      const prices: number[] = Object.values(bitcoinData);

      this.updateBitcoinChart(dates, prices);
    })
    .catch(error => {
      console.error('Error fetching Bitcoin data:', error);
    });
  }

  updateBitcoinChart(labels: string[], prices: number[]) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = prices;
      this.chart.update();
    } else {
      this.renderBitcoinChart(labels, prices);
    }
  }

  renderBitcoinChart(labels: string[], prices: number[]) {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = 800;
    canvas.height = 400;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bitcoin Price (USD)',
          data: prices,
          borderColor: '#4fe46e',
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'week'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      } as ChartConfiguration['options']
    });
  }

  fetchCryptoData() {
    const promises = this.cryptoIds.map(cryptoId =>
      axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: '7',
          interval: 'daily'
        }
      })
    );

    Promise.all(promises)
      .then(responses => {
        const aggregatedData = responses.map(response => this.aggregateWeeklyData(response.data.prices));
        const dates = Object.keys(aggregatedData[0]);
        const datasets = this.cryptoIds.map((cryptoId, index) => ({
          label: `${cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)} Price (USD)`,
          data: Object.values(aggregatedData[index]),
          borderColor: index === 0 ? 'blue' : 'green',
          backgroundColor: index === 0 ? 'rgba(0, 0, 255, 0.3)' : 'rgba(0, 255, 0, 0.3)',
          fill: true
        }));

        this.updateCryptoChart(dates, datasets);
      })
      .catch(error => {
        console.error('Error fetching cryptocurrency data:', error);
      });
  }

  aggregateWeeklyData(data: number[][]): { [day: string]: number } {
    const dailyData: { [day: string]: number } = {};

    data.forEach(([timestamp, price]) => {
      const date = new Date(timestamp);
      const day = date.toISOString().split('T')[0];
      dailyData[day] = price;
    });

    return dailyData;
  }

  updateCryptoChart(labels: string[], datasets: any[]) {
    if (this.cryptoChart) {
      this.cryptoChart.data.labels = labels;
      this.cryptoChart.data.datasets = datasets;
      this.cryptoChart.update();
    } else {
      this.renderCryptoChart(labels, datasets);
    }
  }

  renderCryptoChart(labels: string[], datasets: any[]) {
    const canvas = document.getElementById('cryptoCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = 800;
    canvas.height = 400;

    this.cryptoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Day'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      } as ChartConfiguration['options']
    });
  }
}
