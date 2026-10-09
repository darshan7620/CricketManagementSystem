package com.nt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nt.service.ITeamService;
import com.nt.vo.TeamVo;

@RestController
@RequestMapping("/team-api")
public class TeamController {

	@Autowired
	private ITeamService service;

	@GetMapping("/find/{id}")
	public ResponseEntity<TeamVo> fetchTeamById(@PathVariable Integer id) {
		return new ResponseEntity<TeamVo>(service.findTeamById(id), HttpStatus.OK);
	}

	@PostMapping("/register")
	public ResponseEntity<TeamVo> insertTeam(@RequestBody TeamVo team) {
		return new ResponseEntity<TeamVo>(service.registerTeam(team), HttpStatus.CREATED);
	}

	@PostMapping("/registerAll")
	public ResponseEntity<List<TeamVo>> insertAllTeams(@RequestBody List<TeamVo> teams) {
		return new ResponseEntity<List<TeamVo>>(service.registerAllTeam(teams), HttpStatus.CREATED);
	}

	@GetMapping("/findAll")
	public ResponseEntity<List<TeamVo>> fetchAllTeams() {
		return new ResponseEntity<List<TeamVo>>(service.getAllTeams(), HttpStatus.OK);
	}

	@PutMapping("/updateTeam")
	public ResponseEntity<TeamVo> updateTeamData(@RequestBody TeamVo vo) {
		return new ResponseEntity<TeamVo>(service.updateTeamDetails(vo), HttpStatus.OK);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteTeamWithId(@PathVariable Integer id) {
		return new ResponseEntity<String>(service.deleteTeamById(id), HttpStatus.ACCEPTED);
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<String> removeAllTeams() {
		return new ResponseEntity<String>(service.deleteAllTeams(), HttpStatus.ACCEPTED);
	}
}
