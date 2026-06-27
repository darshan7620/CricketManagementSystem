package com.nt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PlayerGlobalException {

	@ExceptionHandler(PlayerNotFoundException.class)
	public ResponseEntity<String> PNFExceptionHandler() {
		return new ResponseEntity<String>("Player not found", HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> GLBExceptionHandler(){
		return new ResponseEntity<String>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
