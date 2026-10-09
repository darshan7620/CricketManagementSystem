package com.nt;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import tools.jackson.databind.ObjectMapper;
import com.nt.entity.Admin;
import com.nt.repository.IAdminRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthSecurityTests {

	private static final String PASSWORD = "Secret@123";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private IAdminRepository adminRepo;

	private String toJson(Object value) throws Exception {
		return objectMapper.writeValueAsString(value);
	}

	private Map<String, Object> newPlayer(String email) {
		Map<String, Object> player = new LinkedHashMap<>();
		player.put("playerName", "Test Player");
		player.put("playerRole", "Batsman");
		player.put("jerseyNo", 7);
		player.put("age", 25);
		player.put("email", email);
		player.put("password", PASSWORD);
		return player;
	}

	private String signupAndGetToken(String email) throws Exception {
		String body = mockMvc.perform(post("/player-api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(newPlayer(email))))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.role").value("PLAYER"))
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andReturn().getResponse().getContentAsString();
		return objectMapper.readTree(body).get("token").asText();
	}

	private String adminToken(String email) throws Exception {
		Admin admin = new Admin();
		admin.setName("Administrator");
		admin.setEmail(email);
		admin.setPasswordHash(passwordEncoder.encode(PASSWORD));
		adminRepo.saveAndFlush(admin);

		String body = mockMvc.perform(post("/admin-api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.role").value("ADMIN"))
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andReturn().getResponse().getContentAsString();
		return objectMapper.readTree(body).get("token").asText();
	}

	@Test
	void weakPasswordIsRejectedWithBadRequest() throws Exception {
		Map<String, Object> player = newPlayer("weak@test.local");
		player.put("password", "weak");

		mockMvc.perform(post("/player-api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(player)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void anonymousPlayerReadIsUnauthorized() throws Exception {
		mockMvc.perform(get("/player-api/findAll")).andExpect(status().isUnauthorized());
	}

	@Test
	void teamDirectoryIsPubliclyReadable() throws Exception {
		mockMvc.perform(get("/team-api/findAll")).andExpect(status().isOk());
	}

	@Test
	void publicSignupForcesPlayerRoleRegardlessOfRequestBody() throws Exception {
		Map<String, Object> player = newPlayer("smuggle@test.local");
		player.put("role", "ADMIN");

		mockMvc.perform(post("/player-api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(player)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.role").value("PLAYER"));
	}

	@Test
	void playerTokenCannotReachAdminWriteEndpoints() throws Exception {
		String token = signupAndGetToken("player-write@test.local");
		String auth = "Bearer " + token;

		mockMvc.perform(post("/player-api/register")
						.header("Authorization", auth)
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(newPlayer("another@test.local"))))
				.andExpect(status().isForbidden());

		mockMvc.perform(delete("/player-api/deleteAll").header("Authorization", auth))
				.andExpect(status().isForbidden());
	}

	@Test
	void playerTokenCanReadPlayers() throws Exception {
		String token = signupAndGetToken("player-read@test.local");
		mockMvc.perform(get("/player-api/findAll").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	void playerLoginSucceedsAndWrongPasswordIsUnauthorized() throws Exception {
		signupAndGetToken("login@test.local");

		mockMvc.perform(post("/player-api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"login@test.local\",\"password\":\"" + PASSWORD + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty());

		mockMvc.perform(post("/player-api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"login@test.local\",\"password\":\"wrong\"}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void adminTokenCanPerformWrites() throws Exception {
		String token = adminToken("admin-write@test.local");
		String auth = "Bearer " + token;

		mockMvc.perform(post("/player-api/register")
						.header("Authorization", auth)
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(newPlayer("admin-created@test.local"))))
				.andExpect(status().isCreated());

		mockMvc.perform(delete("/player-api/deleteAll").header("Authorization", auth))
				.andExpect(status().isOk());
	}

	@Test
	void adminLoginWithBadPasswordIsUnauthorized() throws Exception {
		Admin admin = new Admin();
		admin.setName("Administrator");
		admin.setEmail("admin-bad@test.local");
		admin.setPasswordHash(passwordEncoder.encode(PASSWORD));
		adminRepo.saveAndFlush(admin);

		mockMvc.perform(post("/admin-api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"admin-bad@test.local\",\"password\":\"nope\"}"))
				.andExpect(status().isUnauthorized());
	}
}
