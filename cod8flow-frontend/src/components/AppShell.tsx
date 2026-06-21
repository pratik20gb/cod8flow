import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useWorkspaceStore } from '../store/workspace.store';
import { useBoardStore } from '../store/board.store';
import { useUIStore } from '../store/ui.store';
import CreateModal from './CreateModal';
import type { WorkspaceResponse, BoardResponse, TaskResponse } from '../types';

/* ── icons ────────────────────────────────────────────────── */
const SvgLogo = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="9" height="9" rx="2" stroke="#D9A53D" strokeWidth="1.5" fill="none" />
    <rect x="6" y="6" width="9" height="9" rx="2" stroke="#D9A53D" strokeWidth="1.5" fill="none" />
  </svg>
);

const ChevronRight = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
    className={`flex-shrink-0 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
  >
    <path d="M3 2l4 3-4 3V2z" />
  </svg>
);

const BoardIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="flex-shrink-0 opacity-50">
    <rect x="0.5" y="0.5" width="3.5" height="4" rx="0.5" />
    <rect x="6" y="0.5" width="3.5" height="3" rx="0.5" />
    <rect x="0.5" y="6" width="3.5" height="3.5" rx="0.5" />
    <rect x="6" y="5.5" width="3.5" height="4" rx="0.5" />
  </svg>
);

const PlusIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1.5 3h8M4 3V2h3v1M2.5 3l.5 6h5l.5-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── component ────────────────────────────────────────────── */
export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { workspaces, loading: wsLoading, fetchWorkspaces, removeWorkspace } = useWorkspaceStore();
  const { boardsByWorkspace, fetchBoards, getBoardsForWorkspace, removeBoard } = useBoardStore();
  const { modal, openModal, closeModal } = useUIStore();

  const [expandedWsIds, setExpandedWsIds] = useState<Set<string>>(new Set());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pathMatch = location.pathname.match(/\/w\/([^/]+)(?:\/b\/([^/]+))?/);
  const activeWorkspaceId = pathMatch?.[1] ?? null;
  const activeBoardId = pathMatch?.[2] ?? null;

  useEffect(() => { fetchWorkspaces(); }, []);

  useEffect(() => {
    if (activeWorkspaceId) {
      setExpandedWsIds(prev => new Set([...prev, activeWorkspaceId]));
      if (!boardsByWorkspace[activeWorkspaceId]) fetchBoards(activeWorkspaceId);
    }
  }, [activeWorkspaceId]);

  // Close mobile sidebar on route change
  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  const toggleWorkspace = (wsId: string) => {
    setExpandedWsIds(prev => {
      const next = new Set(prev);
      if (next.has(wsId)) { next.delete(wsId); }
      else { next.add(wsId); if (!boardsByWorkspace[wsId]) fetchBoards(wsId); }
      return next;
    });
  };

  const handleDeleteWorkspace = async (e: React.MouseEvent, wsId: string, wsName: string) => {
    e.stopPropagation();
    if (!confirm(`Delete workspace "${wsName}" and all its boards?`)) return;
    await removeWorkspace(wsId);
    if (activeWorkspaceId === wsId) navigate('/workspaces');
  };

  const handleDeleteBoard = async (e: React.MouseEvent, wsId: string, boardId: string, boardName: string) => {
    e.stopPropagation();
    if (!confirm(`Delete board "${boardName}"?`)) return;
    await removeBoard(wsId, boardId);
    if (activeBoardId === boardId) navigate('/workspaces');
  };

  const handleCreateSuccess = (data: WorkspaceResponse | BoardResponse | TaskResponse) => {
    if (modal?.type === 'workspace') {
      navigate('/workspaces');
    } else if (modal?.type === 'board' && modal.workspaceId) {
      navigate(`/w/${modal.workspaceId}/b/${(data as BoardResponse).id}`);
    }
    closeModal();
  };

  const sidebar = (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col overflow-hidden h-full"
      style={{ borderRight: '0.5px solid rgba(255,255,255,0.06)', background: '#0C0C0C' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-4 h-[52px] flex-shrink-0"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}
      >
        <SvgLogo />
        <span className="text-white/75 text-[13px] font-semibold tracking-tight">code8flow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="text-[9px] font-semibold text-white/20 uppercase tracking-[0.1em] px-2 pb-2">
          Workspaces
        </p>

        {wsLoading && workspaces.length === 0 && (
          <p className="px-2 text-[11px] text-white/20">Loading…</p>
        )}

        <div className="space-y-0.5">
          {workspaces.map(ws => {
            const isExpanded = expandedWsIds.has(ws.id);
            const isActive = activeWorkspaceId === ws.id;
            const boards = getBoardsForWorkspace(ws.id);

            return (
              <div key={ws.id}>
                {/* Workspace row */}
                <div className="group relative flex items-center">
                  <button
                    onClick={() => toggleWorkspace(ws.id)}
                    className={`flex-1 flex items-center gap-1.5 px-2 py-[6px] rounded-md text-left transition-colors min-w-0 ${
                      isActive
                        ? 'bg-white/[0.06] text-white/80'
                        : 'text-white/40 hover:bg-white/[0.04] hover:text-white/60'
                    }`}
                  >
                    <ChevronRight expanded={isExpanded} />
                    <span className="text-[12px] font-medium truncate flex-1">{ws.name}</span>
                  </button>
                  <button
                    onClick={e => handleDeleteWorkspace(e, ws.id, ws.name)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 mr-1 rounded text-white/20 hover:text-red-400 transition-all"
                    title="Delete workspace"
                  >
                    <TrashIcon />
                  </button>
                </div>

                {/* Board list */}
                {isExpanded && (
                  <div
                    className="ml-3 mt-0.5 mb-0.5 pl-2 space-y-0.5"
                    style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {boards.map(board => (
                      <div key={board.id} className="group relative flex items-center">
                        <button
                          onClick={() => navigate(`/w/${ws.id}/b/${board.id}`)}
                          className={`flex-1 flex items-center gap-2 px-2 py-[5px] rounded-md text-left transition-colors min-w-0 ${
                            activeBoardId === board.id
                              ? 'bg-[#D9A53D]/10 text-[#D9A53D]'
                              : 'text-white/30 hover:bg-white/[0.04] hover:text-white/50'
                          }`}
                        >
                          <BoardIcon />
                          <span className="text-[11px] truncate">{board.name}</span>
                        </button>
                        <button
                          onClick={e => handleDeleteBoard(e, ws.id, board.id, board.name)}
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 mr-1 rounded text-white/20 hover:text-red-400 transition-all"
                          title="Delete board"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => openModal('board', ws.id)}
                      className="w-full flex items-center gap-2 px-2 py-[5px] rounded-md text-white/20 hover:text-white/40 transition-colors"
                    >
                      <PlusIcon />
                      <span className="text-[11px]">New board</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => openModal('workspace')}
          className="w-full flex items-center gap-2 px-2 py-[6px] mt-2 rounded-md text-white/20 hover:text-white/40 hover:bg-white/[0.03] transition-colors"
        >
          <PlusIcon />
          <span className="text-[12px]">New workspace</span>
        </button>
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-[10px] text-white/25 truncate mb-1.5">{user?.email}</p>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="text-[11px] text-white/20 hover:text-white/50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">

      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex h-full">
        {sidebar}
      </div>

      {/* Mobile sidebar — slide-in drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden flex h-full transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 h-[52px] flex-shrink-0"
          style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={() => setIsMobileOpen(true)}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <HamburgerIcon />
          </button>
          <SvgLogo />
          <span className="text-white/60 text-[13px] font-semibold tracking-tight">code8flow</span>
        </div>

        <main className="flex-1 overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      {modal && modal.type !== 'task' && (
        <CreateModal
          type={modal.type}
          workspaceId={modal.workspaceId}
          boardId={modal.boardId}
          onClose={closeModal}
          onSuccess={handleCreateSuccess}
        />
      )}
      {modal && modal.type === 'task' && (
        <CreateModal
          type="task"
          workspaceId={modal.workspaceId}
          boardId={modal.boardId}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}
    </div>
  );
}
