const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();

const sessionKey = "peskova-supabase-session";

export const isCloudConfigured = Boolean(
  supabaseUrl && supabaseKey && adminEmail,
);

function headers(accessToken, extra = {}) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${accessToken || supabaseKey}`,
    ...extra,
  };
}

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(sessionKey));
    if (!session?.access_token) return null;
    if (session.expires_at && Date.now() >= session.expires_at) {
      localStorage.removeItem(sessionKey);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function consumeAuthRedirect() {
  if (!window.location.hash.startsWith("#access_token=")) return readSession();
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  if (!accessToken) return null;
  const expiresIn = Number(params.get("expires_in") || 3600);
  const session = {
    access_token: accessToken,
    refresh_token: params.get("refresh_token"),
    expires_at: Date.now() + expiresIn * 1000,
  };
  localStorage.setItem(sessionKey, JSON.stringify(session));
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#/admin`,
  );
  return session;
}

export function getCloudSession() {
  return readSession();
}

export async function getCloudUser(session = readSession()) {
  if (!isCloudConfigured || !session) return null;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: headers(session.access_token),
  });
  if (!response.ok) {
    localStorage.removeItem(sessionKey);
    return null;
  }
  return response.json();
}

export async function requestAdminLink(email) {
  if (!isCloudConfigured) throw new Error("Supabase не настроен");
  if (email.trim().toLowerCase() !== adminEmail) {
    throw new Error("Этот email не имеет доступа к кабинету");
  }
  const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
    method: "POST",
    headers: headers(null, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      email: adminEmail,
      create_user: true,
      data: { role: "portfolio_admin" },
    }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.msg || result.message || "Не удалось отправить ссылку");
  }
}

export async function signOutCloud() {
  const session = readSession();
  localStorage.removeItem(sessionKey);
  if (!session || !isCloudConfigured) return;
  await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: "POST",
    headers: headers(session.access_token),
  }).catch(() => {});
}

export async function loadCloudContent() {
  if (!isCloudConfigured) return null;
  const response = await fetch(
    `${supabaseUrl}/rest/v1/site_content?id=eq.main&select=content`,
    { headers: headers() },
  );
  if (!response.ok) throw new Error("Не удалось загрузить данные сайта");
  const rows = await response.json();
  return rows[0]?.content || null;
}

export async function saveCloudContent(content) {
  const session = readSession();
  if (!isCloudConfigured || !session) {
    throw new Error("Войдите в кабинет по ссылке из письма");
  }
  const response = await fetch(
    `${supabaseUrl}/rest/v1/site_content?on_conflict=id`,
    {
      method: "POST",
      headers: headers(session.access_token, {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify([{ id: "main", content }]),
    },
  );
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Не удалось сохранить настройки");
  }
}

export async function uploadPortfolioImage(file) {
  if (!isCloudConfigured) return fileToDataUrl(file);
  const session = readSession();
  if (!session) throw new Error("Сначала войдите в кабинет");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/portfolio-images/${path}`,
    {
      method: "POST",
      headers: headers(session.access_token, {
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      }),
      body: file,
    },
  );
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Не удалось загрузить изображение");
  }
  return `${supabaseUrl}/storage/v1/object/public/portfolio-images/${path}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}
