const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export type LoginResponse = {
  access_token: string;
  user: {
    sub: string;
    email: string;
    role: 'admin' | 'user';
    name: string;
  };
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error en la solicitud');
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getSummary(token: string) {
  return apiRequest<{ users: number; groups: number; studies: number; visits: number }>(
    '/reports/summary',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getGroups(token: string) {
  return apiRequest<Array<{ _id: string; name: string; address?: string; hostName?: string }>>(
    '/groups',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function createGroup(
  token: string,
  payload: {
    name: string;
    address?: string;
    hostName?: string;
    leader: string;
  },
) {
  return apiRequest('/groups', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateGroup(
  token: string,
  id: string,
  payload: {
    name?: string;
    address?: string;
    hostName?: string;
    leader?: string;
  },
) {
  return apiRequest(`/groups/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteGroup(token: string, id: string) {
  return apiRequest(`/groups/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getStudies(token: string) {
  return apiRequest<Array<{ _id: string; lesson: string; date: string; group?: { name: string } }>>(
    '/studies',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function createStudy(
  token: string,
  payload: {
    lesson: string;
    date: string;
    leader: string;
    group?: string;
    decisions?: string;
  },
) {
  return apiRequest('/studies', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateStudy(
  token: string,
  id: string,
  payload: {
    lesson?: string;
    date?: string;
    leader?: string;
    group?: string;
    decisions?: string;
  },
) {
  return apiRequest(`/studies/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteStudy(token: string, id: string) {
  return apiRequest(`/studies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getVisits(token: string) {
  return apiRequest<Array<{ _id: string; firstName: string; lastName: string; date: string; address?: string }>>(
    '/visits',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function createVisit(
  token: string,
  payload: {
    firstName: string;
    lastName: string;
    date: string;
    address?: string;
    phone?: string;
    reason?: string;
    group?: string;
  },
) {
  return apiRequest('/visits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateVisit(
  token: string,
  id: string,
  payload: {
    firstName?: string;
    lastName?: string;
    date?: string;
    address?: string;
    phone?: string;
    reason?: string;
    group?: string;
  },
) {
  return apiRequest(`/visits/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteVisit(token: string, id: string) {
  return apiRequest(`/visits/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getUsers(token: string) {
  return apiRequest<Array<{ _id: string; name: string; email: string; role: 'admin' | 'user' }>>(
    '/users',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
