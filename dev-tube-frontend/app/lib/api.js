const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? (
  process.env.NODE_ENV === "development" ? "http://localhost:8000/api/v1" : null
);
const ACCESS_TOKEN_KEY = "devtube_access_token";

function hasBrowser() {
  return typeof window !== "undefined";
}

function getAccessToken() {
  return hasBrowser() ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

function saveAccessToken(token) {
  if (hasBrowser() && token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken() {
  if (hasBrowser()) window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function toQueryString(parameters = {}) {
  const query = new URLSearchParams();

  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "The API URL is not configured. Set NEXT_PUBLIC_API_BASE_URL to your deployed backend URL in Vercel."
    );
  }

  const { headers = {}, retryAfterRefresh = true, ...requestOptions } = options;
  const accessToken = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    credentials: "include",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && retryAfterRefresh && path !== "/users/refresh-token") {
      try {
        await refreshAccessToken();
        return request(path, { ...options, retryAfterRefresh: false });
      } catch {
        clearAccessToken();
      }
    }
    throw new Error(body.message || "An error occurred while processing the request.");
  }

  return body;
}

async function jsonRequest(path, method, payload) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(email, username, password) {
  const response = await jsonRequest("/users/login", "POST", { email, username, password });
  saveAccessToken(response.data?.accessToken);
  return response;
}

export function register(formData) {
  return request("/users/register", { method: "POST", body: formData });
}

export async function logout() {
  try {
    return await request("/users/logout", { method: "POST" });
  } finally {
    clearAccessToken();
  }
}

export async function refreshAccessToken() {
  const response = await request("/users/refresh-token", { method: "POST" });
  saveAccessToken(response.data?.accessToken);
  return response.data;
}

export async function getCurrentUser() {
  const response = await request("/users/current-user");
  return response.data;
}

export async function updateAccount(payload) {
  const response = await jsonRequest("/users/update-account", "PATCH", payload);
  return response.data;
}

export async function changePassword(payload) {
  const response = await jsonRequest("/users/change-password", "POST", payload);
  return response.data;
}

export async function updateAvatar(formData) {
  const response = await request("/users/avatar", { method: "PATCH", body: formData });
  return response.data;
}

export async function getChannelProfile(username) {
  const response = await request(`/users/channel/${encodeURIComponent(username)}`);
  return response.data;
}

export async function getWatchHistory() {
  const response = await request("/users/watch-history");
  return response.data;
}

export async function getVideos(parameters) {
  const response = await request(`/videos/all-videos${toQueryString(parameters)}`);
  return response.data;
}

export async function getVideo(videoId) {
  const response = await request(`/videos/${videoId}`);
  return response.data;
}

export async function publishVideo(formData) {
  const response = await request("/videos/upload-video", { method: "POST", body: formData });
  return response.data;
}

export async function updateVideo(videoId, payload) {
  const response = await jsonRequest(`/videos/update-video/${videoId}`, "PATCH", payload);
  return response.data;
}

export async function deleteVideo(videoId) {
  const response = await request(`/videos/delete-video/${videoId}`, { method: "DELETE" });
  return response.data;
}

export async function getVideoComments(videoId) {
  const response = await request(`/videos/${videoId}/comments`);
  return response.data;
}

export async function addComment(videoId, content) {
  const response = await jsonRequest(`/videos/${videoId}/add-comments`, "POST", { content });
  return response.data;
}

export async function updateComment(videoId, commentId, content) {
  const response = await jsonRequest(`/videos/${videoId}/update-comments/${commentId}`, "PATCH", { content });
  return response.data;
}

export async function deleteComment(videoId, commentId) {
  const response = await request(`/videos/${videoId}/delete-comments/${commentId}`, { method: "DELETE" });
  return response.data;
}

export async function toggleSubscription(channelId) {
  const response = await request(`/subscription/${channelId}/toggle`, { method: "POST" });
  return response.data;
}

export async function getChannelSubscribers(channelId) {
  const response = await request(`/subscription/${channelId}/subscribers`);
  return response.data;
}

export async function getSubscribedChannels(channelId) {
  const response = await request(`/subscription/${channelId}/subscribed-channels`);
  return response.data;
}

export async function getChannelStats(channelId) {
  const response = await request(`/dashboard/${channelId}/stats`);
  return response.data;
}

export async function getChannelVideos(channelId) {
  const response = await request(`/dashboard/${channelId}/videos`);
  return response.data;
}
