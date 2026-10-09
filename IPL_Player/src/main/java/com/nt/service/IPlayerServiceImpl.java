package com.nt.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.nt.entity.Player;
import com.nt.entity.Team;
import com.nt.exception.DuplicatePlayerException;
import com.nt.exception.InvalidCredentialsException;
import com.nt.exception.PlayerNotFoundException;
import com.nt.exception.TeamNotFoundException;
import com.nt.repository.IPlayerRepository;
import com.nt.repository.ITeamRepository;
import com.nt.security.JwtService;
import com.nt.security.PasswordPolicy;
import com.nt.vo.PlayerVo;
import com.nt.vo.TeamVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class IPlayerServiceImpl implements IPlayerService {

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@Autowired
	private IPlayerRepository repo;

	@Autowired
	private ITeamRepository tmRepo;

	@Autowired
	private Environment env;

	@Autowired
	private JwtService jwtService;

	@Override
	public PlayerVo registerPlayer(PlayerVo player) {
		log.debug("register player method executed");
		Player plyr = toEntity(player, new Player());
		plyr.setCreatedBy(env.getProperty("user.name"));
		plyr.setUpdatedBy(env.getProperty("user.name"));
		hashPasswordIfPresent(player, plyr);
		repo.save(plyr);
		return toVo(plyr);
	}

	@Override
	public List<PlayerVo> registerPlayers(List<PlayerVo> players) {
		ArrayList<PlayerVo> saved = new ArrayList<>();
		players.forEach(pl -> saved.add(registerPlayer(pl)));
		return saved;
	}

	@Override
	public PlayerVo findPlayerById(int id) {
		Player pl = repo.findById(id).orElseThrow(() -> new PlayerNotFoundException("Invalid player id"));
		return toVo(pl);
	}

	@Override
	public List<PlayerVo> getAllPlayers() {
		List<PlayerVo> players = new ArrayList<>();
		repo.findAll().forEach(p -> players.add(toVo(p)));
		return players;
	}

	@Override
	public PlayerVo updatePlayerDetails(PlayerVo player) {
		Player p = repo.findById(player.getPlayerId())
				.orElseThrow(() -> new PlayerNotFoundException("Invalid player id"));
		toEntity(player, p);
		p.setUpdatedBy(env.getProperty("user.name"));
		hashPasswordIfPresent(player, p);
		repo.save(p);
		return toVo(p);
	}

	@Override
	public String deletePlayerById(int id) {
		Optional<Player> op = repo.findById(id);
		if (op.isEmpty()) {
			throw new PlayerNotFoundException("Player not exist or wrong id");
		}
		repo.delete(op.get());
		return "Player deleted having id: " + id;
	}

	@Override
	public String deleteAllPlayers() {
		repo.deleteAll();
		return "All Players are deleted";
	}

	@Override
	public PlayerVo signup(PlayerVo player) {
		if (player.getEmail() == null || player.getEmail().isBlank()) {
			throw new InvalidCredentialsException("Email is required");
		}
		PasswordPolicy.validate(player.getPassword());
		if (repo.existsByEmailIgnoreCase(player.getEmail().trim())) {
			throw new DuplicatePlayerException("An account already exists for this email");
		}
		Player plyr = toEntity(player, new Player());
		plyr.setEmail(player.getEmail().trim());
		plyr.setPasswordHash(passwordEncoder.encode(player.getPassword()));
		plyr.setCreatedBy(player.getEmail());
		plyr.setUpdatedBy(player.getEmail());
		repo.save(plyr);
		PlayerVo vo = toVo(plyr);
		vo.setToken(jwtService.generateToken(plyr.getPlayerId(), plyr.getEmail(), JwtService.ROLE_PLAYER));
		return vo;
	}

	@Override
	public PlayerVo login(String email, String password) {
		if (email == null || password == null) {
			throw new InvalidCredentialsException("Email and password are required");
		}
		Player player = repo.findByEmailIgnoreCase(email.trim())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
		if (player.getPasswordHash() == null || !passwordEncoder.matches(password, player.getPasswordHash())) {
			throw new InvalidCredentialsException("Invalid email or password");
		}
		PlayerVo vo = toVo(player);
		vo.setToken(jwtService.generateToken(player.getPlayerId(), player.getEmail(), JwtService.ROLE_PLAYER));
		return vo;
	}

	private void hashPasswordIfPresent(PlayerVo source, Player target) {
		if (source.getPassword() != null && !source.getPassword().isBlank()) {
			PasswordPolicy.validate(source.getPassword());
			target.setPasswordHash(passwordEncoder.encode(source.getPassword()));
		}
		if (source.getEmail() != null && !source.getEmail().isBlank()) {
			target.setEmail(source.getEmail().trim());
		}
	}

	private Player toEntity(PlayerVo vo, Player plyr) {
		if (vo.getPlayerName() != null) {
			plyr.setPlayerName(vo.getPlayerName());
		}
		if (vo.getPlayerRole() != null) {
			plyr.setPlayerRole(vo.getPlayerRole());
		}
		if (vo.getJerseyNo() != null) {
			plyr.setJerseyNo(vo.getJerseyNo());
		}
		if (vo.getAge() != null) {
			plyr.setAge(vo.getAge());
		}
		if (vo.getTeam() != null && vo.getTeam().getTeamId() != null) {
			Team t = tmRepo.findById(vo.getTeam().getTeamId())
					.orElseThrow(() -> new TeamNotFoundException("Invalid team id"));
			plyr.setTeam(t);
		} else if (vo.getTeam() == null) {
			// leave existing team unchanged on update; new players stay unassigned
		}
		return plyr;
	}

	private PlayerVo toVo(Player p) {
		PlayerVo vo = new PlayerVo();
		vo.setPlayerId(p.getPlayerId());
		vo.setPlayerName(p.getPlayerName());
		vo.setPlayerRole(p.getPlayerRole());
		vo.setJerseyNo(p.getJerseyNo());
		vo.setAge(p.getAge());
		vo.setEmail(p.getEmail());
		vo.setRole("PLAYER");
		if (p.getTeam() != null) {
			TeamVo tvo = new TeamVo();
			tvo.setTeamId(p.getTeam().getTeamId());
			tvo.setTeamName(p.getTeam().getTeamName());
			tvo.setTeamOwner(p.getTeam().getTeamOwner());
			tvo.setTeamCaptain(p.getTeam().getTeamCaptain());
			vo.setTeam(tvo);
		}
		return vo;
	}
}
