package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.Board;
import com.cod8flow.cod8flow.domain.entity.Task;
import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.entity.Workspace;
import com.cod8flow.cod8flow.domain.enums.Priority;
import com.cod8flow.cod8flow.domain.enums.Role;
import com.cod8flow.cod8flow.domain.enums.TaskStatus;
import com.cod8flow.cod8flow.dto.request.CreateTaskRequest;
import com.cod8flow.cod8flow.dto.request.UpdateTaskStatusRequest;
import com.cod8flow.cod8flow.dto.response.TaskResponse;
import com.cod8flow.cod8flow.event.TaskAssignedEvent;
import com.cod8flow.cod8flow.repository.BoardRepository;
import com.cod8flow.cod8flow.repository.TaskRepository;
import com.cod8flow.cod8flow.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
class TaskServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private BoardRepository boardRepository;
    @Mock private UserRepository userRepository;
    @Mock private TaskEventProducer taskEventProducer;

    @InjectMocks private TaskService taskService;

    private User buildUser(String email) {
        return User.builder()
                .id(UUID.randomUUID())
                .email(email)
                .role(Role.MEMBER)
                .build();
    }

    private Workspace buildWorkspace(UUID id) {
        return Workspace.builder()
                .id(id)
                .name("WS")
                .owner(buildUser("owner@example.com"))
                .build();
    }

    private Board buildBoard(UUID boardId) {
        return Board.builder()
                .id(boardId)
                .name("Board")
                .workspace(buildWorkspace(UUID.randomUUID()))
                .build();
    }

    private Task buildTask(UUID taskId, Board board, User assignee) {
        return Task.builder()
                .id(taskId)
                .title("Fix bug")
                .description("desc")
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .board(board)
                .assignee(assignee)
                .build();
    }

    // ─── create ──────────────────────────────────────────────────────────────

    @Test
    void create_withAssignee_publishesKafkaEventAndReturnsResponse() {
        UUID boardId = UUID.randomUUID();
        UUID assigneeId = UUID.randomUUID();
        Board board = buildBoard(boardId);
        User assignee = buildUser("assignee@example.com");

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee));

        CreateTaskRequest request = CreateTaskRequest.builder()
                .title("Fix bug")
                .description("desc")
                .priority(Priority.HIGH)
                .assigneeId(assigneeId)
                .build();

        TaskResponse response = taskService.create(boardId, request);

        assertThat(response.getTitle()).isEqualTo("Fix bug");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
        assertThat(response.getPriority()).isEqualTo(Priority.HIGH);
        assertThat(response.getAssigneeEmail()).isEqualTo("assignee@example.com");
        verify(taskRepository).save(any(Task.class));

        ArgumentCaptor<TaskAssignedEvent> eventCaptor = ArgumentCaptor.forClass(TaskAssignedEvent.class);
        verify(taskEventProducer).publishTaskAssigned(eventCaptor.capture());
        assertThat(eventCaptor.getValue().getAssigneeEmail()).isEqualTo("assignee@example.com");
    }

    @Test
    void create_withoutAssignee_doesNotPublishKafkaEvent() {
        UUID boardId = UUID.randomUUID();
        Board board = buildBoard(boardId);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        CreateTaskRequest request = CreateTaskRequest.builder()
                .title("Fix bug")
                .build();

        TaskResponse response = taskService.create(boardId, request);

        assertThat(response.getTitle()).isEqualTo("Fix bug");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
        assertThat(response.getPriority()).isEqualTo(Priority.MEDIUM);
        assertThat(response.getAssigneeEmail()).isNull();
        verify(taskRepository).save(any(Task.class));
        verify(taskEventProducer, never()).publishTaskAssigned(any());
    }

    @Test
    void create_withNullPriority_defaultsToMedium() {
        UUID boardId = UUID.randomUUID();
        Board board = buildBoard(boardId);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));

        CreateTaskRequest request = CreateTaskRequest.builder()
                .title("Task")
                .priority(null)
                .build();

        TaskResponse response = taskService.create(boardId, request);

        assertThat(response.getPriority()).isEqualTo(Priority.MEDIUM);
    }

    @Test
    void create_boardNotFound_throwsRuntimeException() {
        UUID boardId = UUID.randomUUID();

        when(boardRepository.findById(boardId)).thenReturn(Optional.empty());

        CreateTaskRequest request = CreateTaskRequest.builder()
                .title("Fix bug")
                .build();

        assertThatThrownBy(() -> taskService.create(boardId, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Board not found");

        verify(taskRepository, never()).save(any());
        verify(taskEventProducer, never()).publishTaskAssigned(any());
    }

    @Test
    void create_assigneeNotFound_throwsRuntimeException() {
        UUID boardId = UUID.randomUUID();
        UUID assigneeId = UUID.randomUUID();
        Board board = buildBoard(boardId);

        when(boardRepository.findById(boardId)).thenReturn(Optional.of(board));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.empty());

        CreateTaskRequest request = CreateTaskRequest.builder()
                .title("Fix bug")
                .assigneeId(assigneeId)
                .build();

        assertThatThrownBy(() -> taskService.create(boardId, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Assignee not found");

        verify(taskRepository, never()).save(any());
    }

    // ─── getTasksByBoard ─────────────────────────────────────────────────────

    @Test
    void getTasksByBoard_returnsListOfTasks() {
        UUID boardId = UUID.randomUUID();
        Board board = buildBoard(boardId);
        Task task = buildTask(UUID.randomUUID(), board, null);

        when(taskRepository.findByBoardId(boardId)).thenReturn(List.of(task));

        List<TaskResponse> result = taskService.getTasksByBoard(boardId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Fix bug");
    }

    @Test
    void getTasksByBoard_noTasks_returnsEmptyList() {
        UUID boardId = UUID.randomUUID();

        when(taskRepository.findByBoardId(boardId)).thenReturn(List.of());

        List<TaskResponse> result = taskService.getTasksByBoard(boardId);

        assertThat(result).isEmpty();
    }

    // ─── getById ─────────────────────────────────────────────────────────────

    @Test
    void getById_existingTask_returnsTaskResponse() {
        UUID taskId = UUID.randomUUID();
        Board board = buildBoard(UUID.randomUUID());
        Task task = buildTask(taskId, board, null);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        TaskResponse response = taskService.getById(taskId);

        assertThat(response.getId()).isEqualTo(taskId);
        assertThat(response.getTitle()).isEqualTo("Fix bug");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
    }

    @Test
    void getById_notFound_throwsRuntimeException() {
        UUID taskId = UUID.randomUUID();

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getById(taskId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Task not found");
    }

    // ─── updateStatus ────────────────────────────────────────────────────────

    @Test
    void updateStatus_success_returnsUpdatedTaskResponse() {
        UUID taskId = UUID.randomUUID();
        Board board = buildBoard(UUID.randomUUID());
        Task task = buildTask(taskId, board, null);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        UpdateTaskStatusRequest request = UpdateTaskStatusRequest.builder()
                .status(TaskStatus.IN_PROGRESS)
                .build();

        TaskResponse response = taskService.updateStatus(taskId, request);

        assertThat(response.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        verify(taskRepository).save(task);
    }

    @Test
    void updateStatus_taskNotFound_throwsRuntimeException() {
        UUID taskId = UUID.randomUUID();

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        UpdateTaskStatusRequest request = UpdateTaskStatusRequest.builder()
                .status(TaskStatus.DONE)
                .build();

        assertThatThrownBy(() -> taskService.updateStatus(taskId, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Task not found");

        verify(taskRepository, never()).save(any());
    }

    // ─── delete ──────────────────────────────────────────────────────────────

    @Test
    void delete_existingTask_taskIsRemoved() {
        UUID taskId = UUID.randomUUID();
        Board board = buildBoard(UUID.randomUUID());
        Task task = buildTask(taskId, board, null);

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        taskService.delete(taskId);

        verify(taskRepository).delete(task);
    }

    @Test
    void delete_taskNotFound_throwsRuntimeException() {
        UUID taskId = UUID.randomUUID();

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.delete(taskId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Task not found");

        verify(taskRepository, never()).delete(any());
    }
}
