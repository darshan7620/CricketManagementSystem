package com.nt.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.nt.entity.Admin;
import com.nt.repository.IAdminRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Provisions the initial administrator from environment variables on startup.
 * No public admin signup endpoint exists; this is the only way to create the
 * first admin. If the variables are absent (or the admin already exists) it
 * simply does nothing.
 */
@Component
@Slf4j
public class AdminSeeder implements CommandLineRunner {

	private final IAdminRepository repo;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.admin.email:}")
	private String adminEmail;

	@Value("${app.admin.password:}")
	private String adminPassword;

	public AdminSeeder(IAdminRepository repo, PasswordEncoder passwordEncoder) {
		this.repo = repo;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
			log.info("Initial admin provisioning skipped: IPL_ADMIN_EMAIL / IPL_ADMIN_PASSWORD not set");
			return;
		}
		String email = adminEmail.trim();
		if (repo.existsByEmailIgnoreCase(email)) {
			log.info("Initial admin already present for {}", email);
			return;
		}
		Admin admin = new Admin();
		admin.setName("Administrator");
		admin.setEmail(email);
		admin.setPasswordHash(passwordEncoder.encode(adminPassword));
		repo.save(admin);
		log.info("Initial admin provisioned for {}", email);
	}
}
