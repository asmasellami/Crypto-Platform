import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Channel } from '../model/channel.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  channels: Channel[] = [];
  newChannel = new Channel();

  selectedChannel: Channel | null = null;

  showForm: boolean = false;
  error: string | null = null;
  userId!: number;

  constructor(private channelService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.channelService.getCurrentUserId().subscribe({
      next: (userId) => {
        if (userId) {
          this.userId = userId;
          this.loadChannels(userId);
        } else {
          this.toastr.error('Failed to fetch current user ID');
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching current user ID');
        console.error(err);
      }
    });
  }

  loadChannels(userId: number): void {
    this.channelService.getChannelsForCurrentUser().subscribe({
      next: (data: Channel[]) => {
        this.channels = data;
      },
      error: (err) => {
        this.toastr.error('Error fetching channels');
        console.error(err);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.selectedChannel = null;
  }

  showEditForm(channel: Channel): void {
    this.selectedChannel = { ...channel };
    this.showForm = true;
  }

  saveChannel(): void {
    if (this.selectedChannel) {
      this.updateChannel();
    } else {
      this.addChannel();
    }
  }
  addChannel(): void {
    if (this.newChannel.email) {
      this.channelService.addChannel(this.newChannel as Channel).subscribe({
        next: (channel: Channel) => {
          this.channels.push(channel);
          this.toastr.success('Channel added successfully');
          this.newChannel.email = '';
          this.showForm = false;
        },
        error: (err) => {
          this.toastr.error('Error adding channel');
          console.error(err);
        }
      });
    } else {
      this.toastr.error('Email is missing');
    }
  }


  updateChannel(): void {
    if (this.selectedChannel && this.selectedChannel.email) {
      this.channelService.updateChannel(this.selectedChannel.id, this.selectedChannel.email).subscribe({
        next: (updatedChannel: Channel) => {
          const index = this.channels.findIndex(channel => channel.id === updatedChannel.id);
          if (index !== -1) {
            this.channels[index] = updatedChannel;
          }
          this.toastr.success('Channel updated successfully');
          this.selectedChannel = null;
          this.showForm = false;
        },
        error: (err) => {
          this.toastr.error('Error updating channel');
          console.error(err);
        }
      });
    } else {
      this.toastr.error('Email is missing');
    }
  }

  deleteChannel(channelId: number): void {
    this.channelService.deleteChannel(channelId).subscribe({
      next: () => {
        this.channels = this.channels.filter(channel => channel.id !== channelId);
        this.toastr.success('Channel deleted successfully');
      },
      error: (err) => {
        this.toastr.error('Error deleting channel');
        console.error(err);
      }
    });
  }

}
