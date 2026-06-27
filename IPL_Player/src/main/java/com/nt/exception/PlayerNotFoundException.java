package com.nt.exception;

public class PlayerNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	public PlayerNotFoundException(String msg) {
		super(msg);
	}

}
