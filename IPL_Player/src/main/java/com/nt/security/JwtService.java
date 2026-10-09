package com.nt.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	public static final String ROLE_PLAYER = "ROLE_PLAYER";
	public static final String ROLE_ADMIN = "ROLE_ADMIN";

	private final SecretKey key;
	private final long expirationMs;

	public JwtService(@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.expiration-ms:86400000}") long expirationMs) {
		byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
		if (bytes.length < 32) {
			throw new IllegalStateException("app.jwt.secret must be at least 32 bytes for HS256");
		}
		this.key = Keys.hmacShaKeyFor(bytes);
		this.expirationMs = expirationMs;
	}

	public String generateToken(Integer uid, String email, String role) {
		Date now = new Date();
		return Jwts.builder()
				.subject(email)
				.claim("uid", uid)
				.claim("role", role)
				.issuedAt(now)
				.expiration(new Date(now.getTime() + expirationMs))
				.signWith(key)
				.compact();
	}

	/**
	 * Parses and validates a token. Throws {@code JwtException} when the token is
	 * malformed, expired or carries an invalid signature.
	 */
	public Claims parse(String token) {
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
