package com.nt.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.nt.vo.TeamVo;

@FeignClient(name = "ipl-team")
public interface PlayerServiceClient {

	@GetMapping("/team-api/find/{id}")
	public ResponseEntity<TeamVo> fetchTeamById(@PathVariable Integer id);
}
