package com.example.backend_pfe.services;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend_pfe.entities.ResetToken;
import com.example.backend_pfe.entities.Role;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.entities.VerificationToken;
import com.example.backend_pfe.exception.EmailAlreadyExistsException;
import com.example.backend_pfe.exception.ExpiredTokenException;
import com.example.backend_pfe.exception.InvalidTokenException;
import com.example.backend_pfe.register.RegistationRequest;
import com.example.backend_pfe.repositories.RoleRepository;
import com.example.backend_pfe.repositories.UserRepository;
import com.example.backend_pfe.repositories.VerificationTokenRepository;
import com.example.backend_pfe.security.JWTAuthenticationFilter;
import com.example.backend_pfe.util.EmailSender;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;


@Transactional
@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRep;
	
	@Autowired
	ResetTokenService resetService;
	
	@Autowired
	RoleRepository roleRep;

	
	@Autowired
	VerificationTokenRepository  verificationTokenRepo;
	
	@Autowired
	EmailSender emailSender;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	
	JWTAuthenticationFilter jwtAuthenticationFilter;
	
	@Override
	public User saveUser(User user)
	{
	user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
	return userRep.save(user);
	}
	
	@Override
	public User addRoleToUser(String username, String rolename) {
	User usr = userRep.findByUsername(username);
	Role r = roleRep.findByRole(rolename);
	usr.getRoles().add(r);
	return usr;
	}
	
	@Override
	public Role addRole(Role role) {
	return roleRep.save(role);
	}
	@Override
	public User findUserByUsername(String username) {
	return userRep.findByUsername(username);
	}

	@Override
	public List<User> findAllUsers() {
		return userRep.findAll();
	}
	


	@Override
	public void sendEmailUser(User u, String code) {
		 /*String emailBody ="Dear "+ "<h1>"+u.getUsername() +"</h1>" +
		  " Your validation code is "+"<h1>"+code+"</h1>"; */
		
		  String emailBody = String.format(
                  "<div style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>"
                  + "<h2 style='color: #4CAF50;'>Dear %s,</h2>"
                  + "<p>Your validation code is:</p>"
                  + "<div style='font-size: 18px; font-weight: bold; color: #E91E63;'>%s</div>"
                  + "<p>Please use this code to complete your registration.</p>"
                  + "<br/>"
                  + "<p>Best regards,</p>"
                  + "<p>The Team</p>"
                  + "</div>",
                  u.getUsername(),
                  code
          );
			 emailSender.sendEmail(u.getEmail(), emailBody);
		}
	
	@Override
	public User validateToken(String code) {
	VerificationToken token = verificationTokenRepo.findByToken(code);
	 if(token == null){
	 throw new InvalidTokenException("Invalid Token");
	 }
	 
	 User user = token.getUser();
	 Calendar calendar = Calendar.getInstance();
	if ((token.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0){
	 verificationTokenRepo.delete(token);
	 throw new ExpiredTokenException("expired Token");
	 }
	 user.setEnabled(true);
	 userRep.save(user);
	 return user;
	}

	@Override
	public User registerUser(RegistationRequest request) {
	Optional<User> optionaluser = userRep.findByEmail(request.getEmail());
	
	
	if(optionaluser.isPresent())
	throw new EmailAlreadyExistsException("email déjà existant!");
	 User newUser = new User();
	 newUser.setUsername(request.getUsername());
	 newUser.setEmail(request.getEmail());
	 newUser.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
	 newUser.setEnabled(false);
	 userRep.save(newUser);
	 //ajouter à newUser le role par défaut USER
	 Role r = roleRep.findByRole("USER");
	 List<Role> roles = new ArrayList<>();
	 roles.add(r);
	 newUser.setRoles(roles);
	 
	 userRep.save(newUser);
	 
	 //génére le code secret 
	 String code = this.generateCode();
	 
	 VerificationToken token = new VerificationToken(code, newUser);
	 verificationTokenRepo.save(token); 
	 
	//envoyer par email pour valider l'email de l'utilisateur 
	 sendEmailUser(newUser,token.getToken());
	 
	 return newUser;
	}
	
	
	public String generateCode() {
	 Random random = new Random();
	 Integer code = 100000 + random.nextInt(900000); 
	 
	 return code.toString();
	}
	
	
	/********* Pour Admin ************/
	@Override
	public User AddUser(RegistationRequest request) {
	    // Log the start of the method
	    System.out.println("Adding user: " + request.getEmail());

	    // Check if the email already exists
	    Optional<User> optionalUser = userRep.findByEmail(request.getEmail());
	    if (optionalUser.isPresent()) {
	        // Log the email existence
	        System.out.println("Email already exists: " + request.getEmail());
	        throw new EmailAlreadyExistsException("email déjà existant!");
	    }

	    // Create a new user entity
	    User newUser = new User();
	    newUser.setUsername(request.getUsername());
	    newUser.setEmail(request.getEmail());
	    newUser.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
	    newUser.setEnabled(true);

	    // Save the new user
	    newUser = userRep.save(newUser);

	    // Add the default role USER
	    Role role = roleRep.findByRole("USER");
	    List<Role> roles = new ArrayList<>();
	    roles.add(role);
	    newUser.setRoles(roles);

	    userRep.save(newUser);

	    // Generate a secret code
	    String code = this.generateCode();

	    // Create a verification token and save it
	    VerificationToken token = new VerificationToken(code, newUser);
	    verificationTokenRepo.save(token);

	    // Log the successful addition of the user
	    System.out.println("User added successfully: " + newUser.getEmail());

	    return newUser;
	}

/**Fin Add user pour admin***/
	
	@Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRep
                .findByEmail(username)
                .orElseThrow(() -> new  UsernameNotFoundException("Aucun utilisateur ne corespond à cet identifiant"));
    }
	
	


	@Override
	public void modifierMotDePasse(Map<String, String> parametres) {
		User utilisateur = this.loadUserByUsername(parametres.get("email"));
		this.resetService.enregistrer(utilisateur);
	
		
	}

	@Override
	public void nouveauMotDePasse(Map<String, String> parametres) {
		User utilisateur = this.loadUserByUsername(parametres.get("email"));
	
		final ResetToken validation = resetService.lireEnFonctionDuCode(parametres.get("code"));

		if(validation.getUtilisateur().getEmail().equals(utilisateur.getEmail())) {
			String mdpCrypte = this.bCryptPasswordEncoder.encode(parametres.get("password"));
			utilisateur.setPassword(mdpCrypte);
			
			this.userRep.save(utilisateur);
		}
	}
	
	@Override
	 public long getUsersCount() {
	        return userRep.count();
	    }
	
	
	@Override
	public User getUser(Long userId) {
		return userRep.findById(userId).get();
	}


	
	@Override
	public void deleteUser(Long userId) {
	    User user = getUser(userId);
	    
	    List<Role> roles = user.getRoles();
	    for (Role role : roles) {
	        role.getUsers().remove(user);
	    }
	    
	    user.getRoles().clear();
	    userRep.deleteById(userId);
	}
	
	@Override
	public User updateUser(User updatedUser) {
	    try {
	        // Find the existing user by ID
	        User existingUser = userRep.findById(updatedUser.getUser_id())
	                                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

	        // Update only the username
	        existingUser.setUsername(updatedUser.getUsername());

	        // Save the updated user
	        User savedUser = userRep.save(existingUser);

	        // Refresh the token with the new username
	        String newToken = jwtAuthenticationFilter.refreshToken(savedUser.getUsername());

	        // Return the updated user
	        return savedUser;
	    } catch (EntityNotFoundException e) {
	        // Handle the case where the user with the given ID is not found
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found", e);
	    } catch (Exception e) {
	        // Handle other exceptions
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating user", e);
	    }
	}


	
	
	
	@Override
	public User verifyUser(String email) {
	    Optional<User> optionalUser = userRep.findByEmail(email);

	    if (optionalUser.isPresent()) {
	        User existingUser = optionalUser.get();
	        if (!existingUser.getEnabled()) {
	            String code = generateCode();
	            VerificationToken token = new VerificationToken(code, existingUser);
	            verificationTokenRepo.save(token);

	         
	            sendEmailUser(existingUser, token.getToken());

	            return existingUser;
	        } else {
	            throw new EmailAlreadyExistsException("Email already exists!");
	        }
	    } else {
	        throw new UsernameNotFoundException("User not found!");
	    }
	}

	@Override
	 public User getUserByUsername(String username) {
        return userRep.findByUsername(username);
    }

	@Override
	 public User getUserById(Long userId) {
	        return userRep.findById(userId).orElse(null);
	    }

	 @Override
	    public Long getUserIdByUsername(String username) {
	        User user = userRep.findByUsername(username);
	        return (user != null) ? user.getUser_id() : null;
	    }
	
	
	 @Override
	 public void updateUsername(String oldUsername, String newUsername) {
	        User user = userRep.findByUsername(oldUsername);
	        if (user == null) {
	            throw new UsernameNotFoundException("User not found");
	        }

	        // Update the username
	        user.setUsername(newUsername);
	        userRep.save(user);

	    }
	 
	 
	 
	 @Override
		public User loadUserById(Long userId) {
		    return this.userRep.findById(userId)
		            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
		}
	 
	 @Override
	 public void modifierNomUtilisateur(Map<String, String> parametres) {
	     Long userId = Long.parseLong(parametres.get("user_id"));
	     String username = parametres.get("username");
	     
	     User utilisateur = this.loadUserById(userId);
	     if (utilisateur != null) {
	         utilisateur.setUsername(username);
	         this.userRep.save(utilisateur);
	     } else {
	         throw new UsernameNotFoundException("User with id " + userId + " not found");
	     }
	 }
	 
	 @Override
	    public List<Object[]> getUserRegistrations() {
	        return userRep.getUserRegistrationTrend();
	    }
	    
	 /*** Change Password *****/
	 @Override
	 public void changePassword(Map<String, String> parameters) {
	     Long userId = Long.parseLong(parameters.get("user_id"));
	     String newPassword = parameters.get("new_password");

	     User user = loadUserById(userId);

	     if (user != null) {
	         user.setPassword(bCryptPasswordEncoder.encode(newPassword));
	         userRep.save(user);
	     } else {
	         throw new UsernameNotFoundException("User with id " + userId + " not found");
	     }
	 }
	 
	/************Fin Change password******************************/

	 @Override
	 public Long getCurrentUserId() {
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        if (authentication == null || !authentication.isAuthenticated()) {
	            return null;
	        }
	        String username = authentication.getName();
	        User user = userRep.findByUsername(username);
	        return user != null ? user.getUser_id() : null;
	    }

	 @Override
	 public String getCurrentUsername() {
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        if (authentication == null || !authentication.isAuthenticated()) {
	            return null;
	        }
	        String username = authentication.getName();
	        User user = userRep.findByUsername(username);
	        return user != null ? user.getUsername() : null;
	    }


}

