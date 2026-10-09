package com.nt.security;

import java.util.regex.Pattern;

import com.nt.exception.WeakPasswordException;

/**
 * Server-side password strength policy. Applied on any path that accepts a
 * plain-text password so a weak secret can never reach the database, regardless
 * of what the client sends.
 */
public final class PasswordPolicy {

	private static final int MIN_LENGTH = 8;
	// BCrypt only considers the first 72 bytes.
	private static final int MAX_LENGTH = 72;

	private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
	private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
	private static final Pattern DIGIT = Pattern.compile("[0-9]");
	private static final Pattern SPECIAL = Pattern.compile("[^A-Za-z0-9]");

	private PasswordPolicy() {
	}

	public static void validate(String password) {
		if (password == null || password.isBlank()) {
			throw new WeakPasswordException("Password is required");
		}
		if (password.length() < MIN_LENGTH) {
			throw new WeakPasswordException("Password must be at least " + MIN_LENGTH + " characters long");
		}
		if (password.length() > MAX_LENGTH) {
			throw new WeakPasswordException("Password must be at most " + MAX_LENGTH + " characters long");
		}
		if (!UPPERCASE.matcher(password).find() || !LOWERCASE.matcher(password).find()
				|| !DIGIT.matcher(password).find() || !SPECIAL.matcher(password).find()) {
			throw new WeakPasswordException(
					"Password must include an uppercase letter, a lowercase letter, a digit and a special character");
		}
	}
}
