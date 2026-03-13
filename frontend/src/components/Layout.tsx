import { Link } from 'react-router-dom';
import { clearSession, getUser } from '../lib/auth';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Iglesia Adventista
            </p>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500">
              {user?.name ?? 'Usuario'} • {user?.role ?? 'user'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              Dashboard
            </Link>
            <Link
              to="/groups"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              Grupos
            </Link>
            <Link
              to="/studies"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              Estudios
            </Link>
            <Link
              to="/visits"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              Visitas
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">{children}</main>
    </div>
  );
}
