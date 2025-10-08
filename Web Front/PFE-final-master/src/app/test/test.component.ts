import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { Options } from '../model/options.model';
import { Notification } from '../model/notification.model';
import { Observable, Subscription, catchError, interval, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

import axios from 'axios';
import { WebSocketService } from '../services/websocket.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent  implements OnInit {

  userQuery = '';
  botResponse: any;
  loading = false;
  isClosed = true;
  welcomeMessage = 'Hi, how can I help you today?';

  constructor(private chatService: WebSocketService) {}

  ngOnInit() {
    this.botResponse = { message: this.welcomeMessage };
  }

  toggleChat() {
    this.isClosed = !this.isClosed;
  }

  /*sendMessage() {
    this.loading = true;
    this.chatService.sendMessageChat(this.userQuery).subscribe(response => {
      this.botResponse = response;
      this.loading = false;
    }, error => {
      this.botResponse = { error: 'Sorry, I could not understand your question.' };
      this.loading = false;
    });
    this.userQuery = '';
  }

  get topPrices(): { ticker: string, price: number }[] {
    if (this.botResponse && this.botResponse.top_prices) {
      return Object.keys(this.botResponse.top_prices).map(ticker => ({
        ticker,
        price: this.botResponse.top_prices[ticker]
      }));
    }
    return [];
  }*/

}
