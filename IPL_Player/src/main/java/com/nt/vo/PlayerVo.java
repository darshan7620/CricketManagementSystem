package com.nt.vo;

import com.nt.entity.Team;

import lombok.Data;

@Data
public class PlayerVo {
private Integer playerId;
	private String playerName;
	private String playerRole;
	private Integer jerseyNo;
	private Integer age;
	private Team team;
}
