package com.nt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nt.entity.Player;
import com.nt.entity.Team;
import com.nt.exception.TeamNotFoundException;
import com.nt.repository.IPlayerRepository;
import com.nt.repository.ITeamRepository;
import com.nt.vo.TeamVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ITeamServiceImpl implements ITeamService {

	@Autowired
	private ITeamRepository repo;

	@Autowired
	private IPlayerRepository playerRepo;

	@Autowired
	private Environment env;

	@Override
	public TeamVo registerTeam(TeamVo team) {
		log.info("Registering a new team: {}", team.getTeamName());
		Team tm = new Team();
		copyToEntity(team, tm);
		String actor = env.getProperty("user.name");
		tm.setCreatedBy(actor);
		tm.setUpdatedBy(actor);
		Team savedTeam = repo.save(tm);
		log.info("Team registered successfully with ID: {}", savedTeam.getTeamId());
		return toVo(savedTeam);
	}

	@Override
	public List<TeamVo> registerAllTeam(List<TeamVo> teams) {
		log.info("Registering {} teams.", teams.size());
		List<TeamVo> saved = new ArrayList<>();
		for (TeamVo team : teams) {
			saved.add(registerTeam(team));
		}
		log.info("Successfully registered {} teams.", saved.size());
		return saved;
	}

	@Override
	public TeamVo findTeamById(int id) {
		log.info("Searching for team with ID: {}", id);
		Team team = repo.findById(id).orElseThrow(() -> {
			log.warn("Team not found with ID: {}", id);
			return new TeamNotFoundException("Team not found with id : " + id);
		});
		return toVo(team);
	}

	@Override
	public List<TeamVo> getAllTeams() {
		log.info("Fetching all teams");
		List<TeamVo> teamVos = new ArrayList<>();
		repo.findAll().forEach(team -> teamVos.add(toVo(team)));
		return teamVos;
	}

	@Override
	public TeamVo updateTeamDetails(TeamVo team) {
		log.info("Updating team with ID: {}", team.getTeamId());
		Team tm = repo.findById(team.getTeamId()).orElseThrow(() -> {
			log.warn("Team not found with ID: {}", team.getTeamId());
			return new TeamNotFoundException("Team not found with id : " + team.getTeamId());
		});
		copyToEntity(team, tm);
		tm.setUpdatedBy(env.getProperty("user.name"));
		Team updatedTeam = repo.save(tm);
		log.info("Team updated successfully with ID: {}", updatedTeam.getTeamId());
		return toVo(updatedTeam);
	}

	@Override
	@Transactional
	public String deleteTeamById(int id) {
		log.info("Deleting team with ID: {}", id);
		Team team = repo.findById(id).orElseThrow(() -> new TeamNotFoundException("Team not found with id : " + id));
		List<Player> squad = playerRepo.findByTeam_TeamId(id);
		squad.forEach(p -> p.setTeam(null));
		playerRepo.saveAll(squad);
		playerRepo.flush();
		repo.delete(team);
		log.info("Team deleted successfully with ID: {}", id);
		return "Team deleted successfully with id : " + id;
	}

	@Override
	@Transactional
	public String deleteAllTeams() {
		log.info("Deleting all teams.");
		List<Player> players = playerRepo.findAll();
		players.forEach(p -> p.setTeam(null));
		playerRepo.saveAll(players);
		playerRepo.flush();
		repo.deleteAllInBatch();
		log.info("All teams deleted successfully.");
		return "All teams deleted successfully.";
	}

	private void copyToEntity(TeamVo vo, Team tm) {
		if (vo.getTeamName() != null) {
			tm.setTeamName(vo.getTeamName());
		}
		if (vo.getTeamOwner() != null) {
			tm.setTeamOwner(vo.getTeamOwner());
		}
		if (vo.getTeamCaptain() != null) {
			tm.setTeamCaptain(vo.getTeamCaptain());
		}
	}

	private TeamVo toVo(Team team) {
		TeamVo vo = new TeamVo();
		vo.setTeamId(team.getTeamId());
		vo.setTeamName(team.getTeamName());
		vo.setTeamOwner(team.getTeamOwner());
		vo.setTeamCaptain(team.getTeamCaptain());
		return vo;
	}
}
