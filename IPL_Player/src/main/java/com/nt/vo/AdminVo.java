package com.nt.vo;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AdminVo implements Serializable {
	private Long adminId;
	private String name;
	private String email;
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String role;
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private String token;
}
