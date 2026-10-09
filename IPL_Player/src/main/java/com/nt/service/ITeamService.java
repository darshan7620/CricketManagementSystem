package com.nt.service;

import java.util.List;

import com.nt.vo.TeamVo;

public interface ITeamService {
	public TeamVo registerTeam(TeamVo team);
	public List<TeamVo> registerAllTeam(List<TeamVo> teams);
	public TeamVo findTeamById(int id);
	public List<TeamVo> getAllTeams();
	public TeamVo updateTeamDetails(TeamVo team);
	public String deleteTeamById(int id);
	public String deleteAllTeams();
}
