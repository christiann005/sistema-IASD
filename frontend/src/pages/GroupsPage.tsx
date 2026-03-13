import { useEffect, useMemo, useState } from 'react';
import {
  createGroup,
  deleteGroup,
  getGroups,
  getUsers,
  updateGroup,
} from '../lib/api';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { getToken, getUser } from '../lib/auth';

type Group = { _id: string; name: string; address?: string; hostName?: string };
type User = { _id: string; name: string; email: string; role: 'admin' | 'user' };

export function GroupsPage() {
  const token = useMemo(() => getToken(), []);
  const currentUser = useMemo(() => getUser(), []);
  const isAdmin = currentUser?.role === 'admin';
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    hostName: '',
    leader: '',
  });

  const load = async () => {
    if (!token) return;
    try {
      const [groupsData, usersData] = await Promise.all([
        getGroups(token),
        isAdmin ? getUsers(token) : Promise.resolve([]),
      ]);
      setGroups(groupsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar grupos');
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const resetForm = () => {
    setForm({ name: '', address: '', hostName: '', leader: '' });
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    try {
      if (editing) {
        await updateGroup(token, editing._id, {
          name: form.name,
          address: form.address || undefined,
          hostName: form.hostName || undefined,
          leader: form.leader || undefined,
        });
      } else {
        await createGroup(token, {
          name: form.name,
          address: form.address || undefined,
          hostName: form.hostName || undefined,
          leader: form.leader,
        });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleEdit = (group: Group) => {
    setEditing(group);
    setForm({
      name: group.name,
      address: group.address ?? '',
      hostName: group.hostName ?? '',
      leader: '',
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteGroup(token, id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const filtered = groups.filter((group) => {
    const value = `${group.name} ${group.address ?? ''} ${group.hostName ?? ''}`
      .toLowerCase()
      .trim();
    return value.includes(search.toLowerCase());
  });
  const pageSize = 6;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return (
    <Layout title="Grupos pequeños">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Listado</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, dirección o anfitrión"
            className="w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          {isAdmin && (
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Nuevo grupo
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
        title={editing ? 'Editar grupo' : 'Nuevo grupo'}
        open={open}
        onClose={resetForm}
      >
        {isAdmin && (
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Nombre del grupo
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Anfitrión
              </label>
              <input
                value={form.hostName}
                onChange={(e) => setForm({ ...form, hostName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Dirección
              </label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
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
        {paginated.map((group) => (
          <div
            key={group._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {group.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {group.address ?? 'Sin dirección'}
                </p>
                <p className="text-sm text-slate-500">
                  Anfitrión: {group.hostName ?? 'Sin asignar'}
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(group._id)}
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
