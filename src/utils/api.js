import { initialThreads } from '../data/threads';
import initialUsers from '../data/users.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const isMockMode = !API_BASE_URL;
const MOCK_USERS_KEY = 'ultravsc_mock_users';
const MOCK_THREADS_KEY = 'ultravsc_mock_threads';

const deepClone = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
};

const readLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn(`Unable to read ${key} from storage`, error);
  }
  return fallback ? deepClone(fallback) : fallback;
};

const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to write ${key} to storage`, error);
  }
};

const getMockUsers = () => readLocal(MOCK_USERS_KEY, initialUsers);
const saveMockUsers = (users) => writeLocal(MOCK_USERS_KEY, users);

const getMockThreads = () => readLocal(MOCK_THREADS_KEY, initialThreads);
const saveMockThreads = (threads) => writeLocal(MOCK_THREADS_KEY, threads);

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const buildHeaders = (token, extra = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const request = async (path, { method = 'GET', body, token } = {}) => {
  if (isMockMode) {
    throw new Error('request() should not be used in mock mode');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || data?.error || 'Unknown error';
    throw new Error(message);
  }
  return data;
};

const mockTokenForUser = (userId) => `mock-token-${userId}`;

const buildInitials = (name) => {
  if (!name || name.trim() === '') return 'U';
  const parts = name.trim().split(' ').filter((n) => n);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
};

const buildAuthorProfile = (user) => ({
  name: user.name,
  initials: buildInitials(user.name),
  role: user.role,
});

const ensureMockUser = (payload) => {
  const users = getMockUsers();
  const existing = users.find((u) => u.email === payload.email);
  if (existing) {
    return existing;
  }
  const newUser = {
    id: crypto.randomUUID?.() || Date.now().toString(),
    name: payload.name,
    email: payload.email,
    role: payload.role,
    password: payload.password,
  };
  users.push(newUser);
  saveMockUsers(users);
  return newUser;
};

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const normalizeReply = (reply) => ({
  ...reply,
  author: {
    ...reply.author,
    role: reply.author?.role || reply.authorRole || 'student',
  },
});

const normalizeThread = (thread) => ({
  ...thread,
  author: {
    ...thread.author,
    role: thread.author?.role || thread.authorRole || 'student',
  },
  replies: (thread.replies || []).map(normalizeReply),
});

const mockAuth = {
  async register(payload) {
    await delay();
    if (!payload.email || !payload.password || !payload.name || !payload.role) {
      throw new Error('Thiếu thông tin đăng ký');
    }
    const users = getMockUsers();
    if (users.some((u) => u.email === payload.email)) {
      throw new Error('Email đã tồn tại');
    }
    const newUser = ensureMockUser(payload);
    return {
      user: sanitizeUser(newUser),
      token: mockTokenForUser(newUser.id),
    };
  },
  async login(payload) {
    await delay();
    const users = getMockUsers();
    const user = users.find((u) => u.email === payload.email);
    if (!user || user.password !== payload.password) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    return { user: sanitizeUser(user), token: mockTokenForUser(user.id) };
  },
  async me(token) {
    await delay();
    if (!token?.startsWith('mock-token-')) {
      throw new Error('Token không hợp lệ');
    }
    const userId = token.replace('mock-token-', '');
    const users = getMockUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
    return sanitizeUser(user);
  },
};

const removeReplyRecursive = (replies, replyId) => {
  const idsToRemove = new Set([replyId]);
  let expanded = true;
  while (expanded) {
    expanded = false;
    replies.forEach((reply) => {
      if (reply.parentId && idsToRemove.has(reply.parentId) && !idsToRemove.has(reply.id)) {
        idsToRemove.add(reply.id);
        expanded = true;
      }
    });
  }
  return replies.filter((reply) => !idsToRemove.has(reply.id));
};

const mockThreadsApi = {
  async list() {
    await delay();
    const threads = getMockThreads()
      .map((thread) => normalizeThread(thread))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return threads;
  },
  async getById(_, threadId) {
    await delay();
    const thread = getMockThreads().find((t) => t.id === threadId);
    if (!thread) {
      throw new Error('Không tìm thấy thread');
    }
    return normalizeThread(thread);
  },
  async create(token, payload) {
    await delay();
    const user = await mockAuth.me(token);
    const threads = getMockThreads();
    const now = new Date().toISOString();
    const newThread = {
      id: crypto.randomUUID?.() || `thread-${Date.now()}`,
      category: payload.category,
      title: payload.title,
      content: payload.content,
      attachment: payload.attachment || null,
      authorId: user.id,
      author: buildAuthorProfile(user),
      createdAt: now,
      updatedAt: now,
      replies: [],
    };
    threads.unshift(newThread);
    saveMockThreads(threads);
    return normalizeThread(newThread);
  },
  async update(token, threadId, payload) {
    await delay();
    await mockAuth.me(token);
    const threads = getMockThreads();
    const index = threads.findIndex((t) => t.id === threadId);
    if (index === -1) throw new Error('Không tìm thấy thread');
    const now = new Date().toISOString();
    const updated = {
      ...threads[index],
      category: payload.category ?? threads[index].category,
      title: payload.title ?? threads[index].title,
      content: payload.content ?? threads[index].content,
      attachment: payload.attachment === undefined ? threads[index].attachment : payload.attachment,
      updatedAt: now,
    };
    threads[index] = updated;
    saveMockThreads(threads);
    return normalizeThread(updated);
  },
  async remove(token, threadId) {
    await delay();
    await mockAuth.me(token);
    const threads = getMockThreads().filter((t) => t.id !== threadId);
    saveMockThreads(threads);
    return { success: true };
  },
  async reply(token, threadId, payload) {
    await delay();
    const user = await mockAuth.me(token);
    const threads = getMockThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) throw new Error('Không tìm thấy thread');
    const reply = {
      id: crypto.randomUUID?.() || `reply-${Date.now()}`,
      parentId: payload.parentId || null,
      authorId: user.id,
      author: buildAuthorProfile(user),
      text: payload.text,
      createdAt: new Date().toISOString(),
    };
    thread.replies.push(reply);
    thread.updatedAt = reply.createdAt;
    saveMockThreads(threads);
    return normalizeReply(reply);
  },
  async updateReply(token, threadId, replyId, payload) {
    await delay();
    await mockAuth.me(token);
    const threads = getMockThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) throw new Error('Không tìm thấy thread');
    const reply = thread.replies.find((r) => r.id === replyId);
    if (!reply) throw new Error('Không tìm thấy bình luận');
    reply.text = payload.text;
    reply.editedAt = new Date().toISOString();
    thread.updatedAt = reply.editedAt;
    saveMockThreads(threads);
    return normalizeReply(reply);
  },
  async deleteReply(token, threadId, replyId) {
    await delay();
    await mockAuth.me(token);
    const threads = getMockThreads();
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) throw new Error('Không tìm thấy thread');
    thread.replies = removeReplyRecursive(thread.replies, replyId);
    thread.updatedAt = new Date().toISOString();
    saveMockThreads(threads);
    return { success: true };
  },
};

export const api = {
  registerUser(payload) {
    if (isMockMode) {
      return mockAuth.register(payload);
    }
    return request('/auth/register', { method: 'POST', body: payload });
  },
  loginUser(payload) {
    if (isMockMode) {
      return mockAuth.login(payload);
    }
    return request('/auth/login', { method: 'POST', body: payload });
  },
  getCurrentUser(token) {
    if (isMockMode) {
      return mockAuth.me(token);
    }
    return request('/users/me', { token });
  },
  fetchThreads(token) {
    if (isMockMode) {
      return mockThreadsApi.list();
    }
    return request('/threads', { token });
  },
  fetchThreadById(token, threadId) {
    if (isMockMode) {
      return mockThreadsApi.getById(token, threadId);
    }
    return request(`/threads/${threadId}`, { token });
  },
  createThread(token, payload) {
    if (isMockMode) {
      return mockThreadsApi.create(token, payload);
    }
    return request('/threads', { method: 'POST', token, body: payload });
  },
  updateThread(token, threadId, payload) {
    if (isMockMode) {
      return mockThreadsApi.update(token, threadId, payload);
    }
    return request(`/threads/${threadId}`, { method: 'PUT', token, body: payload });
  },
  deleteThread(token, threadId) {
    if (isMockMode) {
      return mockThreadsApi.remove(token, threadId);
    }
    return request(`/threads/${threadId}`, { method: 'DELETE', token });
  },
  replyToThread(token, threadId, payload) {
    if (isMockMode) {
      return mockThreadsApi.reply(token, threadId, { ...payload, parentId: null });
    }
    return request(`/threads/${threadId}/replies`, { method: 'POST', token, body: payload });
  },
  replyToComment(token, threadId, parentReplyId, payload) {
    if (isMockMode) {
      return mockThreadsApi.reply(token, threadId, { ...payload, parentId: parentReplyId });
    }
    return request(`/threads/${threadId}/replies/${parentReplyId}`, {
      method: 'POST',
      token,
      body: payload,
    });
  },
  editReply(token, threadId, replyId, payload) {
    if (isMockMode) {
      return mockThreadsApi.updateReply(token, threadId, replyId, payload);
    }
    return request(`/threads/${threadId}/replies/${replyId}`, { method: 'PUT', token, body: payload });
  },
  deleteReply(token, threadId, replyId) {
    if (isMockMode) {
      return mockThreadsApi.deleteReply(token, threadId, replyId);
    }
    return request(`/threads/${threadId}/replies/${replyId}`, { method: 'DELETE', token });
  },
};

export const API_CONFIG = {
  baseUrl: API_BASE_URL || 'mock://local',
  mode: isMockMode ? 'mock' : 'live',
};

