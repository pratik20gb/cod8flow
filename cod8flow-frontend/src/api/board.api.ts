import api from './client';
import type { BoardResponse, BoardRequest } from '../types';

export const getBoardsByWorkspace = (workspaceId: string) =>
  api.get<BoardResponse[]>(`/workspaces/${workspaceId}/boards`);

export const getBoard = (boardId: string) =>
  api.get<BoardResponse>(`/boards/${boardId}`);

export const createBoard = (workspaceId: string, data: BoardRequest) =>
  api.post<BoardResponse>(`/workspaces/${workspaceId}/boards`, data);

export const deleteBoard = (id: string) =>
  api.delete(`/boards/${id}`);
