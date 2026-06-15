package com.cod8flow.cod8flow.domain.entity;


import com.cod8flow.cod8flow.domain.enums.WorkspaceRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="workspace_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceMember {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="id",updatable = false,nullable = false)
    private UUID id;


    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="workspace_id",nullable = false)
    private Workspace workspace;


    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id",nullable = false)
    private User user;


    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false,length = 50)
    private WorkspaceRole role;

    @Column(name="joined_at")
    private LocalDateTime joinedAt;
}
