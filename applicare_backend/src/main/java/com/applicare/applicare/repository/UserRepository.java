package com.applicare.applicare.repository;

import com.applicare.applicare.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * repo interface for user entity
 */
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * finds a user by their username.
     *
     * @param username username to search for
     */
    Optional<User> findByUsername(String username);

    /**
     * finds a user by their email.
     *
     * @param email the email to search for
     */
    Optional<User> findByEmail(String email);
}
