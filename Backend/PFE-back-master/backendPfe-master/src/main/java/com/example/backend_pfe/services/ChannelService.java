package com.example.backend_pfe.services;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.backend_pfe.entities.Alert;
import com.example.backend_pfe.entities.Channel;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.register.RegistationRequest;
import com.example.backend_pfe.repositories.ChannelRepository;
import com.example.backend_pfe.repositories.UserRepository;

@Service
public class ChannelService {
	
	
	@Autowired
	ChannelRepository channelRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserService userService;
	
	  public List<Channel> getChannelForCurrentUser(Long userId) {
	        return channelRepository.findByUserId(userId);
	    }
	  

	  private User getUserForChannel(Channel channel) {
	        return userRepository.findById(channel.getUserId()).orElse(null);
	    }
	 
	  public Channel addChannelForUser(Long userId, String email) {
	        User user = userRepository.findById(userId).orElse(null);
	        if (user != null) {
	            Channel channel = new Channel();
	            channel.setUserId(userId);
	            channel.setEmail(email);
	            channelRepository.save(channel);
	            return channel;
	        } else {
	            System.out.println("No user found with ID: " + userId);
	            return null;
	        }
	    }
	 

	
	      
	  public List<Channel> getChannelsForCurrentUser() {
	        Long currentUserId = userService.getCurrentUserId();
	        if (currentUserId == null) {
	            System.out.println("Aucun utilisateur authentifié trouvé.");
	            return Collections.emptyList();
	        }
	        return channelRepository.findByUserId(currentUserId);
	    }
	 
	  
	  public Channel updateChannel(Long channelId, String value) {
	        Optional<Channel> channelOptional = channelRepository.findById(channelId);
	        if (channelOptional.isPresent()) {
	            Channel channel = channelOptional.get();
	            channel.setEmail(value);
	            channelRepository.save(channel);
	            return channel;
	        } else {
	            System.out.println("Aucun canal trouvé avec l'ID: " + channelId);
	            return null;
	        }
	    }


	  
	    public void deleteChannel(Long channelId) {
	        Optional<Channel> channelOptional = channelRepository.findById(channelId);
	        if (channelOptional.isPresent()) {
	            channelRepository.deleteById(channelId);
	            System.out.println("Canal supprimé avec l'ID: " + channelId);
	        } else {
	            System.out.println("Aucun canal trouvé avec l'ID: " + channelId);
	        }
	    }
}
