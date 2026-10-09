package com.nt.security;

import java.io.Serializable;

/**
 * Principal stored in the SecurityContext after a JWT is validated. Plain
 * getters (not a record) so SpEL and misc. consumers can read properties.
 */
public class AuthenticatedUser implements Serializable {

	private final Integer uid;
	private final String email;
	private final String role;

	public AuthenticatedUser(Integer uid, String email, String role) {
		this.uid = uid;
		this.email = email;
		this.role = role;
	}

	public Integer getUid() {
		return uid;
	}

	public String getEmail() {
		return email;
	}

	public String getRole() {
		return role;
	}
}
