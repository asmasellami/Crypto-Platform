package com.example.backend_pfe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;

import com.example.backend_pfe.entities.Role;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.services.UserService;

import jakarta.annotation.PostConstruct;


@EnableScheduling
@SpringBootApplication
public class BackendPfeApplication {
	
	@Autowired
	UserService userService;
	
@PostConstruct
	
	void init_users() {
	//ajouter les rôles 
		
   /*userService.addRole(new Role(null,"ADMIN", null));
	userService.addRole(new Role(null,"USER", null));
	//ajouter les users
	userService.saveUser(new User(null,"admin","123",true,null,null, null, null));
	userService.saveUser(new User(null,"amal","123",true,null,null, null, null));
	userService.saveUser(new User(null,"asma","123",true,null,null, null, null));
	//ajouter les rôles aux users
	userService.addRoleToUser("admin", "ADMIN");
	userService.addRoleToUser("admin", "USER");
	userService.addRoleToUser("amal", "USER");
	userService.addRoleToUser("asma", "USER");   */
	}
	@Bean
	BCryptPasswordEncoder getBCE() {
	return new BCryptPasswordEncoder();
	}
	
	 @Bean
	 public RestTemplate restTemplate(RestTemplateBuilder builder) {
	        return builder.build();
	    }
	

	public static void main(String[] args) {
		SpringApplication.run(BackendPfeApplication.class, args);
	}

}
