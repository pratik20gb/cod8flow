package com.cod8flow.cod8flow.repository;

import com.cod8flow.cod8flow.domain.entity.User;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
Optional<User> findByEmail(String email);
boolean existsByEmail(String email);

}
