package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.entity.Workspace;
import com.cod8flow.cod8flow.domain.entity.WorkspaceMember;
import com.cod8flow.cod8flow.domain.enums.WorkspaceRole;
import com.cod8flow.cod8flow.dto.request.CreateWorkspaceRequest;
import com.cod8flow.cod8flow.dto.response.WorkspaceResponse;
import com.cod8flow.cod8flow.repository.UserRepository;
import com.cod8flow.cod8flow.repository.WorkspaceMemberRepository;
import com.cod8flow.cod8flow.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

//redis
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;


@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkspaceResponse create(CreateWorkspaceRequest request) {

        // 1. Get currently logged in user
        User currentUser = getCurrentUser();

        // 2. Create workspace
        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        workspaceRepository.save(workspace);

        // 3. Add creator as OWNER member
        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(workspace)
                .user(currentUser)
                .role(WorkspaceRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();

        workspaceMemberRepository.save(member);

        return mapToResponse(workspace);
    }

    public List<WorkspaceResponse> getMyWorkspaces() {
        User currentUser = getCurrentUser();
        return workspaceRepository
                .findWorkspacesByMemberId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Cacheable(value="workspaces",key = "#id")
    public WorkspaceResponse getById(UUID id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        return mapToResponse(workspace);
    }

    @Transactional
    @CacheEvict(value = "workspaces",key = "#id")
    public void delete(UUID id) {
        User currentUser = getCurrentUser();
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        if (!workspace.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the owner can delete a workspace");
        }

        workspaceRepository.delete(workspace);
    }

    // ── Helpers ──────────────────────────────────────────────

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WorkspaceResponse mapToResponse(Workspace workspace) {
        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .ownerEmail(workspace.getOwner().getEmail())
                .memberCount(workspace.getMembers().size())
                .boardCount(workspace.getBoards().size())
                .createdAt(workspace.getCreatedAt())
                .build();
    }
}