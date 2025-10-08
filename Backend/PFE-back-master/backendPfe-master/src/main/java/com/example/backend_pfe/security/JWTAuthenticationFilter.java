package com.example.backend_pfe.security;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend_pfe.entities.User;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	 private AuthenticationManager authenticationManager;

	    public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
	        super();
	        this.authenticationManager = authenticationManager;
	    }

	    @Override
	    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
	            throws AuthenticationException {

	        User user = null;
	        try {
	            user = new ObjectMapper().readValue(request.getInputStream(), User.class);
	        } catch (IOException e) {
	            e.printStackTrace();
	        }

	        return authenticationManager
	                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
	    }

	    @Override
	    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
	                                            Authentication authResult) throws IOException, ServletException {

	        org.springframework.security.core.userdetails.User springUser = (org.springframework.security.core.userdetails.User) authResult
	                .getPrincipal();

	        List<String> roles = new ArrayList<>();
	        springUser.getAuthorities().forEach(au -> {
	            roles.add(au.getAuthority());
	        });

	        String jwt = JWT.create().withSubject(springUser.getUsername())
	                .withArrayClaim("roles", roles.toArray(new String[roles.size()]))
	                .withExpiresAt(new Date(System.currentTimeMillis() + SecParams.EXP_TIME))
	                .sign(Algorithm.HMAC256(SecParams.SECRET));

	        response.addHeader("Authorization", jwt);
	    }
	
	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request,
	        HttpServletResponse response, AuthenticationException failed)
	        throws IOException, ServletException {
	    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	    response.setContentType("application/json");
	    Map<String, Object> data = new HashMap<>();

	    if (failed instanceof DisabledException) {
	        // If the user is disabled
	        data.put("errorCause", "disabled");
	        data.put("message", "L'utilisateur est désactivé !");
	    } else if (failed instanceof BadCredentialsException) {
	      
	        data.put("errorCause", "invalid_credentials");
	        data.put("message", "Invalid username or password");
	    } else if (failed instanceof UsernameNotFoundException) {
	        
	        data.put("errorCause", "user_not_found");
	        data.put("message", "User not found");
	    } else {
	       
	        data.put("errorCause", "authentication_failed");
	        data.put("message", "Authentication failed");
	    }

	    ObjectMapper objectMapper = new ObjectMapper();
	    String json = objectMapper.writeValueAsString(data);
	    PrintWriter writer = response.getWriter();
	    writer.println(json);
	    writer.flush();
	}
	
	
	 private String generateToken(String username, List<String> roles) {
	        return JWT.create().withSubject(username)
	                .withArrayClaim("roles", roles.toArray(new String[roles.size()]))
	                .withExpiresAt(new Date(System.currentTimeMillis() + SecParams.EXP_TIME))
	                .sign(Algorithm.HMAC256(SecParams.SECRET));
	    }


	 public String refreshToken(String username) {
		    List<String> roles = new ArrayList<>(); // If you have roles, fetch them here
		    return generateToken(username, roles);
		}
	 
	   public <T> T getClaim(String token, Function<Map<String, Claim>, T> claimsResolver) {
	        Map<String, Claim> claims = getAllClaims(token);
	        return claimsResolver.apply(claims);
	    }

	  

	    public Date getExpiration(String token) {
	        return getClaim(token, claims -> claims.get("exp").asDate());
	    }

	    public Map<String, Claim> getAllClaims(String token) {
	        return decodeJWT(token).getClaims();
	    }

	    public boolean isTokenValid(String token, UserDetails userDetails) {
	        try {
	            return decodeJWT(token).getSubject().equals(userDetails.getUsername()) && !isTokenExpired(token);
	        } catch (TokenExpiredException ex) {
	            return false;
	        }
	    }

	    public boolean isTokenExpired(String token) {
	        try {
	            return decodeJWT(token).getExpiresAt().before(new Date(System.currentTimeMillis()));
	        } catch (TokenExpiredException ex) {
	            return true;
	        }
	    }
	    
	    
	    public DecodedJWT decodeJWT(String token) {
	        try {
	            Algorithm algorithm = Algorithm.HMAC256(SecParams.SECRET);
	            JWTVerifier verifier = JWT.require(algorithm).build();
	            return verifier.verify(token);
	        } catch (JWTVerificationException e) {
	            e.printStackTrace();
	            throw e;
	        }
	    }
	    public String getUsername(String token) {
	        try {
	            DecodedJWT jwt = decodeJWT(token);
	            return jwt.getSubject();
	        } catch (JWTVerificationException e) {
	            // Handle the exception if the token cannot be verified
	            e.printStackTrace();
	            return null;
	        }
	    }
}