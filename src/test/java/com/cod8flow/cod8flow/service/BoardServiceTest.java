package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.Board;
import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.entity.Workspace;
import com.cod8flow.cod8flow.domain.enums.Role;
import com.cod8flow.cod8flow.dto.request.CreateBoardRequest;
import com.cod8flow.cod8flow.dto.response.BoardResponse;
import com.cod8flow.cod8flow.repository.BoardRepository;
import com.cod8flow.cod8flow.repository.WorkspaceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoardServiceTest {

    @Mock private BoardRepository boardRepository;
    @Mock private WorkspaceRepository workspaceRepository;

    @InjectMocks private BoardService boardService;

    private User buildOwner() {
        return User.builder()
                .id(UUID.randomUUID())
                .email("alice@example.com")
                .role(Role.MEMBER)
                .build();
    }

    private Workspace buildWorkspace(UUID id) {
        // Builder initialises members and boards lists via @Builder.Default.
        return Workspace.builder()
                .id(id)
                .name("Test Workspace")
                .description("desc")
                .owner(buildOwner())
                .build();
    }

    private Board buildBoard(UUID id, Workspace workspace) {
        // Builder initialises tasks list via @Builder.Default.
        return Board.builder()
                .id(id)
                .name("Test Board")
                .description("board desc")
                .workspace(workspace)
                .build();
    }

    // ─── create ──────────────────────────────────────────────────────────────

    @Test
    void create_success_returnsBoardResponse() {
        UUID wsId = UUID.randomUUID();
        Workspace workspace = buildWorkspace(wsId);

        when(workspaceRepository.findById(wsId)).thenReturn(Optional.of(workspace));

        CreateBoardRequest request = CreateBoardRequest.builder()
                .name("Test Board")
                .description("board desc")
                .build();

        BoardResponse response = boardService.create(wsId, request);

        assertThat(response.getName()).isEqualTo("Test Board");
        assertThat(response.getDescription()).isEqualTo("board desc");
        assertThat(response.getWorkspaceId()).isEqualTo(wsId);
        verify(boardRepository).save(any(Board.class));
    }

    @Test
    void create_workspaceNotFound_throwsRuntimeException() {
        UUID wsId = UUID.randomUUID();

        when(workspaceRepository.findById(wsId)).thenReturn(Optional.empty());

        CreateBoardRequest request = CreateBoardRequest.builder()
                .name("Test Board")
                .build();

        assertThatThrownBy(() -> boardService.create(wsId, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Workspace not found");

        verify(boardRepository, never()).save(any());
    }

    // ─── getBoardsByWorkspace ─────────────────────────────────────────────────

    @Test
    void getBoardsByWorkspace_returnsListOfBoards() {
        UUID wsId = UUID.randomUUID();
        Workspace workspace = buildWorkspace(wsId);
        Board board = buildBoard(UUID.randomUUID(), workspace);

        when(boardRepository.findByWorkspaceId(wsId)).thenReturn(List.of(board));

        List<BoardResponse> result = boardService.getBoardsByWorkspace(wsId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Board");
        assertThat(result.get(0).getWorkspaceId()).isEqualTo(wsId);
    }

    @Test
    void getBoardsByWorkspace_noBoards_returnsEmptyList() {
        UUID wsId = UUID.randomUUID();

        when(boardRepository.findByWorkspaceId(wsId)).thenReturn(List.of());

        List<BoardResponse> result = boardService.getBoardsByWorkspace(wsId);

        assertThat(result).isEmpty();
    }

    // ─── getById ─────────────────────────────────────────────────────────────

    @Test
    void getById_existingBoard_returnsBoardResponse() {
        UUID boardId = UUID.randomUUID();
        UUID wsId = UUID.randomUUID();
        Workspace workspace = buildWorkspace(wsId);
        Board board = buildBoard(boardId, workspace);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        BoardResponse response = boardService.getById(boardId);

        assertThat(response.getId()).isEqualTo(boardId);
        assertThat(response.getName()).isEqualTo("Test Board");
        assertThat(response.getWorkspaceId()).isEqualTo(wsId);
    }

    @Test
    void getById_notFound_throwsRuntimeException() {
        UUID boardId = UUID.randomUUID();

        when(boardRepository.findById(boardId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> boardService.getById(boardId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Board not found");
    }

    // ─── delete ──────────────────────────────────────────────────────────────

    @Test
    void delete_existingBoard_boardIsRemoved() {
        UUID boardId = UUID.randomUUID();
        Workspace workspace = buildWorkspace(UUID.randomUUID());
        Board board = buildBoard(boardId, workspace);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        boardService.delete(boardId);

        verify(boardRepository).delete(board);
    }

    @Test
    void delete_boardNotFound_throwsRuntimeException() {
        UUID boardId = UUID.randomUUID();

        when(boardRepository.findById(boardId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> boardService.delete(boardId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Board not found");

        verify(boardRepository, never()).delete(any());
    }
}
