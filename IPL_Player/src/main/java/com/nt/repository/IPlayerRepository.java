package com.nt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nt.entity.Player;

public interface IPlayerRepository extends JpaRepository<Player, Integer> {

}
