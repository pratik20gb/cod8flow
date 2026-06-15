package com.cod8flow.cod8flow.controller;

import com.cod8flow.cod8flow.dto.request.CreateBoardRequest;
import com.cod8flow.cod8flow.dto.response.BoardResponse;
import com.cod8flow.cod8flow.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/workspaces/{workspaceId}/boards")
    public ResponseEntity<BoardResponse> create(
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateBoardRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(boardService.create(workspaceId, request));
    }

    @GetMapping("/workspaces/{workspaceId}/boards")
    public ResponseEntity<List<BoardResponse>> getBoardsByWorkspace(
            @PathVariable UUID workspaceId) {
        return ResponseEntity.ok(boardService.getBoardsByWorkspace(workspaceId));
    }

    @GetMapping("/boards/{id}")
    public ResponseEntity<BoardResponse> getById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(boardService.getById(id));
    }

    @DeleteMapping("/boards/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}