package com.nt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nt.entity.Player;

public interface IPlayerRepository extends JpaRepository<Player, Integer> {

	Optional<Player> findByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCase(String email);

	List<Player> findByTeam_TeamId(Integer teamId);
}
