package com.cod8flow.cod8flow.controller;

import com.cod8flow.cod8flow.dto.request.CreateTaskRequest;
import com.cod8flow.cod8flow.dto.request.UpdateTaskStatusRequest;
import com.cod8flow.cod8flow.dto.response.TaskResponse;
import com.cod8flow.cod8flow.service.TaskService;
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
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/boards/{boardId}/tasks")
    public ResponseEntity<TaskResponse> create(
            @PathVariable UUID boardId,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(taskService.create(boardId, request));
    }

    @GetMapping("/boards/{boardId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasksByBoard(
            @PathVariable UUID boardId) {
        return ResponseEntity.ok(taskService.getTasksByBoard(boardId));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        return ResponseEntity.ok(taskService.updateStatus(id, request));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}