import { create } from 'zustand';
import type { WorkspaceResponse, WorkspaceRequest } from '../types';
import {
  getMyWorkspaces,
  getWorkspace,
  createWorkspace as apiCreate,
  deleteWorkspace as apiDelete,
} from '../api/workspace.api';

interface WorkspaceStore {
  workspaces: WorkspaceResponse[];
  loading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  fetchOne: (id: string) => Promise<WorkspaceResponse>;
  addWorkspace: (data: WorkspaceRequest) => Promise<WorkspaceResponse>;
  removeWorkspace: (id: string) => Promise<void>;
  getById: (id: string) => WorkspaceResponse | undefined;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  loading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getMyWorkspaces();
      set({ workspaces: res.data, loading: false });
    } catch (e: unknown) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchOne: async (id) => {
    const existing = get().workspaces.find(w => w.id === id);
    if (existing) return existing;
    const res = await getWorkspace(id);
    set(s => ({ workspaces: s.workspaces.find(w => w.id === id) ? s.workspaces : [...s.workspaces, res.data] }));
    return res.data;
  },

  addWorkspace: async (data) => {
    const res = await apiCreate(data);
    set(s => ({ workspaces: [...s.workspaces, res.data] }));
    return res.data;
  },

  removeWorkspace: async (id) => {
    await apiDelete(id);
    set(s => ({ workspaces: s.workspaces.filter(w => w.id !== id) }));
  },

  getById: (id) => get().workspaces.find(w => w.id === id),
}));
