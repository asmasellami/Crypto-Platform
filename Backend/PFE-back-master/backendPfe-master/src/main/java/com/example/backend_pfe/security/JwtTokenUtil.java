package com.example.backend_pfe.security;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;


@Component
public class JwtTokenUtil {
	
	
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
    
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    
    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SecParams.SECRET)
                .parseClaimsJws(token)
                .getBody();
    }
    
	 public Map<String, Claim> getAllClaims(String token) {
	        return decodeJWT(token).getClaims();
	    }
	
	 public <T> T getClaim(String token, Function<Map<String, Claim>, T> claimsResolver) {
	        Map<String, Claim> claims = getAllClaims(token);
	        return claimsResolver.apply(claims);
	    }
	 
	 public boolean validateToken(String token) throws Exception {
		    try {
		      Jwts.parser().setSigningKey(SecParams.SECRET).parseClaimsJws(token);
		      return true;
		    } catch (JwtException | IllegalArgumentException e) {
		      throw new Exception("Expired or invalid JWT token");
		    }
		  }


}