package com.nt.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nt.service.IAdminService;
import com.nt.vo.AdminVo;
import com.nt.vo.LoginRequest;

@RestController
@RequestMapping("/admin-api")
public class AdminAuthController {

	private final IAdminService adminService;

	public AdminAuthController(IAdminService adminService) {
		this.adminService = adminService;
	}

	@PostMapping("/auth/login")
	public ResponseEntity<AdminVo> login(@RequestBody LoginRequest request) {
		return new ResponseEntity<>(adminService.login(request.getEmail(), request.getPassword()), HttpStatus.OK);
	}
}
