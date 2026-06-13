package com.cod8flow.cod8flow.domain.entity;


import com.cod8flow.cod8flow.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id",updatable=false,nullable=false)
    private UUID id;

    @Column(name="email",nullable=false,unique = true,length=255)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;


    @Column(name="first_name",nullable = false,length=100)
    private String firstName;

    @Column(name="last_name",nullable = false,length=100)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name="role",nullable = false,length=50)
    private Role role = Role.MEMBER;  // default


    @Column(name="is_active",nullable = false)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name="created_at",updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

}
