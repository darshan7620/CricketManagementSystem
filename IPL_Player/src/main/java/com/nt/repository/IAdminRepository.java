package com.nt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nt.entity.Admin;

public interface IAdminRepository extends JpaRepository<Admin, Long> {

	Optional<Admin> findByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCase(String email);
}
