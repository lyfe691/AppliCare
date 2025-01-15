// com/applicare/applicare/repository/UserRepository.java

package com.applicare.applicare.repository;

import com.applicare.applicare.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * 
 * @author Yanis Sebastian Zürcher
 * 
 */

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPasswordResetToken(String token);
}
