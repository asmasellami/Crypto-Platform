package com.example.backend_pfe.security;


import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	AuthenticationManager authMgr;

	@Bean
	public AuthenticationManager authManager(HttpSecurity http,
			BCryptPasswordEncoder bCryptPasswordEncoder,
			UserDetailsService userDetailsService)
			throws Exception {
		return http.getSharedObject(AuthenticationManagerBuilder.class)
				.userDetailsService(userDetailsService)
				.passwordEncoder(bCryptPasswordEncoder)
				.and()
				.build();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf().disable()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
				
				.cors().configurationSource(new CorsConfigurationSource() {
					 @Override
					 public CorsConfiguration getCorsConfiguration(HttpServletRequest 
					request) {
					 CorsConfiguration config = new CorsConfiguration();
					 
					config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
					 config.setAllowedMethods(Collections.singletonList("*"));
					 config.setAllowCredentials(true);
					 config.setAllowedHeaders(Collections.singletonList("*"));
					 config.setExposedHeaders(Arrays.asList("Authorization"));
					 config.setMaxAge(3600L);
					 return config;
					 }
					 }).and()
				
				.authorizeHttpRequests()
				
				//si on a plusieur role on utilise hasAnyAuthority
				.requestMatchers("/all").hasAuthority("ADMIN")
				.requestMatchers("/topic/options", "/topic/futures").permitAll()
				.requestMatchers("/login","/register/**","/verifyEmail/**",""
						+ "/modifier_pwd","/nouveau_pwd/**","/userById/**",
						"/delUser/**","/verify/**",
						"/update/**","/getUserDetails/**","/addUser/**","/changePassword/**",
						// user 
						"/userByUsername/**","/registrations","/getbyid/{id}",
						
						"/futures/**","/insertFutures/**","/insertOptions/**",
						"/options","/insertPerpetuals","/perpetuals","/websocket/**",
						"/trigger/**"
						,"/updateFutures/**","/futuress/**","/insertAllFutures/**",
						
						// Alerts 
						"/addAlert/**","/alertUser/**","/futuresbyalerts/**",
						"/alertByuser/**",
						"/saveAll/**","/alerts/**","/check-alerts/**",
						"/checkAlertsForCurrentUser/**","/currentUseralerts/**",
						"/alertbyid/{id}","/updateAlert/{id}",
						"/enableAlert/{id}","/disableAlert/{id}",
						
						//Notifications 
						"/notifications/**","/viewed/**","/ticker-details/{id}**","/deleteAllNotif",
						"/markAllAsViewed",
						
						// Channels
						"/addChannel/**","/currentUserchannels/**","/updateChannel/**","/deleteChannel/**",
						// websocket 
						"/ws/**","/notifications/**"
						)
				.permitAll()
				.anyRequest().authenticated().and()
				//.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(new JWTAuthenticationFilter(authMgr), UsernamePasswordAuthenticationFilter.class)
				.addFilterBefore(new JWTAuthorizationFilter(),UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
	    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
	    configuration.setExposedHeaders(Arrays.asList("authorization"));
	    configuration.setAllowCredentials(true);
	    configuration.setMaxAge(3600L);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration); 
	    return source;
	}
}

