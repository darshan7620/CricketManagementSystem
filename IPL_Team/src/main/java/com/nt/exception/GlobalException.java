package com.nt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.nt.vo.ApiError;

@RestControllerAdvice
public class GlobalException {

	@ExceptionHandler(TeamNotFoundException.class)
	public ResponseEntity<ApiError> teamAvailability(TeamNotFoundException ex) {
		return new ResponseEntity<>(new ApiError(ex.getMessage()), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> globalExceptionHandler(Exception e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
