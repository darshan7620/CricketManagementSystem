package com.nt.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class PlayerVo implements Serializable{
	private Integer playerId;
	private String playerName;
	private String playerRole;
	private Integer jerseyNo;
	private Integer age;
	private TeamVo team;
}
