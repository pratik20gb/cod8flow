import { LogOut, Plus, Search, Settings, UserRound } from "lucide-react";
import { useAuthStore } from "../store/authStore";

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
    <main className="min-h-screen bg-slate-100 text-ink">
      <header className="flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">F</span>
          <div>
            <p className="text-sm font-semibold leading-5">COD8FLOW</p>
            <p className="text-xs text-slate-500">Engineering workspace</p>
          </div>
        </div>

        <div className="hidden h-10 min-w-[280px] items-center gap-2 rounded-md border border-line bg-slate-50 px-3 text-slate-500 md:flex">
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
            <p className="text-sm font-medium text-slate-500">{session?.email ?? "Signed in"} · {session?.role ?? "MEMBER"}</p>
            <h1 className="mt-1 text-2xl font-bold">Platform launch board</h1>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <Plus size={17} aria-hidden="true" />
            New task
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <section className="min-h-[420px] rounded-lg border border-line bg-white p-3" key={column.title}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{column.title}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{column.tasks.length}</span>
              </div>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <article className="rounded-md border border-line bg-panel p-3 transition hover:border-teal-300 hover:bg-white" key={task.id}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-500">{task.id}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">{task.priority}</span>
                    </div>
                    <h3 className="text-sm font-semibold leading-5">{task.title}</h3>
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
