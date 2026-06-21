import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

interface Task {
  id: string;
  title: string;
  priority: string;
  priorityColor: string;
  priorityBg: string;
  assignee: string;
  assigneeColor: string;
}

interface Column {
  id: string;
  title: string;
  dotColor: string;
  tasks: Task[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'todo', title: 'To do', dotColor: '#64748B',
    tasks: [
      { id: 't1', title: 'Add rate limiting', priority: 'Urgent', priorityColor: '#f87171', priorityBg: 'rgba(220,38,38,0.12)', assignee: 'PD', assigneeColor: '#7c3aed' },
      { id: 't2', title: 'API documentation', priority: 'Low', priorityColor: '#94a3b8', priorityBg: 'rgba(100,116,139,0.12)', assignee: 'AK', assigneeColor: '#0f6e56' },
      { id: 't3', title: 'Prometheus metrics', priority: 'Medium', priorityColor: '#60a5fa', priorityBg: 'rgba(59,130,246,0.12)', assignee: 'SR', assigneeColor: '#b45309' },
      { id: 't4', title: 'Email notifications', priority: 'High', priorityColor: '#fbbf24', priorityBg: 'rgba(217,119,6,0.12)', assignee: 'MK', assigneeColor: '#1e3a5f' },
    ],
  },
  {
    id: 'progress', title: 'In progress', dotColor: '#D9A53D',
    tasks: [
      { id: 't5', title: 'Kafka consumer', priority: 'High', priorityColor: '#fbbf24', priorityBg: 'rgba(217,119,6,0.12)', assignee: 'PD', assigneeColor: '#7c3aed' },
      { id: 't6', title: 'Redis cache layer', priority: 'Medium', priorityColor: '#60a5fa', priorityBg: 'rgba(59,130,246,0.12)', assignee: 'AK', assigneeColor: '#0f6e56' },
      { id: 't7', title: 'React frontend', priority: 'High', priorityColor: '#fbbf24', priorityBg: 'rgba(217,119,6,0.12)', assignee: 'PD', assigneeColor: '#7c3aed' },
    ],
  },
  {
    id: 'review', title: 'In review', dotColor: '#9ca3af',
    tasks: [
      { id: 't8', title: 'JWT token rotation', priority: 'High', priorityColor: '#fbbf24', priorityBg: 'rgba(217,119,6,0.12)', assignee: 'MK', assigneeColor: '#1e3a5f' },
      { id: 't9', title: 'S3 pre-signed URLs', priority: 'Medium', priorityColor: '#60a5fa', priorityBg: 'rgba(59,130,246,0.12)', assignee: 'AK', assigneeColor: '#0f6e56' },
    ],
  },
  {
    id: 'done', title: 'Done', dotColor: '#10B981',
    tasks: [
      { id: 't10', title: 'Flyway V1 to V7', priority: 'Done', priorityColor: '#34d399', priorityBg: 'rgba(16,185,129,0.12)', assignee: 'PD', assigneeColor: '#7c3aed' },
    ],
  },
];

const SvgLogo = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="9" height="9" rx="2" stroke="#D9A53D" strokeWidth="1.5" fill="none" />
    <rect x="6" y="6" width="9" height="9" rx="2" stroke="#D9A53D" strokeWidth="1.5" fill="none" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const FloatingInput = ({
  id, type, label, value, onChange,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative mb-[8px]">
    <input
      id={id}
      type={type}
      placeholder=" "
      value={value}
      onChange={onChange}
      required
      className="peer w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pt-[15px] pb-[4px] px-[12px] text-[13px] text-white outline-none transition-all focus:border-[#D9A53D]/50 focus:bg-[#D9A53D]/[0.02]"
    />
    <label
      htmlFor={id}
      className="
        absolute left-[12px] text-white/25 pointer-events-none transition-all
        top-1/2 -translate-y-1/2 text-[12px]
        peer-focus:top-[8px] peer-focus:translate-y-0 peer-focus:text-[9px]
        peer-focus:font-semibold peer-focus:tracking-[0.04em] peer-focus:text-[#D9A53D]/60
        peer-[:not(:placeholder-shown)]:top-[8px] peer-[:not(:placeholder-shown)]:translate-y-0
        peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-semibold
        peer-[:not(:placeholder-shown)]:tracking-[0.04em] peer-[:not(:placeholder-shown)]:text-[#D9A53D]/60
      "
    >
      {label}
    </label>
  </div>
);

const SocialPill = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  
   <a href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-[6px] px-[12px] py-[7px] bg-[#101010] border border-white/[0.06] rounded-full hover:bg-[#14110a] hover:border-[#D9A53D]/[0.18] transition-all"
  >
    <div className="w-[2px] h-3 rounded-full bg-[#D9A53D]/[0.22] group-hover:bg-[#D9A53D] transition-colors flex-shrink-0" />
    <span className="text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">{icon}</span>
    <span className="text-[11px] font-medium text-white/25 group-hover:text-white/60 transition-colors">{label}</span>
  </a>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [flipping, setFlipping] = useState(false);
  const [flipStage, setFlipStage] = useState<'idle' | 'first-half' | 'second-half'>('idle');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColId: string } | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerFlip = (targetMode: 'login' | 'register') => {
    if (flipping) return;
    setFlipping(true);
    setFlipStage('first-half');
    setError('');

    // At 300ms (mid-flip) swap the content
    setTimeout(() => {
      setMode(targetMode);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setFlipStage('second-half');
    }, 300);

    // At 600ms flip completes
    setTimeout(() => {
      setFlipping(false);
      setFlipStage('idle');
    }, 600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    interface Point { x: number; y: number; gold: boolean; r: number }
    interface Particle { a: Point; b: Point; t: number; speed: number; gold: boolean; size: number }
    let pts: Point[] = [];
    let particles: Particle[] = [];
    let W = 0, H = 0;
    const cv = canvas;
    const cx = ctx;

    function init() {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      pts = Array.from({ length: 28 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        gold: Math.random() > 0.5,
        r: 1.2 + Math.random() * 2,
      }));
      particles = [];
      for (let i = 0; i < 30; i++) spawn();
    }

    function spawn() {
      const a = pts[Math.floor(Math.random() * pts.length)];
      let b = pts[Math.floor(Math.random() * pts.length)];
      while (b === a) b = pts[Math.floor(Math.random() * pts.length)];
      particles.push({ a, b, t: Math.random(), speed: 0.0018 + Math.random() * 0.003, gold: a.gold || b.gold, size: 0.7 + Math.random() * 1.3 });
    }

    function draw() {
      cx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const p = pts[i], q = pts[j];
          const d = Math.hypot(q.x - p.x, q.y - p.y);
          if (d < W * 0.36) {
            const al = (1 - d / (W * 0.36)) * (p.gold || q.gold ? 0.12 : 0.045);
            cx.beginPath();
            cx.moveTo(p.x, p.y);
            cx.lineTo(q.x, q.y);
            cx.strokeStyle = p.gold || q.gold ? `rgba(217,165,61,${al})` : `rgba(255,255,255,${al})`;
            cx.lineWidth = 0.45;
            cx.stroke();
          }
        }
      }
      for (const p of pts) {
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = p.gold ? 'rgba(217,165,61,0.42)' : 'rgba(255,255,255,0.13)';
        cx.fill();
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const pk = particles[i];
        pk.t += pk.speed;
        const x = pk.a.x + (pk.b.x - pk.a.x) * pk.t;
        const y = pk.a.y + (pk.b.y - pk.a.y) * pk.t;
        cx.beginPath();
        cx.arc(x, y, pk.size, 0, Math.PI * 2);
        cx.fillStyle = pk.gold ? 'rgba(217,165,61,0.88)' : 'rgba(255,255,255,0.32)';
        cx.fill();
        if (pk.t >= 1) { particles.splice(i, 1); spawn(); }
      }
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        storeLogin(res.data.accessToken, res.data.refreshToken, res.data.email, res.data.role);
        navigate('/');
      } else {
        const res = await register({ firstName, lastName, email, password });
        storeLogin(res.data.accessToken, res.data.refreshToken, res.data.email, res.data.role);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (mode === 'login' ? 'Invalid email or password' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (task: Task, fromColId: string) => setDraggedTask({ task, fromColId });
  const handleDragOver = (e: React.DragEvent, colId: string) => { e.preventDefault(); setDragOverColId(colId); };
  const handleDrop = (toColId: string) => {
    if (!draggedTask) return;
    setColumns(prev => prev.map(col => {
      if (col.id === draggedTask.fromColId) return { ...col, tasks: col.tasks.filter(t => t.id !== draggedTask.task.id) };
      if (col.id === toColId) return { ...col, tasks: [...col.tasks, draggedTask.task] };
      return col;
    }));
    setDraggedTask(null);
    setDragOverColId(null);
  };

  // Coin flip CSS transform
  const logoTransform = (() => {
    if (flipStage === 'first-half') return 'rotateY(90deg)';
    if (flipStage === 'second-half') return 'rotateY(0deg)';
    return 'rotateY(0deg)';
  })();

  return (
    <div className="relative min-h-screen w-full bg-[#0A0A0A] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 flex min-h-screen">

        {/* LEFT PANEL — kanban + bottom brand */}
        <div className="hidden md:flex md:w-[70%] flex-col p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(217,165,61,0.065) 1px,transparent 1px),linear-gradient(90deg,rgba(217,165,61,0.065) 1px,transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative z-10 flex flex-col h-full">

            {/* Kanban */}
            <div className="flex gap-3 flex-1 mb-6">
              {columns.map(col => (
                <div key={col.id} className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: col.dotColor }} />
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.09em] truncate">
                      {col.title}
                    </span>
                    <span className="text-[9px] text-white/15 ml-auto bg-white/[0.05] px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {col.tasks.length}
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-[5px] flex-1 rounded-lg p-1.5 transition-all duration-150 ${
                      dragOverColId === col.id ? 'bg-[#D9A53D]/[0.05] outline-dashed outline-1 outline-[#D9A53D]/20' : ''
                    }`}
                    onDragOver={e => handleDragOver(e, col.id)}
                    onDragLeave={() => setDragOverColId(null)}
                    onDrop={() => handleDrop(col.id)}
                  >
                    {col.tasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task, col.id)}
                        className="bg-[#111]/95 border border-white/[0.07] rounded-[6px] p-[9px] cursor-grab active:cursor-grabbing hover:border-[#D9A53D]/20 transition-colors select-none"
                      >
                        <p className="text-[11px] text-white/70 font-medium leading-[1.4] mb-[7px]">
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="text-[8px] font-semibold px-[5px] py-[2px] rounded-[3px]"
                            style={{ background: task.priorityBg, color: task.priorityColor }}
                          >
                            {task.priority}
                          </span>
                          <div
                            className="w-[15px] h-[15px] rounded-full flex items-center justify-center text-[6px] font-bold text-white flex-shrink-0"
                            style={{ background: task.assigneeColor }}
                          >
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom left brand */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <SvgLogo />
                <span className="text-white/70 text-[13px] font-medium tracking-tight">code8flow</span>
              </div>
              <p className="text-[20px] font-semibold text-white tracking-tight leading-tight">
                Where work <span className="text-[#D9A53D]">flows.</span>
              </p>
              <p className="text-[11px] text-white/20">
                Project management engineered for developers.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL — logo + form */}
        <div className="w-full md:w-[30%] md:flex-shrink-0 relative flex flex-col">
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(7,7,7,0.9)',
              borderLeft: '0.5px solid rgba(217,165,61,0.08)',
            }}
          />
          <div className="relative z-10 flex flex-col h-full min-h-screen md:min-h-0 px-6 py-6">

            {/* Mobile logo */}
            <div className="flex md:hidden items-center gap-2 mb-6">
              <SvgLogo />
              <span className="text-white/90 text-sm font-medium tracking-tight">code8flow</span>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col justify-center gap-6">

              {/* Coin logo — animates on mode switch */}
              <div className="flex justify-center" style={{ perspective: '600px' }}>
                <div
                  style={{
                    transform: logoTransform,
                    transition: flipStage === 'idle' ? 'none' : 'transform 0.3s ease-in-out',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src="/c8_logo.svg"
                    alt="thecod8r logo"
                    className="w-16 h-16 object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(217,165,61,0.3))',
                    }}
                  />
                </div>
              </div>

              {/* Form card */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">

                <div className="mb-4">
                  <h2 className="text-[17px] font-semibold text-white tracking-tight mb-0.5">
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                  </h2>
                  <p className="text-white/25 text-[11px]">
                    {mode === 'login'
                      ? 'Welcome back. Pick up where you left off'
                      : 'Join code8flow. Ship work faster'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                  {mode === 'register' && (
                    <div className="grid grid-cols-2 gap-2 mb-0">
                      <FloatingInput
                        id="reg-first"
                        type="text"
                        label="First name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                      <FloatingInput
                        id="reg-last"
                        type="text"
                        label="Last name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                  )}

                  <FloatingInput
                    id="auth-email"
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <FloatingInput
                    id="auth-password"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />

                  {mode === 'login' && (
                    <div className="text-right mb-3 mt-1">
                      <span className="text-[11px] text-white/20 cursor-pointer hover:text-[#D9A53D]/60 transition-colors">
                        Forgot password?
                      </span>
                    </div>
                  )}

                  {mode === 'register' && <div className="mt-2" />}

                  {error && (
                    <div className="mb-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || flipping}
                    className="relative w-full py-[11px] bg-[#D9A53D] hover:bg-[#c8952e] rounded-lg text-[#0A0A0A] text-[13px] font-bold tracking-[0.02em] flex items-center justify-center gap-2 overflow-hidden transition-all hover:-translate-y-px active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                    {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (
                      <>
                        <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[11px] text-white/20 mt-3">
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => triggerFlip('register')}
                        className="text-[#D9A53D] font-medium hover:text-[#c8952e] transition-colors bg-transparent border-none cursor-pointer text-[11px] p-0"
                      >
                        Create one
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => triggerFlip('login')}
                        className="text-[#D9A53D] font-medium hover:text-[#c8952e] transition-colors bg-transparent border-none cursor-pointer text-[11px] p-0"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Social pills */}
            <div className="pt-4 border-t border-white/[0.05]">
              <p className="text-[10px] text-white/[0.13] text-center uppercase tracking-[0.06em] mb-[9px]">
                Find me on
              </p>
              <div className="flex gap-2 justify-center">
                <SocialPill href="https://github.com/pratik20gb" icon={<GitHubIcon />} label="pratik20gb" />
                <SocialPill href="https://x.com/pratik20gb" icon={<XIcon />} label="pratik20gb" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}