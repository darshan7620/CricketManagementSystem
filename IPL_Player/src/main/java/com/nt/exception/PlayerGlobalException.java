package com.nt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.nt.vo.ApiError;

@RestControllerAdvice
public class PlayerGlobalException {

	@ExceptionHandler(PlayerNotFoundException.class)
	public ResponseEntity<ApiError> PNFExceptionHandler(PlayerNotFoundException e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(TeamNotFoundException.class)
	public ResponseEntity<ApiError> TNFExceptionHandler(TeamNotFoundException e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(DuplicatePlayerException.class)
	public ResponseEntity<ApiError> duplicateHandler(DuplicatePlayerException e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.CONFLICT);
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ApiError> credentialsHandler(InvalidCredentialsException e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(WeakPasswordException.class)
	public ResponseEntity<ApiError> weakPasswordHandler(WeakPasswordException e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiError> accessDeniedHandler(AccessDeniedException e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> GLBExceptionHandler(Exception e) {
		return new ResponseEntity<>(new ApiError(e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
