package com.example.backend_pfe.websocket;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

import com.example.backend_pfe.security.JWTAuthenticationFilter;
import com.example.backend_pfe.security.JwtTokenUtil;
import com.example.backend_pfe.security.MyUserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;


@Configuration
@EnableWebSocketMessageBroker
@CrossOrigin(origins ="*")
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer  {

	
	  @Override
	  public void registerStompEndpoints(StompEndpointRegistry registry) {
	        registry.addEndpoint("/ws")
	                .setHandshakeHandler(new CustomHandshakeHandler())
	                .setAllowedOrigins("http://localhost:4200")
	                .withSockJS();
	        registry.addEndpoint("/ws");
	    }
	  
	  
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
    	 registry.enableSimpleBroker("/topic", "/queue");
         registry.setApplicationDestinationPrefixes("/app");
         registry.setUserDestinationPrefix("/user");
        
    }
    
    
    Logger log = LoggerFactory.getLogger(WebSocketConfig.class);
    
 
}