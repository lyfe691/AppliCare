package com.applicare.applicare.controller;

import com.applicare.applicare.model.TestDocument;
import com.applicare.applicare.repository.TestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private TestRepository testRepository;

    @GetMapping("/test-mongo")
    public ResponseEntity<?> testMongo() {
        logger.info("Received request to /api/test-mongo");
        try {
            TestDocument test = new TestDocument("MongoDB is working!");
            testRepository.save(test);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Document saved with ID: " + test.getId());
            response.put("status", "ok");
            logger.info("Successfully saved document with ID:" + test.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error in testMongo: ", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        logger.info("Received ping request");
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
} 