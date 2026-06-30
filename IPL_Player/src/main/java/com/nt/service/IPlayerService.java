package com.nt.service;

import java.util.List;

import com.nt.entity.Player;
import com.nt.vo.PlayerVo;

public interface IPlayerService {
	public PlayerVo registerPlayer(PlayerVo player); // done
	public List<PlayerVo> registerPlayers(List<PlayerVo> Players); // done
	public PlayerVo findPlayerById(int id); // done
	public List<PlayerVo> getAllPlayers(); // done
	public PlayerVo updatePlayerDetails(PlayerVo Player); // done
	public String deletePlayerById(int id); // done
	public String deleteAllPlayers(); // done

}
