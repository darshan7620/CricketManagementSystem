package com.nt.exception;

public class DuplicatePlayerException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public DuplicatePlayerException(String msg) {
		super(msg);
	}
}
