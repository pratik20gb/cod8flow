package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.Board;
import com.cod8flow.cod8flow.domain.entity.Task;
import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.enums.Priority;
import com.cod8flow.cod8flow.domain.enums.TaskStatus;
import com.cod8flow.cod8flow.dto.request.CreateTaskRequest;
import com.cod8flow.cod8flow.dto.request.UpdateTaskStatusRequest;
import com.cod8flow.cod8flow.dto.response.TaskResponse;
import com.cod8flow.cod8flow.event.TaskAssignedEvent;
import com.cod8flow.cod8flow.repository.BoardRepository;
import com.cod8flow.cod8flow.repository.TaskRepository;
import com.cod8flow.cod8flow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final TaskEventProducer taskEventProducer;

    @Transactional
    public TaskResponse create(UUID boardId, CreateTaskRequest request) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .priority(request.getPriority() != null
                        ? request.getPriority()
                        : Priority.MEDIUM)
                .board(board)
                .assignee(assignee)
                .dueDate(request.getDueDate())
                .build();

        taskRepository.save(task);

        //publish event if task has an assignee
        if(assignee != null) {
            TaskAssignedEvent event = TaskAssignedEvent.builder()
                    .taskId(task.getId())
                    .taskTitle((task.getTitle()))
                    .assigneeId(assignee.getId())
                    .assigneeEmail(assignee.getEmail())
                    .boardId(board.getId())
                    .priority(task.getPriority().name())
                    .build();
            taskEventProducer.publishTaskAssigned(event);
        }
        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByBoard(UUID boardId) {
        return taskRepository.findByBoardId(boardId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Cacheable(value = "boards", key = "#id")
    public TaskResponse getById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return mapToResponse(task);
    }

    @Transactional
    @CacheEvict(value = "tasks", key = "#id")
    public TaskResponse updateStatus(UUID id, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(request.getStatus());
        taskRepository.save(task);
        return mapToResponse(task);
    }

    @Transactional
    @CacheEvict(value = "boards", key = "#id")
    public void delete(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .boardId(task.getBoard().getId())
                .assigneeEmail(task.getAssignee() != null
                        ? task.getAssignee().getEmail()
                        : null)
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .build();
    }
}