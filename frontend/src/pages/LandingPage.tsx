import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, Check, LayoutDashboard, LockKeyhole, Sparkles, UsersRound } from "lucide-react";
import brandLogo from "../assets/thecod8r-icon.png";

const offers = [
  {
    icon: LayoutDashboard,
    title: "Workspaces built for shipping",
    copy: "Plan projects, split work into boards, and keep every team focused on what should move next."
  },
  {
    icon: UsersRound,
    title: "Roles from day one",
    copy: "Invite members, assign ownership, and separate admin, member, and viewer permissions cleanly."
  },
  {
    icon: Bell,
    title: "Updates without noise",
    copy: "Track task movement, mentions, and release activity with notifications that support deep work."
  },
  {
    icon: LockKeyhole,
    title: "Secure project flow",
    copy: "JWT auth, refresh sessions, and account controls designed before the public launch."
  }
];

const roadmap = ["Private auth beta", "Workspace and board preview", "Task workflow beta", "Team invites", "Files and activity feed"];

type WaitlistEntry = {
  email: string;
  teamSize: string;
  createdAt: string;
};

function saveWaitlistEntry(entry: WaitlistEntry) {
  const rawEntries = window.localStorage.getItem("flowboard-waitlist");
  const entries = rawEntries ? (JSON.parse(rawEntries) as WaitlistEntry[]) : [];
  const nextEntries = [entry, ...entries.filter((item) => item.email !== entry.email)];
  window.localStorage.setItem("flowboard-waitlist", JSON.stringify(nextEntries));
}

export function LandingPage() {
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("1-5");
  const [joined, setJoined] = useState(false);
  const estimatedSpot = useMemo(() => Math.max(41, email.length * 7 + teamSize.length * 3), [email, teamSize]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveWaitlistEntry({
      email,
      teamSize,
      createdAt: new Date().toISOString()
    });
    setJoined(true);
  }

  return (
    <main className="brand-shell min-h-screen overflow-hidden text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link className="flex items-center gap-3 text-sm font-semibold text-white" to="/">
          <img className="h-11 w-11 rounded-full border border-white/15" src={brandLogo} alt="FlowBoard logo" />
          <span>FlowBoard</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          <a className="hover:text-white" href="#offer">Offer</a>
          <a className="hover:text-white" href="#preview">Preview</a>
          <a className="hover:text-white" href="#roadmap">Roadmap</a>
        </nav>

        <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-white/35" to="/login">
          Sign in
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-7xl items-center gap-10 px-5 pb-14 pt-6 sm:px-8 lg:grid-cols-[1fr_0.84fr]">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-300">
            <Sparkles size={15} aria-hidden="true" />
            Opening private access while the full platform is being built
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl">
            The calm project board for serious builders.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            FlowBoard will bring workspaces, boards, tasks, team roles, auth, notifications, files, and release visibility into one focused product management system.
          </p>

          <form className="mt-8 grid max-w-2xl gap-3 rounded-lg border border-white/10 bg-black/70 p-3 backdrop-blur sm:grid-cols-[1fr_150px_auto]" onSubmit={handleSubmit}>
            <input
              className="h-12 rounded-md border border-white/10 bg-white/[0.04] px-4 text-white outline-none placeholder:text-zinc-600 focus:border-white/35"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setJoined(false);
              }}
              required
            />
            <select
              className="h-12 rounded-md border border-white/10 bg-black px-4 text-white outline-none focus:border-white/35"
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value)}
            >
              <option>1-5</option>
              <option>6-20</option>
              <option>21-50</option>
              <option>50+</option>
            </select>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 font-semibold text-black hover:bg-zinc-200">
              Join waitlist
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>

          {joined && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} aria-hidden="true" />
              You are on the local preview waitlist. Estimated spot #{estimatedSpot}.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-black/75 p-4 shadow-soft backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Launch workspace</p>
              <p className="text-xs text-zinc-500">Product beta board</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">Private beta</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {["Plan", "Build", "Ship"].map((column, index) => (
              <div className="min-h-[310px] rounded-md border border-white/10 bg-white/[0.035] p-3" key={column}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase text-zinc-400">{column}</p>
                  <span className="text-xs text-zinc-600">{index + 2}</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-md border border-white/10 bg-black/70 p-3">
                    <p className="text-xs text-zinc-500">FB-{index + 10}</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">{["Invite early teams", "Build JWT auth", "Release beta access"][index]}</p>
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/70 p-3">
                    <p className="text-xs text-zinc-500">FB-{index + 20}</p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">{["Define workspace roles", "Board API preview", "Collect feedback"][index]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8" id="offer">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase text-zinc-500">What FlowBoard will offer</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A project system that starts simple and grows with the team.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <article className="rounded-lg border border-white/10 bg-black/70 p-5 backdrop-blur" key={offer.title}>
                <Icon className="mb-5 text-white" size={24} aria-hidden="true" />
                <h3 className="text-base font-semibold text-white">{offer.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{offer.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1fr]" id="preview">
        <div>
          <p className="text-sm font-semibold uppercase text-zinc-500">Product preview</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Built around the board, not buried under process.</h2>
        </div>
        <div className="grid gap-3">
          {["Create workspaces for each product area", "Turn board columns into real delivery states", "Attach tasks to owners, priority, status, files, and comments"].map((item) => (
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/70 p-4 text-zinc-300" key={item}>
              <Check size={18} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8" id="roadmap">
        <div className="rounded-lg border border-white/10 bg-black/75 p-6 backdrop-blur">
          <p className="text-sm font-semibold uppercase text-zinc-500">Roadmap</p>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {roadmap.map((item, index) => (
              <div className="rounded-md border border-white/10 bg-white/[0.035] p-4" key={item}>
                <p className="text-xs text-zinc-600">0{index + 1}</p>
                <p className="mt-3 text-sm font-semibold text-zinc-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
