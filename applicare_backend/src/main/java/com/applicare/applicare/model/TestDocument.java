package com.applicare.applicare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class TestDocument {
    @Id
    private String id;
    private String message;

    public TestDocument(String message) {
        this.message = message;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 