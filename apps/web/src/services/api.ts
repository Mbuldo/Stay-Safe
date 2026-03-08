import { ApiResponse } from '@stay-safe/shared';

const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL =
  configuredApiBaseUrl || (import.meta.env.DEV ? '/api' : 'http://localhost:3000/api');

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

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = false
  ): Promise<T> {
    const requestUrl = `${API_BASE_URL}${endpoint}`;
    let response: Response;
    try {
      response = await fetch(requestUrl, {
        ...options,
        headers: {
          ...this.getHeaders(includeAuth),
          ...options.headers,
        },
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          `Network error while contacting API at ${requestUrl}. Confirm the API server is running and CORS/API URL settings are correct.`
        );
      }
      throw error;
    }

    const rawBody = await response.text();
    let data: ApiResponse<T> | null = null;
    if (rawBody) {
      try {
        data = JSON.parse(rawBody) as ApiResponse<T>;
      } catch (error) {
        const preview = rawBody.replace(/\s+/g, ' ').slice(0, 180);
        if (!response.ok) {
          throw new Error(
            `API request failed (${response.status}) at ${requestUrl}. Non-JSON response: ${preview}`
          );
        }
        throw new Error(
          `API returned a non-JSON response (${response.status}) from ${requestUrl}: ${preview}`
        );
      }
    }

    if (!data) {
      throw new Error(`API returned an empty response (${response.status}) from ${requestUrl}`);
    }

    if (!response.ok || !data.success) {
      const error = new Error(
        data.error?.message || `Request failed with status ${response.status}`
      );
      (error as any).details = data.error?.details;
      throw error;
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

  async getAssessmentQuestions(category?: string) {
    const endpoint = category ? `/assessments/questions/${category}` : '/assessments/questions';
    return this.request(endpoint, {}, true);
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

  async getAIStatus() {
    return this.request('/ai/status', {}, true);
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
