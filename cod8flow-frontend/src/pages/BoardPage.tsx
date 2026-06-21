import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskStore } from '../store/task.store';
import { useBoardStore } from '../store/board.store';
import { useUIStore } from '../store/ui.store';
import TaskDetailModal from '../components/TaskDetailModal';
import type { TaskResponse, TaskStatus, Priority } from '../types';

const COLUMNS: { status: TaskStatus; label: string; dotColor: string }[] = [
  { status: 'TODO', label: 'To do', dotColor: '#64748B' },
  { status: 'IN_PROGRESS', label: 'In progress', dotColor: '#D9A53D' },
  { status: 'DONE', label: 'Done', dotColor: '#10B981' },
  { status: 'CANCELLED', label: 'Cancelled', dotColor: '#6B7280' },
];

const PC: Record<Priority, { text: string; bg: string }> = {
  LOW: { text: '#94a3b8', bg: 'rgba(100,116,139,0.12)' },
  MEDIUM: { text: '#60a5fa', bg: 'rgba(59,130,246,0.12)' },
  HIGH: { text: '#fbbf24', bg: 'rgba(217,119,6,0.12)' },
  CRITICAL: { text: '#f87171', bg: 'rgba(220,38,38,0.12)' },
};

function TaskCard({
  task,
  onDragStart,
  onClick,
}: {
  task: TaskResponse;
  onDragStart: () => void;
  onClick: () => void;
}) {
  const pc = PC[task.priority];
  const initials = task.assigneeEmail
    ? task.assigneeEmail.split('@')[0].slice(0, 2).toUpperCase()
    : null;

  return (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); onDragStart(); }}
      onClick={onClick}
      className="rounded-[6px] p-[9px] cursor-grab active:cursor-grabbing transition-colors select-none"
      style={{ background: '#0F0F0F', border: '0.5px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(217,165,61,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
    >
      <p className="text-[11px] text-white/70 font-medium leading-[1.4] mb-[7px]">{task.title}</p>
      {task.description && (
        <p className="text-[10px] text-white/25 leading-snug mb-[7px] line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between gap-1">
        <span
          className="text-[8px] font-semibold px-[5px] py-[2px] rounded-[3px]"
          style={{ background: pc.bg, color: pc.text }}
        >
          {task.priority}
        </span>
        <div className="flex items-center gap-1.5">
          {task.dueDate && (
            <span className="text-[8px] text-white/20">
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
          {initials && (
            <div
              className="w-[15px] h-[15px] rounded-full flex items-center justify-center text-[6px] font-bold text-white flex-shrink-0"
              style={{ background: '#7c3aed' }}
            >
              {initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const { boardId, workspaceId } = useParams<{ boardId: string; workspaceId: string }>();
  const { tasks, fetchTasks, moveTask, loading } = useTaskStore();
  const { selectedBoard, selectBoard } = useBoardStore();
  const { openModal } = useUIStore();
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    if (boardId) {
      fetchTasks(boardId);
      selectBoard(boardId);
    }
  }, [boardId]);

  const handleDrop = (status: TaskStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find(t => t.id === draggedTaskId);
    if (task && task.status !== status) moveTask(draggedTaskId, status);
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  const tasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const liveTask = selectedTask ? (tasks.find(t => t.id === selectedTask.id) ?? selectedTask) : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 h-[52px] flex-shrink-0"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-semibold text-white/80">
            {selectedBoard?.name ?? 'Board'}
          </h1>
          {!loading && (
            <span className="text-[10px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => openModal('task', workspaceId, boardId)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D9A53D] hover:bg-[#c8952e] rounded-md text-[#0A0A0A] text-[12px] font-bold transition-all"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Task
        </button>
      </div>

      {/* Kanban */}
      <div className="flex gap-3 p-5 flex-1 overflow-x-auto overflow-y-hidden min-h-0">
        {COLUMNS.map(col => {
          const colTasks = tasksByStatus(col.status);
          const isOver = dragOverStatus === col.status;

          return (
            <div
              key={col.status}
              className="flex flex-col w-[220px] flex-shrink-0 min-h-0"
              onDragOver={e => { e.preventDefault(); setDragOverStatus(col.status); }}
              onDragLeave={() => setDragOverStatus(null)}
              onDrop={() => handleDrop(col.status)}
            >
              {/* Column header */}
              <div className="flex items-center gap-1.5 mb-2.5 px-1">
                <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: col.dotColor }} />
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.09em]">
                  {col.label}
                </span>
                <span className="text-[9px] text-white/15 ml-auto bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Drop zone */}
              <div
                className={`flex flex-col gap-[5px] flex-1 rounded-lg p-1.5 overflow-y-auto transition-all ${
                  isOver ? 'bg-[#D9A53D]/[0.04] outline-dashed outline-1 outline-[#D9A53D]/20' : ''
                }`}
              >
                {loading ? (
                  col.status === 'TODO' && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-4 h-4 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
                    </div>
                  )
                ) : colTasks.length === 0 ? (
                  <div className="flex items-center justify-center py-6 opacity-0 group-hover:opacity-100">
                    <span className="text-[10px] text-white/10">Drop here</span>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={() => setDraggedTaskId(task.id)}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {liveTask && (
        <TaskDetailModal task={liveTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
