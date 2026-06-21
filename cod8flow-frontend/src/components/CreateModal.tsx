import { useState } from 'react';
import type { Priority, WorkspaceResponse, BoardResponse, TaskResponse } from '../types';
import { useWorkspaceStore } from '../store/workspace.store';
import { useBoardStore } from '../store/board.store';
import { useTaskStore } from '../store/task.store';

interface Props {
  type: 'workspace' | 'board' | 'task';
  workspaceId?: string;
  boardId?: string;
  onClose: () => void;
  onSuccess: (data: WorkspaceResponse | BoardResponse | TaskResponse) => void;
}

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: '#94a3b8',
  MEDIUM: '#60a5fa',
  HIGH: '#fbbf24',
  CRITICAL: '#f87171',
};

export default function CreateModal({ type, workspaceId, boardId, onClose, onSuccess }: Props) {
  const { addWorkspace } = useWorkspaceStore();
  const { addBoard } = useBoardStore();
  const { addTask } = useTaskStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const titles = { workspace: 'New Workspace', board: 'New Board', task: 'New Task' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result: WorkspaceResponse | BoardResponse | TaskResponse;
      if (type === 'workspace') {
        result = await addWorkspace({ name, description: description || undefined });
      } else if (type === 'board' && workspaceId) {
        result = await addBoard(workspaceId, { name, description: description || undefined });
      } else if (type === 'task' && boardId) {
        result = await addTask(boardId, {
          title: name,
          description: description || undefined,
          priority,
          dueDate: dueDate ? `${dueDate}T00:00:00` : undefined,
        });
      } else {
        throw new Error('Missing required context');
      }
      onSuccess(result!);
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { message?: string } }; message?: string };
      setError(axiosErr.response?.data?.message ?? axiosErr.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-5"
        style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-white">{titles[type]}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-1">
              {type === 'task' ? 'Title' : 'Name'}
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={2}
              placeholder={type === 'task' ? 'Task title…' : type === 'board' ? 'Board name…' : 'Workspace name…'}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/20 outline-none focus:border-[#D9A53D]/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-1">
              Description <span className="normal-case font-normal text-white/20">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional description…"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/20 outline-none focus:border-[#D9A53D]/40 transition-colors resize-none"
            />
          </div>

          {type === 'task' && (
            <>
              <div>
                <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-1.5">
                  Priority
                </label>
                <div className="flex gap-1.5">
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded-md text-[9px] font-bold transition-all ${
                        priority === p ? 'opacity-100 border' : 'opacity-40 border'
                      }`}
                      style={{
                        color: PRIORITY_COLORS[p],
                        borderColor: priority === p ? PRIORITY_COLORS[p] + '60' : 'rgba(255,255,255,0.08)',
                        background: priority === p ? PRIORITY_COLORS[p] + '15' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wide mb-1">
                  Due date <span className="normal-case font-normal text-white/20">(optional)</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-[#D9A53D]/40 transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#D9A53D] hover:bg-[#c8952e] rounded-lg text-[#0A0A0A] text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating…' : `Create ${type}`}
          </button>
        </form>
      </div>
    </div>
  );
}
