package com.example.backend_pfe.restcontrollers;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.exception.EmailAlreadyExistsException;
import com.example.backend_pfe.register.RegistationRequest;
import com.example.backend_pfe.repositories.UserRepository;
import com.example.backend_pfe.security.JWTAuthenticationFilter;
import com.example.backend_pfe.services.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@CrossOrigin(origins ="*")
public class UserRestController {

	@Autowired
	UserRepository userRep;

	@Autowired
	UserService userService;
	
	
	
	JWTAuthenticationFilter jwtAuthenticationFilter;

	@RequestMapping(path = "all",method = RequestMethod.GET)
	public List<User> getAllUsers() {
		return userRep.findAll();
	}


	@PostMapping("/register")
	public User register(@RequestBody RegistationRequest request) {
		return userService.registerUser(request);

	}
	
	/**** Pour Admin ************/
	 @PostMapping("/addUser")
	    public User addUser(@RequestBody RegistationRequest request) {
	        return userService.AddUser(request);
	    }
	 
	/**** Pour Admin ************/

	@GetMapping("/verifyEmail/{token}")
	public User verifyEmail(@PathVariable("token") String token){ 
		return userService.validateToken(token);
	}
	

	@PostMapping("/modifier_pwd")
	public void modifierMotDePasse(@RequestBody Map<String,String> activation ) {
		 userService.modifierMotDePasse(activation);

	}
	
	
	 private static final Logger log = LoggerFactory.getLogger(UserRestController.class);
	
	@PostMapping("/nouveau_pwd")
	public void nouveauMotDePasse(@RequestBody Map<String, String> activation) {
	    try {
	        userService.nouveauMotDePasse(activation);
	    } catch (IncorrectResultSizeDataAccessException ex) {
	        log.warn("IncorrectResultSizeDataAccessException: {}", ex.getMessage());
	       
	    }
	}
	
	@RequestMapping(value ="/getbyid/{id}", method = RequestMethod.GET)
	public User getUserById(@PathVariable("id") Long id) {
		return userService.getUser(id);
	}
	
	@GetMapping("/count")
    public long getUsersCount() {
        return userService.getUsersCount();
    }
	
	
	 @DeleteMapping("/{userId}")
	    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
	        try {
	            userService.deleteUser(userId);
	            return ResponseEntity.ok("User deleted successfully.");
	        } catch (EntityNotFoundException e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the user.");
	        }
	    }

	 
		
		@RequestMapping(value="/delUser/{userId}",method = RequestMethod.DELETE)
		public void deleteLivre(@PathVariable("userId") Long userId)
		{
			 userService.deleteUser(userId);
		}
		
		@PostMapping("/verify")
		public ResponseEntity<Map<String, String>> verifyUser(@RequestBody Map<String, String> requestBody) {
		    String email = requestBody.get("email");

		    try {
		        User verifiedUser = userService.verifyUser(email);
		        Map<String, String> response = new HashMap<>();
		        response.put("message", "Verification email sent to " + email);
		        return new ResponseEntity<>(response, HttpStatus.OK);
		    } catch (EmailAlreadyExistsException e) {
		        return new ResponseEntity<>(Map.of("error", "Email already exists!"), HttpStatus.CONFLICT);
		    } catch (UsernameNotFoundException e) {
		        return new ResponseEntity<>(Map.of("error", "User not found!"), HttpStatus.NOT_FOUND);
		    }
		}
		
		@PutMapping("/update")
	    public ResponseEntity<?> updateUsername(@RequestBody Map<String, String> parametres) {
	        try {
	            userService.modifierNomUtilisateur(parametres);
	            return ResponseEntity.ok().build();
	        } catch (UsernameNotFoundException e) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating username");
	        }
	    }
		
		/*** Change Password *****/
		 @PutMapping("/changePassword")
		    public void changePassword(@RequestBody Map<String, String> requestBody) {
		        userService.changePassword(requestBody);
		    }
		 
		 /*** Change Password *****/
		 
		 @GetMapping("/getUserDetailsById")
		    public ResponseEntity<User> getUserDetails() {
		        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		        Long userId = userService.getUserIdByUsername(authentication.getName());

		        if (userId != null) {
		            User userDetails = userService.getUserById(userId);
		            if (userDetails != null) {
		                return ResponseEntity.ok(userDetails);
		            }
		        }

		        return ResponseEntity.notFound().build();
		    }
		 
		 @GetMapping("/userById")
		  public Long getCurrentUserId() {
		      return userService.getCurrentUserId();
		    }
		 
		 @GetMapping("/registrations")
			public ResponseEntity<Map<String, Object>> getUserRegistrationTrend() {
			    List<Object[]> registrationTrends = userRep.getUserRegistrationTrend();
			    
			    List<String> labels = new ArrayList<>();
			    List<Long> registrations = new ArrayList<>();
			    for (Object[] trend : registrationTrends) {
			        labels.add(trend[0].toString()); 
			        registrations.add((Long) trend[1]); 
			    }
			    
			    Map<String, Object> responseData = new HashMap<>();
			    responseData.put("labels", labels);
			    responseData.put("registrations", registrations);
			    
			    return ResponseEntity.ok(responseData);
			}

		 
		 @GetMapping("/userByUsername")
		 public ResponseEntity<Map<String, String>> getCurrentUsername() {
		     Map<String, String> response = new HashMap<>();
		     response.put("username", userService.getCurrentUsername());
		     return ResponseEntity.ok(response);
		 }



}
