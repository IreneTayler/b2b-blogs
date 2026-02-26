import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id?: number | null;
}

export interface Comment {
  id: number;
  article_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export async function fetchArticles(): Promise<Article[]> {
  const { data } = await api.get<Article[]>('/articles');
  return data;
}

export async function fetchArticle(id: string | number): Promise<Article & { comments: Comment[] }> {
  const { data } = await api.get<Article & { comments: Comment[] }>(`/articles/${id}`);
  return data;
}

export async function createArticle(payload: { title: string; content: string }): Promise<Article> {
  const { data } = await api.post<Article>('/articles', payload);
  return data;
}

export async function createComment(
  articleId: string | number,
  payload: { content: string },
): Promise<Comment> {
  const { data } = await api.post<Comment>(`/articles/${articleId}/comments`, payload);
  return data;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/register', payload);
  return data;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/login', payload);
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post('/logout');
}

export async function unsubscribeUser(payload: {
  email: string;
  password: string;
}): Promise<void> {
  await api.post('/unsubscribe', payload);
}

