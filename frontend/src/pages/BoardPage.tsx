import { LogOut, Plus, Search, Settings, UserRound } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import brandLogo from "../assets/thecod8r-icon.png";

const columns = [
  {
    title: "Backlog",
    tasks: [
      { id: "FB-12", title: "Design workspace membership model", priority: "High" },
      { id: "FB-18", title: "Create board CRUD API contract", priority: "Medium" }
    ]
  },
  {
    title: "In progress",
    tasks: [
      { id: "FB-21", title: "Wire JWT login response into frontend session", priority: "High" },
      { id: "FB-23", title: "Add protected route layout", priority: "Medium" }
    ]
  },
  {
    title: "Review",
    tasks: [{ id: "FB-27", title: "Validate refresh token migration", priority: "Low" }]
  },
  {
    title: "Done",
    tasks: [{ id: "FB-03", title: "Create health endpoint", priority: "Done" }]
  }
];

export function BoardPage() {
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <main className="brand-shell min-h-screen text-white">
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <img className="h-10 w-10 rounded-full border border-white/15" src={brandLogo} alt="FlowBoard logo" />
          <div>
            <p className="text-sm font-semibold leading-5 text-white">FlowBoard</p>
            <p className="text-xs text-zinc-500">Engineering workspace</p>
          </div>
        </div>

        <div className="hidden h-10 min-w-[280px] items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-zinc-500 md:flex">
          <Search size={17} aria-hidden="true" />
          <span className="text-sm">Search tasks, boards, people</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="icon-button" title="Settings" aria-label="Settings">
            <Settings size={18} />
          </button>
          <button className="icon-button" title="Profile" aria-label="Profile">
            <UserRound size={18} />
          </button>
          <button className="icon-button" title="Sign out" aria-label="Sign out" onClick={signOut}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <section className="px-4 py-5 sm:px-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              {session?.email ?? "Signed in"} / {session?.role ?? "MEMBER"}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">Platform launch board</h1>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200">
            <Plus size={17} aria-hidden="true" />
            New task
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <section className="min-h-[420px] rounded-lg border border-white/10 bg-black/75 p-3 shadow-soft backdrop-blur" key={column.title}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{column.title}</h2>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-zinc-300">{column.tasks.length}</span>
              </div>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <article className="rounded-md border border-white/10 bg-white/[0.045] p-3 transition hover:border-white/30 hover:bg-white/[0.08]" key={task.id}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-zinc-500">{task.id}</span>
                      <span className="rounded-full bg-black px-2 py-1 text-xs font-medium text-zinc-300">{task.priority}</span>
                    </div>
                    <h3 className="text-sm font-semibold leading-5 text-zinc-100">{task.title}</h3>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
