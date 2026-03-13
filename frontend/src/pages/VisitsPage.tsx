import { useEffect, useMemo, useState } from 'react';
import {
  createVisit,
  deleteVisit,
  getGroups,
  getVisits,
  updateVisit,
} from '../lib/api';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { getToken, getUser } from '../lib/auth';

type Visit = {
  _id: string;
  firstName: string;
  lastName: string;
  date: string;
  address?: string;
  phone?: string;
  reason?: string;
};
type Group = { _id: string; name: string };

export function VisitsPage() {
  const token = useMemo(() => getToken(), []);
  const currentUser = useMemo(() => getUser(), []);
  const isAdmin = currentUser?.role === 'admin';
  const [visits, setVisits] = useState<Visit[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Visit | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    date: '',
    address: '',
    phone: '',
    reason: '',
    group: '',
  });

  const load = async () => {
    if (!token) return;
    try {
      const [visitData, groupData] = await Promise.all([
        getVisits(token),
        getGroups(token),
      ]);
      setVisits(visitData);
      setGroups(groupData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar visitas');
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const resetForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      date: '',
      address: '',
      phone: '',
      reason: '',
      group: '',
    });
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    try {
      if (editing) {
        await updateVisit(token, editing._id, {
          firstName: form.firstName,
          lastName: form.lastName,
          date: form.date,
          address: form.address || undefined,
          phone: form.phone || undefined,
          reason: form.reason || undefined,
          group: form.group || undefined,
        });
      } else {
        await createVisit(token, {
          firstName: form.firstName,
          lastName: form.lastName,
          date: form.date,
          address: form.address || undefined,
          phone: form.phone || undefined,
          reason: form.reason || undefined,
          group: form.group || undefined,
        });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleEdit = (visit: Visit) => {
    setEditing(visit);
    setForm({
      firstName: visit.firstName,
      lastName: visit.lastName,
      date: visit.date.slice(0, 10),
      address: visit.address ?? '',
      phone: visit.phone ?? '',
      reason: visit.reason ?? '',
      group: '',
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteVisit(token, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const filtered = visits.filter((visit) => {
    const value = `${visit.firstName} ${visit.lastName} ${visit.address ?? ''}`
      .toLowerCase()
      .trim();
    return value.includes(search.toLowerCase());
  });
  const pageSize = 6;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return (
    <Layout title="Visitas">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Listado</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre o dirección"
            className="w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          {isAdmin && (
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Nueva visita
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Modal
        title={editing ? 'Editar visita' : 'Nueva visita'}
        open={open}
        onClose={resetForm}
      >
        {isAdmin && (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Nombre</label>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Apellido</label>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Fecha</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Grupo</label>
              <select
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Sin grupo</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Dirección</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Teléfono</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Motivo</label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {editing ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>

      <div className="grid gap-4 lg:grid-cols-2">
        {paginated.map((visit) => (
          <div
            key={visit._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {visit.firstName} {visit.lastName}
                </h3>
                <p className="text-sm text-slate-500">
                  {new Date(visit.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-500">
                  {visit.address ?? 'Sin dirección'}
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(visit)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(visit._id)}
                    className="rounded-lg border border-rose-200 px-3 py-1 text-xs text-rose-600"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
      />
    </Layout>
  );
}
