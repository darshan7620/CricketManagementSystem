package com.nt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nt.service.IPlayerService;
import com.nt.vo.LoginRequest;
import com.nt.vo.PlayerVo;

@RestController
@RequestMapping("/player-api")
public class PlayerRestController {

	@Autowired
	private IPlayerService service;

	@PostMapping("/auth/register")
	public ResponseEntity<PlayerVo> signup(@RequestBody PlayerVo player) {
		return new ResponseEntity<PlayerVo>(service.signup(player), HttpStatus.CREATED);
	}

	@PostMapping("/auth/login")
	public ResponseEntity<PlayerVo> login(@RequestBody LoginRequest request) {
		return new ResponseEntity<PlayerVo>(service.login(request.getEmail(), request.getPassword()), HttpStatus.OK);
	}

	@PostMapping("/register")
	public ResponseEntity<PlayerVo> addPlayer(@RequestBody PlayerVo player) {
		return new ResponseEntity<PlayerVo>(service.registerPlayer(player), HttpStatus.CREATED);
	}

	@PostMapping("/registerAll")
	public ResponseEntity<List<PlayerVo>> addPlayers(@RequestBody List<PlayerVo> players) {
		return new ResponseEntity<List<PlayerVo>>(service.registerPlayers(players), HttpStatus.CREATED);
	}

	@GetMapping("/find/{id}")
	public ResponseEntity<PlayerVo> getPlayerById(@PathVariable Integer id) {
		return new ResponseEntity<PlayerVo>(service.findPlayerById(id), HttpStatus.OK);
	}

	@GetMapping("/findAll")
	public ResponseEntity<List<PlayerVo>> findAllPlayers() {
		return new ResponseEntity<List<PlayerVo>>(service.getAllPlayers(), HttpStatus.OK);
	}

	@PutMapping("/update")
	public ResponseEntity<PlayerVo> savePlayerDetails(@RequestBody PlayerVo player) {
		return new ResponseEntity<PlayerVo>(service.updatePlayerDetails(player), HttpStatus.OK);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> removePlayerById(@PathVariable int id) {
		return new ResponseEntity<String>(service.deletePlayerById(id), HttpStatus.OK);
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<String> removeAllPlayers() {
		return new ResponseEntity<String>(service.deleteAllPlayers(), HttpStatus.OK);
	}
}
