package com.example.backend_pfe.restcontrollers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_pfe.entities.Alert;
import com.example.backend_pfe.entities.Channel;
import com.example.backend_pfe.services.ChannelService;
import com.example.backend_pfe.services.UserService;

@RestController
public class ChannelRestcontroller {
	
	 @Autowired
	 private ChannelService channelService;
		@Autowired
		private UserService userService;
	 
	 @GetMapping("/currentUserchannels")
		public ResponseEntity<List<Channel>> getCurrentUserChannels() {
			Long currentUserId = userService.getCurrentUserId();
			if (currentUserId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
			}
			List<Channel> channels = channelService.getChannelForCurrentUser(currentUserId);
			return ResponseEntity.ok(channels);
		}
	 
	 @PostMapping("/addChannel")
	    public ResponseEntity<?> addChannelForUser(@RequestBody Channel channel) {
	        try {
	            Long currentUserId = userService.getCurrentUserId();
	            if (currentUserId == null) {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
	            }
	            Channel newChannel = channelService.addChannelForUser(currentUserId, channel.getEmail());
	            if (newChannel != null) {
	                return ResponseEntity.ok(newChannel);
	            } else {
	                return ResponseEntity.badRequest().body("Unable to create channel for user with ID: " + currentUserId);
	            }
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body("Error creating channel: " + e.getMessage());
	        }
	    }


	    
	    @PutMapping("/updateChannel/{channelId}")
	    public ResponseEntity<Channel> updateChannel(@PathVariable Long channelId, @RequestBody Channel channel) {
	        Channel updatedChannel = channelService.updateChannel(channelId, channel.getEmail());
	        if (updatedChannel != null) {
	            return ResponseEntity.ok(updatedChannel);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }

	   
	    @DeleteMapping("/deleteChannel/{channelId}")
	    public ResponseEntity<Void> deleteChannel(@PathVariable Long channelId) {
	        channelService.deleteChannel(channelId);
	        return ResponseEntity.noContent().build();
	    }
	}

