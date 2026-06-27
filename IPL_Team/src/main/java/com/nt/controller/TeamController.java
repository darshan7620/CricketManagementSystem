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

import com.nt.entity.Team;
import com.nt.service.ITeamService;
import com.nt.vo.TeamVo;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/team-api")
@Slf4j
public class TeamController {
	
	@Autowired
	private ITeamService service; // service injected
	
	@GetMapping("/find/{id}")
	public ResponseEntity<Team> fetchTeamById(@PathVariable Integer id){
		log.debug("fetchTeamById method execution started");
		log.info("Fetching the team by received id");
		
		// Get the team object
		Team team = service.findTeamById(id);
		
		log.info("Fetched team data result is returned");
		log.debug("fetchTeamById method execution completed");
		// return response entity
		return new 
				ResponseEntity<Team>(team,HttpStatus.OK);
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> insertTeam(@RequestBody TeamVo team){
		log.debug("insertTeam method execution started");
		log.info("Registering the team");
		
		// call service method
		Team result = service.registerTeam(team);
		
		log.info("After registering the team and return the result");
		log.debug("insertTeam method execution completed");
		// return the response entity
		return new 
				ResponseEntity<String>("Team is registered with id: "+result.getTeamId(),HttpStatus.CREATED);
	}
	
	@PostMapping("/registerAll")
	public ResponseEntity<String> insertAllTeams(@RequestBody List<TeamVo> teams){
		log.debug("insertAllTeams method execution started");
		log.info("All teams record inserted");
		// call service methods
		List<Team> tms = service.registerTeam(teams);
		
		// get ids of team
		List<Integer> ids = tms.stream().map(Team::getTeamId).toList();
		log.info("All teams id are fetched and returned as result");
		log.debug("insertAllTeams method execution completed");
		// return respone entity
		return new 
				ResponseEntity<String>("Teams are registered with ids: "+ids,HttpStatus.CREATED);
	}
	
	@GetMapping("/findAll")
	public ResponseEntity<List<Team>> fetchAllTeams(){
		log.debug("fetchAllTeams method execution started");
		log.info("Getting All teams");
		// call service method
		List<Team> teams = service.getAllTeams();
		log.debug("fetchAllTeams method execution completed");
		// return response entity
		return new ResponseEntity<List<Team>>(teams, HttpStatus.OK);
	}
	
	@PutMapping("/updateTeam")
	public ResponseEntity<String> updateTeamData(@RequestBody TeamVo vo){
		log.debug("updateTeamData method execution started");
		log.info("updating the the team data, calling service method");
		// call service to update object
		Team team = service.updateTeamDetails(vo);
		log.info("updated object service result is returned");
		log.debug("updateTeamData method execution completed");
		// return response entity
		return new 
				ResponseEntity<String>("Team data has been updated having id: "+team.getTeamId(),HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteTeamWithId(@PathVariable Integer id){
		log.debug("deleteTeamWithId method execution started");
		log.info("deleted team service method is called");
		// call service
		String result = service.deleteTeamById(id);
		log.info("deleted team service result is returned");
		log.debug("deleteTeamWithId method execution completed");
		// return response entity
		return new 
				ResponseEntity<String>(result,HttpStatus.ACCEPTED);
	}
	
	@DeleteMapping("/deleteAll")
	public ResponseEntity<String> removeAllTeams(){
		log.debug("removeAllTeams method execution started");
		log.info("delete all teams service method is called");
		// call service to delete all teams
		String result = service.deleteAllTeams();
		log.info("deleted all teams service method result is returned");
		log.debug("removeAllTeams method execution completed");
		// return response entity
		return new
				ResponseEntity<String>(result,HttpStatus.ACCEPTED);
	}
}
