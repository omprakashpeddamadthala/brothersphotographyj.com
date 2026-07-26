const BASE_URL =
  (window as any).__ENV__?.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://brothersphotographyj-api.up.railway.app/api/v1';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('cms_admin_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('cms_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    const errData = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(errData.message || `API error (${response.status})`);
  }

  const json = await response.json();
  return json.data as T;
}

export async function uploadMedia(file: File, folder = 'general'): Promise<{ url: string; publicId: string }> {
  const token = localStorage.getItem('cms_admin_token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch(`${BASE_URL}/admin/media/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: 'Image upload failed' }));
    throw new Error(errData.message || `Image upload failed (${response.status})`);
  }

  const json = await response.json();
  return json.data;
}
