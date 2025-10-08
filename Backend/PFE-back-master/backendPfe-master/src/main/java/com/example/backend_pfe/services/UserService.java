package com.example.backend_pfe.services;


import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.example.backend_pfe.entities.Role;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.register.RegistationRequest;



public interface UserService {
User saveUser(User user);
User findUserByUsername (String username);
Role addRole(Role role);
User addRoleToUser(String username, String rolename);
List<User> findAllUsers();
User registerUser(RegistationRequest request);

User updateUser(User u);

public void sendEmailUser(User u, String code);
public User validateToken(String code);

User loadUserByUsername(String username) throws UsernameNotFoundException;
void modifierMotDePasse(Map<String, String> parametres);
void nouveauMotDePasse(Map<String, String> parametres);
long getUsersCount();
void deleteUser(Long userId);
User getUser(Long userId);
User verifyUser(String email);
//User updateUser(Long userId, User updatedUser);

User getUserByUsername(String username);

User getUserById(Long userId);
Long getUserIdByUsername(String username);
void updateUsername(String oldUsername, String newUsername);
void modifierNomUtilisateur(Map<String, String> parametres);
User loadUserById(Long userId);
/********* Pour Admin ************/
User AddUser(RegistationRequest request);
void changePassword(Map<String, String> parameters);
/*** Change Password *****/
Long getCurrentUserId();
String getCurrentUsername();

List<Object[]> getUserRegistrations();
}