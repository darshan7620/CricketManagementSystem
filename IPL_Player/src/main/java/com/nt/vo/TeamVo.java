package com.nt.vo;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class TeamVo implements Serializable{
	private Integer teamId;
	private String teamName;
	private String teamOwner;
	private String teamCaptain;
	private List<PlayerVo> players;
}
