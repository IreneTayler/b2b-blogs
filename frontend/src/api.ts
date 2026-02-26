import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  author_name: string;
  content: string;
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
  payload: { author_name: string; content: string },
): Promise<Comment> {
  const { data } = await api.post<Comment>(`/articles/${articleId}/comments`, payload);
  return data;
}

