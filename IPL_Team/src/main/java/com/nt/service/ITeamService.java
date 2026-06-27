package com.nt.service;

import java.util.List;

import com.nt.entity.Team;
import com.nt.vo.TeamVo;

public interface ITeamService {
	public Team registerTeam(TeamVo team); // done
	public List<Team> registerTeam(List<TeamVo> teams); // done
	public Team findTeamById(int id); // done
	public List<Team> getAllTeams(); // done
	public Team updateTeamDetails(TeamVo team); // done
	public String deleteTeamById(int id); // done
	public String deleteAllTeams(); // done
}
