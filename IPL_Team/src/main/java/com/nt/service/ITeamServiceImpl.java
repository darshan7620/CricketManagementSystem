package com.nt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.nt.entity.Team;
import com.nt.exception.TeamNotFoundException;
import com.nt.repository.ITeamRepository;
import com.nt.vo.TeamVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ITeamServiceImpl implements ITeamService {

	@Autowired
	private ITeamRepository repo;

	@Autowired
	private Environment env;
	

	// Register Single Team
	@Override
	@Caching(put = { @CachePut(value = "team", key = "#result.teamId") }, evict = {
			@CacheEvict(value = "teams", allEntries = true) })
	public TeamVo registerTeam(TeamVo team) {
		log.info("Registering a new team: {}", team.getTeamName());
		Team tm = new Team();
		BeanUtils.copyProperties(team, tm);
		tm.setCreatedBy(env.getProperty("user.name"));
		Team savedTeam = repo.save(tm);
		TeamVo newTeam = new TeamVo();
		BeanUtils.copyProperties(savedTeam, newTeam);
		log.info("Team registered successfully with ID: {}", savedTeam.getTeamId());
		return newTeam;
	}

	// Register Multiple Teams
	@Override
	@CacheEvict(value = "teams", allEntries = true)
	public List<TeamVo> registerAllTeam(List<TeamVo> teams) {
		log.info("Registering {} teams.", teams.size());
		List<Team> teamList = new ArrayList<>();
		for (TeamVo team : teams) {
			Team tm = new Team();
			BeanUtils.copyProperties(team, tm);
			tm.setCreatedBy(env.getProperty("user.name"));
			Team savedTeam = repo.save(tm);
			log.info("Team '{}' saved with ID: {}", savedTeam.getTeamName(), savedTeam.getTeamId());
			teamList.add(savedTeam);
		}
		List<TeamVo> newTeams = new ArrayList<>();
		for (Team team : teamList) {
			TeamVo tm = new TeamVo();
			BeanUtils.copyProperties(team, tm);
			log.info("Team '{}' saved with ID: {}", tm.getTeamName(), tm.getTeamId());
			newTeams.add(tm);
		}
		log.info("Successfully registered {} teams.", teamList.size());
		return newTeams;
	}

	// Find Team By Id
	@Override
	@Cacheable(value = "team", key = "#id")
	public TeamVo findTeamById(int id) {
		log.info("Searching for team with ID: {}", id);
		Team team = repo.findById(id).orElseThrow(() -> {
			log.warn("Team not found with ID: {}", id);
			return new TeamNotFoundException("Team not found with id : " + id);
		});
		TeamVo teamVo = new TeamVo();
		BeanUtils.copyProperties(team, teamVo);
		log.info("Team found with ID: {}", id);
		return teamVo;
	}

	// Update Team
	@Override
	@Cacheable(value = "teams")
	public List<TeamVo> getAllTeams() {
		log.info("Fetching all teams.");
		List<Team> teams = repo.findAll();
		List<TeamVo> teamVos = new ArrayList<>();
		for (Team team : teams) {
			TeamVo tm = new TeamVo();
			BeanUtils.copyProperties(team, tm);
			log.info("Team '{}' saved with ID: {}", tm.getTeamName(), tm.getTeamId());
			teamVos.add(tm);
		}
		log.info("Retrieved {} teams from database.", teams.size());

		return teamVos;
	}

	// Delete Team By Id
	@Override
	@Caching(evict = { @CacheEvict(value = "team", key = "#id"), @CacheEvict(value = "teams", allEntries = true) })
	public String deleteTeamById(int id) {
		log.info("Deleting team with ID: {}", id);
		repo.deleteById(id);
		log.info("Team deleted successfully with ID: {}", id);
		return "Team deleted successfully with id : " + id;
	}

	@Override
	@Caching(put = { @CachePut(value = "team", key = "#result.teamId") }, evict = {
			@CacheEvict(value = "teams", allEntries = true) })
	public TeamVo updateTeamDetails(TeamVo team) {
		log.info("Updating team with ID: {}", team.getTeamId());
		Team tm = repo.findById(team.getTeamId()).orElseThrow(() -> {
			log.warn("Team not found with ID: {}", team.getTeamId());
			return new TeamNotFoundException("Team not found with id : " + team.getTeamId());
		});
		BeanUtils.copyProperties(team, tm);
		tm.setUpdatedBy(env.getProperty("user.name"));
		
		// copy the updated properties and return the object
		TeamVo teamVo = new TeamVo();
		BeanUtils.copyProperties(tm, teamVo);
		Team updatedTeam = repo.save(tm);
		log.info("Team updated successfully with ID: {}", updatedTeam.getTeamId());
		return teamVo;
	}

	// Delete All Teams
	@Override
	@Caching(evict = { @CacheEvict(value = "team", allEntries = true),
			@CacheEvict(value = "teams", allEntries = true) })
	public String deleteAllTeams() {
		log.info("Deleting all teams.");
		repo.deleteAllInBatch();
		log.info("All teams deleted successfully.");
		return "All teams deleted successfully.";
	}
	
}