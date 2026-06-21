import { create } from 'zustand';
import type { TaskResponse, TaskRequest, TaskStatus } from '../types';
import {
  getTasksByBoard,
  createTask as apiCreate,
  updateTaskStatus,
  deleteTask as apiDelete,
} from '../api/task.api';

interface TaskStore {
  tasks: TaskResponse[];
  loading: boolean;
  error: string | null;
  currentBoardId: string | null;
  fetchTasks: (boardId: string) => Promise<void>;
  addTask: (boardId: string, data: TaskRequest) => Promise<TaskResponse>;
  moveTask: (taskId: string, status: TaskStatus) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  currentBoardId: null,

  fetchTasks: async (boardId) => {
    set({ loading: true, error: null, currentBoardId: boardId });
    try {
      const res = await getTasksByBoard(boardId);
      set({ tasks: res.data, loading: false });
    } catch (e: unknown) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  addTask: async (boardId, data) => {
    const res = await apiCreate(boardId, data);
    set(s => ({ tasks: [...s.tasks, res.data] }));
    return res.data;
  },

  moveTask: async (taskId, status) => {
    const prev = get().tasks.find(t => t.id === taskId);
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t) }));
    try {
      const res = await updateTaskStatus(taskId, status);
      set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? res.data : t) }));
    } catch (e: unknown) {
      if (prev) set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? prev : t), error: (e as Error).message }));
    }
  },

  removeTask: async (taskId) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) }));
    try {
      await apiDelete(taskId);
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    }
  },
}));
