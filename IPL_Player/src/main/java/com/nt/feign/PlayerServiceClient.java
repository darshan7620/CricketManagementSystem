package com.nt.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.nt.entity.Team;

@FeignClient
public interface PlayerServiceClient {
	
	@GetMapping("/find/{id}")
	public ResponseEntity<Team> fetchTeamById(@PathVariable Integer id);
		
}
