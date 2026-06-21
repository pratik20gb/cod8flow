import { create } from 'zustand';
import type { TaskStatus } from '../types';

type ModalType = 'workspace' | 'board' | 'task';

interface UIStore {
  modal: {
    type: ModalType;
    workspaceId?: string;
    boardId?: string;
    defaultStatus?: TaskStatus;
  } | null;
  openModal: (type: ModalType, workspaceId?: string, boardId?: string, defaultStatus?: TaskStatus) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  modal: null,
  openModal: (type, workspaceId, boardId, defaultStatus) =>
    set({ modal: { type, workspaceId, boardId, defaultStatus } }),
  closeModal: () => set({ modal: null }),
}));
