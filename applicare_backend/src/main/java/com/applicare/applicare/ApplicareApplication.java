package com.applicare.applicare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

@SpringBootApplication
@ComponentScan({"com.applicare.applicare", "com.applicare.applicare.controller"})
@EnableMongoRepositories("com.applicare.applicare.repository")
@EntityScan("com.applicare.applicare.model")
public class ApplicareApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApplicareApplication.class, args);
	}
}
