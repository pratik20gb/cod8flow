package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.entity.Workspace;
import com.cod8flow.cod8flow.domain.enums.Role;
import com.cod8flow.cod8flow.dto.request.CreateWorkspaceRequest;
import com.cod8flow.cod8flow.dto.response.WorkspaceResponse;
import com.cod8flow.cod8flow.repository.UserRepository;
import com.cod8flow.cod8flow.repository.WorkspaceMemberRepository;
import com.cod8flow.cod8flow.repository.WorkspaceRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkspaceServiceTest {

    @Mock private WorkspaceRepository workspaceRepository;
    @Mock private WorkspaceMemberRepository workspaceMemberRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private WorkspaceService workspaceService;

    private static final String EMAIL = "alice@example.com";

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // Sets up SecurityContextHolder so getCurrentUser() resolves to the given email.
    private void mockAuthentication(String email) {
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(email);
        SecurityContextHolder.setContext(ctx);
    }

    private User buildUser(UUID id) {
        return User.builder()
                .id(id)
                .firstName("Alice")
                .lastName("Smith")
                .email(EMAIL)
                .password("encoded")
                .role(Role.MEMBER)
                .isActive(true)
                .build();
    }

    private Workspace buildWorkspace(UUID id, User owner) {
        // Use builder so @Builder.Default initialises boards and members lists.
        return Workspace.builder()
                .id(id)
                .name("My Workspace")
                .description("desc")
                .owner(owner)
                .build();
    }

    // ─── create ──────────────────────────────────────────────────────────────

    @Test
    void create_success_returnsWorkspaceResponse() {
        UUID userId = UUID.randomUUID();
        User user = buildUser(userId);
        mockAuthentication(EMAIL);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        CreateWorkspaceRequest request = CreateWorkspaceRequest.builder()
                .name("My Workspace")
                .description("desc")
                .build();

        WorkspaceResponse response = workspaceService.create(request);

        assertThat(response.getName()).isEqualTo("My Workspace");
        assertThat(response.getDescription()).isEqualTo("desc");
        assertThat(response.getOwnerEmail()).isEqualTo(EMAIL);
        verify(workspaceRepository).save(any(Workspace.class));
        verify(workspaceMemberRepository).save(any());
    }

    // ─── getMyWorkspaces ─────────────────────────────────────────────────────

    @Test
    void getMyWorkspaces_returnsListForCurrentUser() {
        UUID userId = UUID.randomUUID();
        User user = buildUser(userId);
        Workspace ws = buildWorkspace(UUID.randomUUID(), user);
        mockAuthentication(EMAIL);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(workspaceRepository.findWorkspacesByMemberId(userId)).thenReturn(List.of(ws));

        List<WorkspaceResponse> result = workspaceService.getMyWorkspaces();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("My Workspace");
    }

    @Test
    void getMyWorkspaces_noWorkspaces_returnsEmptyList() {
        UUID userId = UUID.randomUUID();
        User user = buildUser(userId);
        mockAuthentication(EMAIL);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(workspaceRepository.findWorkspacesByMemberId(userId)).thenReturn(List.of());

        List<WorkspaceResponse> result = workspaceService.getMyWorkspaces();

        assertThat(result).isEmpty();
    }

    // ─── getById ─────────────────────────────────────────────────────────────

    @Test
    void getById_existingWorkspace_returnsWorkspaceResponse() {
        UUID userId = UUID.randomUUID();
        UUID wsId = UUID.randomUUID();
        User user = buildUser(userId);
        Workspace ws = buildWorkspace(wsId, user);

        when(workspaceRepository.findById(wsId)).thenReturn(Optional.of(ws));

        WorkspaceResponse response = workspaceService.getById(wsId);

        assertThat(response.getId()).isEqualTo(wsId);
        assertThat(response.getName()).isEqualTo("My Workspace");
    }

    @Test
    void getById_notFound_throwsRuntimeException() {
        UUID wsId = UUID.randomUUID();

        when(workspaceRepository.findById(wsId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workspaceService.getById(wsId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Workspace not found");
    }

    // ─── delete ──────────────────────────────────────────────────────────────

    @Test
    void delete_ownerDeletes_workspaceIsRemoved() {
        UUID userId = UUID.randomUUID();
        UUID wsId = UUID.randomUUID();
        User user = buildUser(userId);
        Workspace ws = buildWorkspace(wsId, user);
        mockAuthentication(EMAIL);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(workspaceRepository.findById(wsId)).thenReturn(Optional.of(ws));

        workspaceService.delete(wsId);

        verify(workspaceRepository).delete(ws);
    }

    @Test
    void delete_nonOwner_throwsRuntimeException() {
        UUID ownerId = UUID.randomUUID();
        UUID callerId = UUID.randomUUID();
        UUID wsId = UUID.randomUUID();

        User owner = buildUser(ownerId);
        User caller = User.builder()
                .id(callerId)
                .email("bob@example.com")
                .role(Role.MEMBER)
                .build();
        Workspace ws = buildWorkspace(wsId, owner);
        mockAuthentication("bob@example.com");

        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(caller));
        when(workspaceRepository.findById(wsId)).thenReturn(Optional.of(ws));

        assertThatThrownBy(() -> workspaceService.delete(wsId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Only the owner can delete a workspace");

        verify(workspaceRepository, never()).delete(any());
    }

    @Test
    void delete_workspaceNotFound_throwsRuntimeException() {
        UUID userId = UUID.randomUUID();
        UUID wsId = UUID.randomUUID();
        User user = buildUser(userId);
        mockAuthentication(EMAIL);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(workspaceRepository.findById(wsId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workspaceService.delete(wsId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Workspace not found");
    }
}
