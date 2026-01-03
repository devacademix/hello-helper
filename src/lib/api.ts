import { AuthResponse, LoginCredentials } from '@/types';

const API_BASE_URL = 'https://sehat.devacademix.com/api';
const REQUEST_TIMEOUT = 15000;

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        this.setToken(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Unauthorized - Please login again');
      }

      if (response.status === 403) {
        throw new Error('Access denied - You do not have permission');
      }

      if (response.status >= 500) {
        throw new Error('Server error - Please try again later');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - Please check your connection');
      }
      throw error;
    }
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for uploads

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.access_token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
      localStorage.removeItem('user');
    }
  }

  async getProfile<T>(): Promise<T> {
    return this.request<T>('/profile');
  }

  async updateProfile<T>(data: Partial<T>): Promise<T> {
    return this.request<T>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Super Admin endpoints
  async getSuperAdminDashboard<T>(): Promise<T> {
    return this.request<T>('/superadmin/dashboard');
  }

  async getHospitals<T>(): Promise<T> {
    return this.request<T>('/hospitals');
  }

  async getSubscriptions<T>(): Promise<T> {
    return this.request<T>('/subscriptions');
  }

  async updateSubscription<T>(id: number, data: unknown): Promise<T> {
    return this.request<T>(`/subscription/update`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data as object }),
    });
  }

  async getTransactions<T>(): Promise<T> {
    return this.request<T>('/transactions');
  }

  // Admin endpoints
  async getAdminDashboard<T>(): Promise<T> {
    return this.request<T>('/admin/dashboard');
  }

  async getAppointments<T>(): Promise<T> {
    return this.request<T>('/appointments');
  }

  async getPatients<T>(): Promise<T> {
    return this.request<T>('/patients');
  }

  async getDoctors<T>(): Promise<T> {
    return this.request<T>('/doctors');
  }

  async assignBed<T>(data: { bed_id: number; patient_id: number }): Promise<T> {
    return this.request<T>('/bed/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBedStatus<T>(): Promise<T> {
    return this.request<T>('/bed/status');
  }

  // Doctor endpoints
  async getDoctorAppointments<T>(): Promise<T> {
    return this.request<T>('/doctor/appointments');
  }

  async createLiveConsultation<T>(data: unknown): Promise<T> {
    return this.request<T>('/live-consultation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPrescriptions<T>(): Promise<T> {
    return this.request<T>('/prescriptions');
  }

  async getReports<T>(): Promise<T> {
    return this.request<T>('/reports');
  }

  async uploadDocument<T>(file: File, metadata?: object): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    return this.uploadRequest<T>('/upload', formData);
  }

  async getCases<T>(): Promise<T> {
    return this.request<T>('/cases');
  }

  // Patient endpoints
  async createAppointment<T>(data: unknown): Promise<T> {
    return this.request<T>('/appointment/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdmissions<T>(): Promise<T> {
    return this.request<T>('/admissions');
  }
}

export const api = new ApiClient();
