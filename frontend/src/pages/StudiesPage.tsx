import { useEffect, useMemo, useState } from 'react';
import {
  createStudy,
  deleteStudy,
  getGroups,
  getStudies,
  getUsers,
  updateStudy,
} from '../lib/api';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { getToken, getUser } from '../lib/auth';

type Study = {
  _id: string;
  lesson: string;
  date: string;
  group?: { name: string };
};

type Group = { _id: string; name: string };
type User = { _id: string; name: string; email: string; role: 'admin' | 'user' };

export function StudiesPage() {
  const token = useMemo(() => getToken(), []);
  const currentUser = useMemo(() => getUser(), []);
  const isAdmin = currentUser?.role === 'admin';
  const [studies, setStudies] = useState<Study[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Study | null>(null);
  const [form, setForm] = useState({
    lesson: '',
    date: '',
    group: '',
    leader: '',
    decisions: '',
  });

  const load = async () => {
    if (!token) return;
    try {
      const [studyData, groupData, userData] = await Promise.all([
        getStudies(token),
        getGroups(token),
        isAdmin ? getUsers(token) : Promise.resolve([]),
      ]);
      setStudies(studyData);
      setGroups(groupData);
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudios');
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const resetForm = () => {
    setForm({ lesson: '', date: '', group: '', leader: '', decisions: '' });
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    try {
      if (editing) {
        await updateStudy(token, editing._id, {
          lesson: form.lesson,
          date: form.date,
          group: form.group || undefined,
          leader: form.leader || undefined,
          decisions: form.decisions || undefined,
        });
      } else {
        await createStudy(token, {
          lesson: form.lesson,
          date: form.date,
          group: form.group || undefined,
          leader: form.leader,
          decisions: form.decisions || undefined,
        });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleEdit = (study: Study) => {
    setEditing(study);
    setForm({
      lesson: study.lesson,
      date: study.date.slice(0, 10),
      group: '',
      leader: '',
      decisions: '',
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteStudy(token, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const filtered = studies.filter((study) => {
    const value = `${study.lesson} ${study.group?.name ?? ''}`
      .toLowerCase()
      .trim();
    return value.includes(search.toLowerCase());
  });
  const pageSize = 6;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return (
    <Layout title="Estudios bíblicos">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Listado</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por lección o grupo"
            className="w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          {isAdmin && (
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Nuevo estudio
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
        title={editing ? 'Editar estudio' : 'Nuevo estudio'}
        open={open}
        onClose={resetForm}
      >
        {isAdmin && (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Lección</label>
              <input
                required
                value={form.lesson}
                onChange={(e) => setForm({ ...form, lesson: e.target.value })}
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
              <label className="text-sm font-medium text-slate-700">Líder</label>
              <select
                required={!editing}
                value={form.leader}
                onChange={(e) => setForm({ ...form, leader: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Seleccionar</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Decisiones
              </label>
              <input
                value={form.decisions}
                onChange={(e) => setForm({ ...form, decisions: e.target.value })}
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
        {paginated.map((study) => (
          <div
            key={study._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {study.lesson}
                </h3>
                <p className="text-sm text-slate-500">
                  {new Date(study.date).toLocaleDateString()} •{' '}
                  {study.group?.name ?? 'Sin grupo'}
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(study)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(study._id)}
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
