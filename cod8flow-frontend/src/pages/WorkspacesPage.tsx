import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store/workspace.store';
import { useUIStore } from '../store/ui.store';
import { getBoardsByWorkspace } from '../api/board.api';

const SvgLogo = () => (
  <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="9" height="9" rx="2" stroke="#D9A53D" strokeWidth="1.5" fill="none" />
    <rect x="6" y="6" width="9" height="9" rx="2" stroke="#D9A53D" strokeWidth="1.5" fill="none" />
  </svg>
);

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const { workspaces, loading } = useWorkspaceStore();
  const { openModal } = useUIStore();

  const handleOpen = async (wsId: string) => {
    try {
      const res = await getBoardsByWorkspace(wsId);
      if (res.data.length > 0) {
        navigate(`/w/${wsId}/b/${res.data[0].id}`);
      } else {
        openModal('board', wsId);
      }
    } catch {
      openModal('board', wsId);
    }
  };

  if (loading && workspaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-5 h-5 border-2 border-[#D9A53D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loading && workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 text-center p-8">
        <SvgLogo />
        <div>
          <h1 className="text-[20px] font-semibold text-white mb-1.5">Welcome to code8flow</h1>
          <p className="text-[13px] text-white/30">Create your first workspace to get started.</p>
        </div>
        <button
          onClick={() => openModal('workspace')}
          className="px-5 py-2.5 bg-[#D9A53D] hover:bg-[#c8952e] rounded-lg text-[#0A0A0A] text-[13px] font-bold transition-all hover:-translate-y-px"
        >
          Create Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[18px] font-semibold text-white">Workspaces</h1>
          <button
            onClick={() => openModal('workspace')}
            className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-[12px] font-semibold transition-all hover:bg-[#D9A53D]/10"
            style={{ borderColor: 'rgba(217,165,61,0.2)', color: '#D9A53D' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => handleOpen(ws.id)}
              className="text-left p-4 rounded-xl transition-all hover:-translate-y-px group"
              style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold text-[#D9A53D] flex-shrink-0"
                  style={{ background: 'rgba(217,165,61,0.1)' }}
                >
                  {ws.name[0].toUpperCase()}
                </div>
                <svg
                  className="text-white/20 group-hover:text-white/50 transition-colors mt-0.5 flex-shrink-0"
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                >
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors mb-0.5 truncate">
                {ws.name}
              </h3>
              {ws.description && (
                <p className="text-[11px] text-white/25 truncate mb-2">{ws.description}</p>
              )}
              <div className="flex items-center gap-3 text-[10px] text-white/20 mt-2">
                <span>{ws.boardCount} board{ws.boardCount !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{ws.memberCount} member{ws.memberCount !== 1 ? 's' : ''}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
