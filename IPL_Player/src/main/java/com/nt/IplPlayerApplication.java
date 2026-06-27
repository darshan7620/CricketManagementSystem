package com.nt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableDiscoveryClient
@EnableCaching
@Slf4j
public class IplPlayerApplication {

	public static void main(String[] args) {
		log.debug("Player MS started");
		SpringApplication.run(IplPlayerApplication.class, args);
		log.debug("Player MS stopped");
	}

}
