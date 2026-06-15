package com.cod8flow.cod8flow.controller;

import com.cod8flow.cod8flow.dto.request.CreateWorkspaceRequest;
import com.cod8flow.cod8flow.dto.response.WorkspaceResponse;
import com.cod8flow.cod8flow.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<WorkspaceResponse> create(
            @Valid @RequestBody CreateWorkspaceRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(workspaceService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> getMyWorkspaces() {
        return ResponseEntity.ok(workspaceService.getMyWorkspaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponse> getById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(workspaceService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        workspaceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}