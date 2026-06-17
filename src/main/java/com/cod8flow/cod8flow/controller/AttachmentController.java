package com.cod8flow.cod8flow.controller;

import com.cod8flow.cod8flow.dto.request.PresignedUrlRequest;
import com.cod8flow.cod8flow.dto.response.AttachmentResponse;
import com.cod8flow.cod8flow.dto.response.PresignedUrlResponse;
import com.cod8flow.cod8flow.service.AttachmentService;
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
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/tasks/{taskId}/attachments/presigned-url")
    public ResponseEntity<PresignedUrlResponse> requestUpload(
            @PathVariable UUID taskId,
            @Valid @RequestBody PresignedUrlRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attachmentService.requestUpload(taskId, request));
    }

    @GetMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(
            @PathVariable UUID taskId) {
        return ResponseEntity.ok(attachmentService.getAttachmentsByTask(taskId));
    }

    @DeleteMapping("/attachments/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        attachmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}