import { useState } from 'react';
import type { TaskResponse, Priority, TaskStatus } from '../types';
import { useTaskStore } from '../store/task.store';

interface Props {
  task: TaskResponse;
  onClose: () => void;
}

const ALL_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: '#64748B',
  IN_PROGRESS: '#D9A53D',
  DONE: '#10B981',
  CANCELLED: '#6B7280',
};

const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: '#94a3b8',
  MEDIUM: '#60a5fa',
  HIGH: '#fbbf24',
  CRITICAL: '#f87171',
};

export default function TaskDetailModal({ task, onClose }: Props) {
  const { removeTask, moveTask } = useTaskStore();
  const [deleting, setDeleting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    await removeTask(task.id);
    onClose();
  };

  const handleStatusChange = async (status: TaskStatus) => {
    if (status === task.status || changingStatus) return;
    setChangingStatus(true);
    await moveTask(task.id, status);
    setChangingStatus(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-xl p-5 space-y-4"
        style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-white leading-snug">{task.title}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/30 hover:text-white/60 transition-colors mt-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Status picker */}
        <div>
          <p className="text-[9px] font-semibold text-white/25 uppercase tracking-wide mb-2">Status</p>
          <div className="flex gap-1.5 flex-wrap">
            {ALL_STATUSES.map(s => {
              const isActive = task.status === s;
              const color = STATUS_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={changingStatus}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all disabled:cursor-not-allowed"
                  style={{
                    background: isActive ? color + '25' : 'rgba(255,255,255,0.03)',
                    color: isActive ? color : 'rgba(255,255,255,0.25)',
                    border: `0.5px solid ${isActive ? color + '50' : 'rgba(255,255,255,0.07)'}`,
                    opacity: changingStatus && !isActive ? 0.4 : 1,
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority badge */}
        <div className="flex items-center gap-2">
          <p className="text-[9px] font-semibold text-white/25 uppercase tracking-wide w-14">Priority</p>
          <span
            className="text-[10px] font-semibold px-2 py-1 rounded-md"
            style={{
              background: PRIORITY_COLORS[task.priority] + '22',
              color: PRIORITY_COLORS[task.priority],
            }}
          >
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <p className="text-[9px] font-semibold text-white/25 uppercase tracking-wide mb-1.5">Description</p>
            <p className="text-[13px] text-white/55 leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Meta */}
        <div
          className="space-y-2 pt-3"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}
        >
          {task.assigneeEmail && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/25 w-16 flex-shrink-0">Assignee</span>
              <span className="text-[12px] text-white/55">{task.assigneeEmail}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/25 w-16 flex-shrink-0">Due</span>
              <span className="text-[12px] text-white/55">{formatDate(task.dueDate)}</span>
            </div>
          )}
          {task.createdAt && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/25 w-16 flex-shrink-0">Created</span>
              <span className="text-[12px] text-white/55">{formatDate(task.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[12px] text-red-400/50 hover:text-red-400 transition-colors disabled:opacity-40"
          >
            {deleting ? 'Deleting…' : 'Delete task'}
          </button>
        </div>
      </div>
    </div>
  );
}
