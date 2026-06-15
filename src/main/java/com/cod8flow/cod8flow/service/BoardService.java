package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.Board;
import com.cod8flow.cod8flow.domain.entity.Workspace;
import com.cod8flow.cod8flow.dto.request.CreateBoardRequest;
import com.cod8flow.cod8flow.dto.response.BoardResponse;
import com.cod8flow.cod8flow.repository.BoardRepository;
import com.cod8flow.cod8flow.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public BoardResponse create(UUID workspaceId, CreateBoardRequest request) {

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        Board board = Board.builder()
                .name(request.getName())
                .description(request.getDescription())
                .workspace(workspace)
                .build();

        boardRepository.save(board);
        return mapToResponse(board);
    }

    public List<BoardResponse> getBoardsByWorkspace(UUID workspaceId) {
        return boardRepository.findByWorkspaceId(workspaceId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BoardResponse getById(UUID id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        return mapToResponse(board);
    }

    @Transactional
    public void delete(UUID id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        boardRepository.delete(board);
    }

    private BoardResponse mapToResponse(Board board) {
        return BoardResponse.builder()
                .id(board.getId())
                .name(board.getName())
                .description(board.getDescription())
                .workspaceId(board.getWorkspace().getId())
                .taskCount(board.getTasks().size())
                .createdAt(board.getCreatedAt())
                .build();
    }
}