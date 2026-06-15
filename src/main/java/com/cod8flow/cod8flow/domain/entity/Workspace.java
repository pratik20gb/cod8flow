package com.cod8flow.cod8flow.domain.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="workspaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workspace {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id",updatable = false,nullable = false)
    private UUID id;

    @Column(name= "name",nullable = false,length = 100)
    private String name;

    @Column(name="description",columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="owner_id",nullable = false)
    private User owner;

    @OneToMany(mappedBy = "workspace",cascade = CascadeType.ALL,orphanRemoval = true)
    @Builder.Default
    private List<Board> boards  = new ArrayList<>();

    @OneToMany(mappedBy = "workspace",cascade = CascadeType.ALL,orphanRemoval = true)
    @Builder.Default
    private List<WorkspaceMember> members = new ArrayList<>();

    @CreationTimestamp
    @Column(name="created_at",nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;





}
