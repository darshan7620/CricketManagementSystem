package com.nt.service;

import java.util.List;

import com.nt.entity.Player;
import com.nt.vo.PlayerVo;

public interface IPlayerService {
	public Player registerPlayer(PlayerVo player); // done
	public List<Player> registerPlayer(List<PlayerVo> Players); // done
	public Player findPlayerById(int id); // done
	public List<Player> getAllPlayers(); // done
	public Player updatePlayerDetails(PlayerVo Player); // done
	public String deletePlayerById(int id); // done
	public String deleteAllPlayers(); // done

}
