package com.example.backend_pfe.exception;


import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ExpiredTokenException extends RuntimeException{
	private String message;
	public ExpiredTokenException (String message){
		super(message);
	}
}
