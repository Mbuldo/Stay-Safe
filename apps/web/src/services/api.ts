import { ApiResponse } from '@stay-safe/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = false
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data.data as T;
  }

  // Auth endpoints
  async register(userData: any) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: any) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me', {}, true);
  }

  async updateProfile(updates: any) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, true);
  }

  // Assessment endpoints
  async submitAssessment(assessment: any) {
    return this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessment),
    }, true);
  }

  async getAssessmentHistory(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/assessments${query}`, {}, true);
  }

  async getAssessment(id: string) {
    return this.request(`/assessments/${id}`, {}, true);
  }

  // AI endpoints
  async chatWithAI(message: string, history?: any[]) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }, true);
  }

  async getHealthTips() {
    return this.request('/ai/health-tips', { method: 'POST' }, true);
  }

  // Articles endpoints
  async getAllArticles(params?: {
    category?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request(`/articles${query ? `?${query}` : ''}`, {}, false);
  }

  async getArticleBySlug(slug: string) {
    return this.request(`/articles/${slug}`, {}, false);
  }

  async getFeaturedArticles(limit = 6) {
    return this.request(`/articles/featured?limit=${limit}`, {}, false);
  }

  async bookmarkArticle(articleId: string) {
    return this.request(`/articles/${articleId}/bookmark`, {
      method: 'POST',
    }, true);
  }

  async removeBookmark(articleId: string) {
    return this.request(`/articles/${articleId}/bookmark`, {
      method: 'DELETE',
    }, true);
  }

  async getUserBookmarks() {
    return this.request('/articles/bookmarks/me', {}, true);
  }

  // Resources endpoints
  async getAllResources(params?: {
    type?: string;
    category?: string;
    city?: string;
    studentFriendly?: boolean;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.studentFriendly !== undefined) queryParams.append('studentFriendly', params.studentFriendly.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return this.request(`/resources${query ? `?${query}` : ''}`, {}, false);
  }

  async getResourceById(id: string) {
    return this.request(`/resources/${id}`, {}, false);
  }
}

export default new ApiService();