package com.nt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class IplPlayerApplication {

	public static void main(String[] args) {
		log.debug("IPL Backend started");
		SpringApplication.run(IplPlayerApplication.class, args);
		log.debug("IPL Backend stopped");
	}

}
