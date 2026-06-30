package com.nt.vo;

import java.util.List;

import com.nt.entity.Player;

import lombok.Data;

@Data
public class TeamVo {
	private Integer teamId;
	private String teamName;
	private String teamOwner;
	private String teamCaptain;
	private List<PlayerVo> players;
}
