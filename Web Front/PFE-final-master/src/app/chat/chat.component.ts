import { Component, OnInit,OnDestroy } from '@angular/core';
import { Message } from '../model/message.model';
import { WebSocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messageContent: string = '';
  username: string | null = '';
  private messageSubscription!: Subscription;

  constructor(private messageService: WebSocketService, private authService: AuthService) {}

  ngOnInit(): void {
      this.messageService.initializeWebSocketConnection();
      this.messageService.getMessagesForPast24Hours().subscribe((messages: Message[]) => {
          this.messages = messages;
      });

      // Subscribe to incoming messages
      this.messageSubscription = this.messageService.getMessageUpdates().subscribe((message: Message) => {
          this.messages.push(message);
      });

      // Fetch the current username
      this.authService.getCurrentUsername().subscribe({
          next: (username: string | null) => {
              if (username !== null) {
                  this.username = username;
              }
          }
      });
  }

  sendMessage(): void {
      if (this.messageContent && this.username) {
          const newMessage: Message = {
              content: this.messageContent,
              username: this.username,
              timestamp: new Date() // Add timestamp to the message
          };
          this.messageService.sendMessage(newMessage);
          this.messageContent = '';
      }
  }

  ngOnDestroy(): void {
      // Unsubscribe from the message subscription when the component is destroyed
      if (this.messageSubscription) {
          this.messageSubscription.unsubscribe();
      }
      this.messageService.ngOnDestroy();
  }
}
