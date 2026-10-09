package com.nt.exception;

public class WeakPasswordException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public WeakPasswordException(String msg) {
		super(msg);
	}
}
