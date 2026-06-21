import { create } from 'zustand';
import type { BoardResponse, BoardRequest } from '../types';
import {
  getBoardsByWorkspace,
  getBoard,
  createBoard as apiCreate,
  deleteBoard as apiDelete,
} from '../api/board.api';

interface BoardStore {
  boardsByWorkspace: Record<string, BoardResponse[]>;
  selectedBoard: BoardResponse | null;
  loading: boolean;
  error: string | null;
  fetchBoards: (workspaceId: string) => Promise<void>;
  selectBoard: (boardId: string) => Promise<void>;
  addBoard: (workspaceId: string, data: BoardRequest) => Promise<BoardResponse>;
  removeBoard: (workspaceId: string, boardId: string) => Promise<void>;
  getBoardsForWorkspace: (workspaceId: string) => BoardResponse[];
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boardsByWorkspace: {},
  selectedBoard: null,
  loading: false,
  error: null,

  fetchBoards: async (workspaceId) => {
    set({ loading: true, error: null });
    try {
      const res = await getBoardsByWorkspace(workspaceId);
      set(s => ({
        boardsByWorkspace: { ...s.boardsByWorkspace, [workspaceId]: res.data },
        loading: false,
      }));
    } catch (e: unknown) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  selectBoard: async (boardId) => {
    const all = Object.values(get().boardsByWorkspace).flat();
    const found = all.find(b => b.id === boardId);
    if (found) { set({ selectedBoard: found }); return; }
    try {
      const res = await getBoard(boardId);
      set({ selectedBoard: res.data });
    } catch (e: unknown) {
      set({ error: (e as Error).message });
    }
  },

  addBoard: async (workspaceId, data) => {
    const res = await apiCreate(workspaceId, data);
    set(s => ({
      boardsByWorkspace: {
        ...s.boardsByWorkspace,
        [workspaceId]: [...(s.boardsByWorkspace[workspaceId] ?? []), res.data],
      },
    }));
    return res.data;
  },

  removeBoard: async (workspaceId, boardId) => {
    await apiDelete(boardId);
    set(s => ({
      boardsByWorkspace: {
        ...s.boardsByWorkspace,
        [workspaceId]: (s.boardsByWorkspace[workspaceId] ?? []).filter(b => b.id !== boardId),
      },
      selectedBoard: s.selectedBoard?.id === boardId ? null : s.selectedBoard,
    }));
  },

  getBoardsForWorkspace: (workspaceId) => get().boardsByWorkspace[workspaceId] ?? [],
}));
