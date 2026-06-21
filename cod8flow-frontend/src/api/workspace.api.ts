import api from './client';
import type { WorkspaceResponse, WorkspaceRequest } from '../types';

export const getMyWorkspaces = () =>
  api.get<WorkspaceResponse[]>('/workspaces');

export const getWorkspace = (id: string) =>
  api.get<WorkspaceResponse>(`/workspaces/${id}`);

export const createWorkspace = (data: WorkspaceRequest) =>
  api.post<WorkspaceResponse>('/workspaces', data);

export const deleteWorkspace = (id: string) =>
  api.delete(`/workspaces/${id}`);
