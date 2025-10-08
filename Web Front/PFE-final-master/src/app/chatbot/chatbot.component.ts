import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { NumberFormatterPipe } from '../number-formatter.pipe';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  query: string = '';
  conversation: { sender: string, message: string }[] = [];
  isClosed: boolean = true;
  welcomeMessage = 'Hi, how can I help you today?';

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isClosed = !this.isClosed;
  }
  sendMessage() {
    this.conversation.push({ sender: 'User', message: this.query });
    this.chatService.sendMessage(this.query).subscribe(response => {
      if (response.error) {
        this.conversation.push({ sender: 'Bot', message: response.error });
      } else {
        let responseMessage = '';
        if (response.name && response.symbol && response.current_price && response.market_cap && response.volume_24h) {
          responseMessage = `${response.symbol} (${response.name})\nCurrent Price: ${this.formatNumber(response.current_price)}\nMarket Cap: ${this.formatNumber(response.market_cap)}\n24h Volume: ${this.formatNumber(response.volume_24h)}`;
        } else if (response.message && response.top_futures_prices && response.top_options_prices) {
          // Special handling for top prices response
          responseMessage = `${response.message}\n`;
          responseMessage += 'Futures Prices:\n';
          response.top_futures_prices.forEach((item: any) => {
            responseMessage += `Ticker: ${item.ticker}, Price: ${this.formatNumber(item.price)}\n`;
          });
          responseMessage += 'Options Prices:\n';
          response.top_options_prices.forEach((item: any) => {
            responseMessage += `Ticker: ${item.ticker}, Price: ${this.formatNumber(item.price)}\n`;
          });
        } else {
          if (response.table) {
            responseMessage += `Table: ${response.table}\n`;
            delete response.table;
          }
          for (const [key, value] of Object.entries(response)) {
            let formattedKey = key;
            if (key === 'open_interest') {
              formattedKey = 'Open Interest';
            } else if (key === 'open_interest_volume') {
              formattedKey = 'Open Interest Volume';
            } else if (key === '_25_delta_butterfly') {
              formattedKey = '25Δ BF';
            }
            else if (key === '_25_delta_risk_reversal') {
              formattedKey = '25Δ RR';
            }
            else if (key === 'underlying_price') {
              formattedKey = 'underlying Price:';
            }
            else if (key === 'yield') {
              formattedKey = 'APR:';
            }

            else if (key === 'atm_vol') {
              formattedKey = 'ATM VOL:';
            }
            responseMessage += `${formattedKey}: ${value}\n`;
          }
        }
        this.conversation.push({ sender: 'Bot', message: responseMessage });
      }
    });
    this.query = '';
  }

  formatNumber(value: number): string {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + 'T';
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + 'K';
    } else {
      return value.toString();
    }
  }
}
