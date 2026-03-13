import { useEffect, useMemo, useState } from 'react';
import { getGroups, getStudies, getSummary, getVisits } from '../lib/api';
import { getToken, getUser } from '../lib/auth';
import { Layout } from '../components/Layout';
import { generateSummaryPdf } from '../lib/reportPdf';

type Summary = { users: number; groups: number; studies: number; visits: number };

export function Dashboard() {
  const token = useMemo(() => getToken(), []);
  const user = useMemo(() => getUser(), []);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [groups, setGroups] = useState<Array<{ _id: string; name: string; address?: string }>>([]);
  const [studies, setStudies] = useState<Array<{ _id: string; lesson: string; date: string; group?: { name: string } }>>([]);
  const [visits, setVisits] = useState<Array<{ _id: string; firstName: string; lastName: string; date: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const requests: Promise<unknown>[] = [
          getGroups(token),
          getStudies(token),
          getVisits(token),
        ];

        if (user?.role === 'admin') {
          requests.unshift(getSummary(token));
        }

        const results = await Promise.all(requests);

        if (user?.role === 'admin') {
          setSummary(results[0] as Summary);
          setGroups(results[1] as typeof groups);
          setStudies(results[2] as typeof studies);
          setVisits(results[3] as typeof visits);
        } else {
          setGroups(results[0] as typeof groups);
          setStudies(results[1] as typeof studies);
          setVisits(results[2] as typeof visits);
          setSummary({
            users: 0,
            groups: (results[0] as typeof groups).length,
            studies: (results[1] as typeof studies).length,
            visits: (results[2] as typeof visits).length,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      }
    };
    load();
  }, [token, user?.role]);

  return (
    <Layout title="Panel administrativo">
      {user?.role === 'admin' && summary && (
        <div className="flex justify-end">
          <button
            onClick={() => generateSummaryPdf(summary, groups, studies, visits)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Descargar reporte PDF
          </button>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Grupos pequeños', value: summary?.groups ?? '-' },
            { label: 'Estudios bíblicos', value: summary?.studies ?? '-' },
            { label: 'Visitas', value: summary?.visits ?? '-' },
            { label: 'Usuarios', value: summary?.users ?? '-' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Grupos</h2>
              <span className="text-xs text-slate-500">
                {groups.length} en total
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {groups.slice(0, 4).map((group) => (
                <div
                  key={group._id}
                  className="rounded-lg bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-900">{group.name}</p>
                  <p>{group.address ?? 'Sin dirección'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Estudios
              </h2>
              <span className="text-xs text-slate-500">
                {studies.length} registros
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {studies.slice(0, 4).map((study) => (
                <div
                  key={study._id}
                  className="rounded-lg bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-900">{study.lesson}</p>
                  <p>
                    {new Date(study.date).toLocaleDateString()} •{' '}
                    {study.group?.name ?? 'Sin grupo'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Visitas</h2>
              <span className="text-xs text-slate-500">
                {visits.length} registros
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {visits.slice(0, 4).map((visit) => (
                <div
                  key={visit._id}
                  className="rounded-lg bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-900">
                    {visit.firstName} {visit.lastName}
                  </p>
                  <p>{new Date(visit.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </Layout>
  );
}
