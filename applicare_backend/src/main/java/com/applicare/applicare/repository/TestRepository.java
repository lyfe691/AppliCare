package com.applicare.applicare.repository;

import com.applicare.applicare.model.TestDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestRepository extends MongoRepository<TestDocument, String> {
} 