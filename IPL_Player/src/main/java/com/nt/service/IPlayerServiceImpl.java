package com.nt.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.nt.entity.Player;
import com.nt.entity.Team;
import com.nt.exception.PlayerNotFoundException;
import com.nt.exception.TeamNotFoundException;
import com.nt.feign.PlayerServiceClient;
import com.nt.repository.IPlayerRepository;
import com.nt.repository.ITeamRepository;
import com.nt.vo.PlayerVo;
import com.nt.vo.TeamVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class IPlayerServiceImpl implements IPlayerService {

	@Autowired
	private PlayerServiceClient client;

	@Autowired
	private IPlayerRepository repo;

	@Autowired
	private ITeamRepository tmRepo;

	@Autowired
	private Environment env;
	
	
	
	@Override
	@Caching(put = @CachePut(value = "player", key = "#result.playerId"), evict = @CacheEvict(value="players", allEntries = true))
	public PlayerVo registerPlayer(PlayerVo player) {
		log.debug("register player method executed");
		log.info("call made to service method from register player");
		// copy the properties to the palyer eneity
		Player plyr = new Player();
		BeanUtils.copyProperties(player, plyr);
		// now get the team from plyr
		TeamVo team = player.getTeam();
		Team t = tmRepo.findById(team.getTeamId()).orElseThrow(() -> new PlayerNotFoundException("Invalid player id"));
		// copy the properties to vo object
		plyr.setCreatedBy(env.getProperty("user.name"));
		plyr.setTeam(t);
		// save the object and copy the data to another player object
		repo.save(plyr);
		PlayerVo vo = new PlayerVo();
		BeanUtils.copyProperties(plyr, vo);
		log.info("result is returned from register player");
		log.debug("register player method executed sucessfully");
		return vo;
	}

	@Override
	@CacheEvict(value="players", allEntries=true)
	public List<PlayerVo> registerPlayers(List<PlayerVo> players) {
		log.debug("register players method executed");
		log.info("call made to service method from register players");
		// create new list of entity
		List<PlayerVo> player = new ArrayList<>();
		// save all the players
		players.forEach(pl -> {
			Player p = new Player();
			// copy the properties from playerVo to p
			BeanUtils.copyProperties(pl, p);
			TeamVo team = pl.getTeam();
			Team t = tmRepo.findById(team.getTeamId()).orElseThrow(() -> new TeamNotFoundException("Invalid team id"));
			p.setTeam(t);
			// set created by property
			p.setCreatedBy(env.getProperty("user.name"));
			// save the object
			repo.save(p);
			// now create player vo object
			PlayerVo vo = new PlayerVo();
			// copy properties from entity to vo
			BeanUtils.copyProperties(p, vo);
			// ad to list
			player.add(vo);
		});

		log.info("result is returned from register players");
		log.debug("registerPlayers method executed sucessfully");
		return player;
	}

	@Override
	@Cacheable(value="player", key="#id")
	public PlayerVo findPlayerById(int id) {
		// TODO Auto-generated method stub
		log.debug("findPlayerById method executed");
		log.info("call made to service method from findPlayerById");
		Player pl = repo.findById(id).orElseThrow(() -> new PlayerNotFoundException("Invalid player id"));
		PlayerVo vo = new PlayerVo();
		BeanUtils.copyProperties(pl, vo);
		log.info("result is returned from rfindPlayerById");
		log.debug("findPlayerById method executed sucessfully");
		return vo;
	}

	@Override
	@Cacheable(value="players")
	public List<PlayerVo> getAllPlayers() {
		// TODO Auto-generated method stub
		log.debug("getAllPlayers method executed");
		log.info("call made to service method from getAllPlayers");

		List<PlayerVo> players = new ArrayList<>();
		repo.findAll().forEach(plyr -> {
			PlayerVo vo = new PlayerVo();
			BeanUtils.copyProperties(plyr, vo);
			players.add(vo);
		});
		log.info("result is returned from getAllPlayers");
		log.debug("getAllPlayers method executed sucessfully");
		return players;
	}

	@Override
	@Caching(put=@CachePut(value="player", key="#result.playerId"),evict=@CacheEvict(value="player", key = "#result.playerId"))
	public PlayerVo updatePlayerDetails(PlayerVo player) {
		// TODO Auto-generated method stub
		log.debug("updatePlayerDetails method executed");
		log.info("call made to service method from updatePlayerDetails");
		// fetch the player entity
		Player p = repo.findById(player.getPlayerId())
				.orElseThrow(() -> new PlayerNotFoundException("Invalid player id"));
		// copy properties
		BeanUtils.copyProperties(player, p);
		p.setUpdatedBy(env.getProperty("user.name"));
		// save the object
		repo.save(p);
		// copy properties to player vo
		PlayerVo vo = new PlayerVo();
		BeanUtils.copyProperties(p, vo);
		log.info("result is returned from updatePlayerDetails");
		log.debug("updatePlayerDetails method executed sucessfully");
		return vo;
	}

	@Override
	@Caching(
		    evict = {
		        @CacheEvict(value = "player", key = "#id"),
		        @CacheEvict(value = "players", allEntries = true)
		    }
		)
	public String deletePlayerById(int id) {
		// TODO Auto-generated method stub
		log.debug("deletePlayerById method executed");
		log.info("call made to service method from deletePlayerById");
		Optional<Player> op = repo.findById(id);
		if(op.isEmpty()) {
			log.warn("Optional object is empty");
			throw new PlayerNotFoundException("Player not exist or wrong id");
		}else {
			log.info("result is returned from deletePlayerById");
			log.debug("deletePlayerById method executed sucessfully");
			Player p = op.get();
			repo.delete(p);
			return "Player deleted having id: "+id;
		}
		
	}

	@Override
	@Caching(
		    evict = {
		        @CacheEvict(value = "player", allEntries = true),
		        @CacheEvict(value = "players", allEntries = true)
		    }
		)
	public String deleteAllPlayers() {
		// TODO Auto-generated method stub
		log.debug("deleteAllPlayers method executed");
		log.info("call made to service method from deleteAllPlayers");
		repo.deleteAll();
		log.info("result is returned from deleteAllPlayers");
		log.debug("deleteAllPlayers method executed sucessfully");
		return "All Players are deleted";
	}

}
