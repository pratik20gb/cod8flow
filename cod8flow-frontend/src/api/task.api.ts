import api from './client';
import type { TaskResponse, TaskRequest, TaskStatus } from '../types';

export const getTasksByBoard = (boardId: string) =>
  api.get<TaskResponse[]>(`/boards/${boardId}/tasks`);

export const getTask = (taskId: string) =>
  api.get<TaskResponse>(`/tasks/${taskId}`);

export const createTask = (boardId: string, data: TaskRequest) =>
  api.post<TaskResponse>(`/boards/${boardId}/tasks`, data);

export const updateTaskStatus = (taskId: string, status: TaskStatus) =>
  api.patch<TaskResponse>(`/tasks/${taskId}/status`, { status });

export const deleteTask = (taskId: string) =>
  api.delete(`/tasks/${taskId}`);
