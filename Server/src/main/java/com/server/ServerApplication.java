package com.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication
public class ServerApplication {
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(ServerApplication.class);
		app.setDefaultProperties(Collections.singletonMap("server.port", "3001"));
		app.run(args);
	}
}

