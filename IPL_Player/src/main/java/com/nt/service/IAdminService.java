package com.nt.service;

import com.nt.vo.AdminVo;

public interface IAdminService {

	AdminVo login(String email, String password);
}
