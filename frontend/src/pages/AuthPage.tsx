import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { login, register } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import brandLogo from "../assets/thecod8r-icon.png";

type AuthPageProps = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const isRegister = mode === "register";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const authMutation = useMutation({
    mutationFn: () => (isRegister ? register(form) : login({ email: form.email, password: form.password })),
    onSuccess: (session) => {
      setSession(session);
      navigate("/app");
    }
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    authMutation.mutate();
  }

  return (
    <main className="brand-shell grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex min-h-[42vh] flex-col justify-between px-6 py-7 text-white sm:px-10 lg:min-h-screen">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <img className="h-11 w-11 rounded-full border border-white/15" src={brandLogo} alt="FlowBoard logo" />
          <span>FlowBoard</span>
        </div>

        <div className="max-w-2xl py-12">
          <p className="mb-4 text-sm font-semibold uppercase text-zinc-400">Project command center</p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">Plan sprints on a sharper board.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
            A focused workspace for teams building software: auth first, boards next, then tasks, roles, and release flow.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
          <span>JWT auth</span>
          <span>Workspace boards</span>
          <span>Task workflows</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <form className="brand-card w-full max-w-md p-6" onSubmit={handleSubmit}>
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-white">{isRegister ? "Create account" : "Welcome back"}</h2>
            <p className="mt-2 text-sm text-zinc-400">
              {isRegister ? "Start a new FlowBoard workspace profile." : "Sign in to continue to your board."}
            </p>
          </div>

          {isRegister && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field">
                <span>First name</span>
                <div className="input-row">
                  <UserRound size={18} aria-hidden="true" />
                  <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} required />
                </div>
              </label>
              <label className="field">
                <span>Last name</span>
                <div className="input-row">
                  <UserRound size={18} aria-hidden="true" />
                  <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} required />
                </div>
              </label>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <label className="field">
              <span>Email</span>
              <div className="input-row">
                <Mail size={18} aria-hidden="true" />
                <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} required />
              </div>
            </label>

            <label className="field">
              <span>Password</span>
              <div className="input-row">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  type="password"
                  minLength={isRegister ? 8 : undefined}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  required
                />
              </div>
            </label>
          </div>

          {authMutation.isError && (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200">
              Authentication failed. Check that the backend is running and the endpoint is ready.
            </p>
          )}

          <button className="mt-6 h-11 w-full rounded-md bg-white font-semibold text-black transition hover:bg-zinc-200" disabled={authMutation.isPending}>
            {authMutation.isPending ? "Working..." : isRegister ? "Create account" : "Sign in"}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-400">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <Link className="font-semibold text-white hover:text-zinc-300" to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Register"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
