package com.nt.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nt.entity.Admin;
import com.nt.exception.InvalidCredentialsException;
import com.nt.repository.IAdminRepository;
import com.nt.security.JwtService;
import com.nt.vo.AdminVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminServiceImpl implements IAdminService {

	private final IAdminRepository repo;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AdminServiceImpl(IAdminRepository repo, PasswordEncoder passwordEncoder, JwtService jwtService) {
		this.repo = repo;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@Override
	public AdminVo login(String email, String password) {
		if (email == null || password == null) {
			throw new InvalidCredentialsException("Email and password are required");
		}
		Admin admin = repo.findByEmailIgnoreCase(email.trim())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
		if (admin.getPasswordHash() == null || !passwordEncoder.matches(password, admin.getPasswordHash())) {
			throw new InvalidCredentialsException("Invalid email or password");
		}
		log.info("Admin login successful for {}", admin.getEmail());
		AdminVo vo = new AdminVo();
		vo.setAdminId(admin.getAdminId());
		vo.setName(admin.getName());
		vo.setEmail(admin.getEmail());
		vo.setRole("ADMIN");
		vo.setToken(jwtService.generateToken(null, admin.getEmail(), JwtService.ROLE_ADMIN));
		return vo;
	}
}
