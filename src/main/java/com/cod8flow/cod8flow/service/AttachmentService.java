package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.Attachment;
import com.cod8flow.cod8flow.domain.entity.Task;
import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.dto.request.PresignedUrlRequest;
import com.cod8flow.cod8flow.dto.response.AttachmentResponse;
import com.cod8flow.cod8flow.dto.response.PresignedUrlResponse;
import com.cod8flow.cod8flow.repository.AttachmentRepository;
import com.cod8flow.cod8flow.repository.TaskRepository;
import com.cod8flow.cod8flow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    @Transactional
    public PresignedUrlResponse requestUpload(UUID taskId, PresignedUrlRequest request) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User currentUser = getCurrentUser();

        // 1. Build the unique S3 key
        String s3Key = s3Service.buildS3Key(taskId, request.getFileName());

        // 2. Save attachment metadata in DB (before upload happens)
        Attachment attachment = Attachment.builder()
                .fileName(request.getFileName())
                .s3Key(s3Key)
                .contentType(request.getContentType())
                .task(task)
                .uploadedBy(currentUser)
                .build();

        attachmentRepository.save(attachment);

        // 3. Generate the pre-signed URL for the client to upload to
        String uploadUrl = s3Service.generatePresignedUploadUrl(
                s3Key,
                request.getContentType()
        );

        return PresignedUrlResponse.builder()
                .uploadUrl(uploadUrl)
                .s3Key(s3Key)
                .attachmentId(attachment.getId())
                .build();
    }

    public List<AttachmentResponse> getAttachmentsByTask(UUID taskId) {
        return attachmentRepository.findByTaskId(taskId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void delete(UUID attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        s3Service.deleteFile(attachment.getS3Key());
        attachmentRepository.delete(attachment);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AttachmentResponse mapToResponse(Attachment attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .uploadedByEmail(attachment.getUploadedBy() != null
                        ? attachment.getUploadedBy().getEmail()
                        : null)
                .createdAt(attachment.getCreatedAt())
                .build();
    }
}