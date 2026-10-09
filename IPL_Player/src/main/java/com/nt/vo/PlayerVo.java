package com.nt.vo;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PlayerVo implements Serializable {
	private Integer playerId;
	private String playerName;
	private String playerRole;
	private Integer jerseyNo;
	private Integer age;
	private String email;
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;
	private TeamVo team;
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String role;
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String token;
}
