package com.nt.service;

import java.util.List;

import com.nt.entity.Team;
import com.nt.vo.TeamVo;

public interface ITeamService {
	public TeamVo registerTeam(TeamVo team); // done
	public List<TeamVo> registerAllTeam(List<TeamVo> teams); // done
	public TeamVo findTeamById(int id); // done
	public List<TeamVo> getAllTeams(); // done
	public TeamVo updateTeamDetails(TeamVo team); // done
	public String deleteTeamById(int id); // done
	public String deleteAllTeams(); // done
}
