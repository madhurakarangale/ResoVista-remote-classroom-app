import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client instance
export const supabase = createSupabaseClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Server API base URL
export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-66a01e1b`;

// Helper function to make authenticated API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  // Sign up new user
  async signUp(email: string, password: string, name: string, role: 'student' | 'teacher' | 'admin') {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return session;
  },

  // Get user profile
  async getProfile() {
    return apiCall('/auth/profile');
  },

  // Update profile
  async updateProfile(updates: any) {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ============================================
// ATTENDANCE API
// ============================================

export const attendanceAPI = {
  // Mark attendance
  async mark(classId: string, studentId: string, status: 'present' | 'absent' | 'late', date: string) {
    return apiCall('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ classId, studentId, status, date }),
    });
  },

  // Get attendance records for a class
  async getByClass(classId: string) {
    return apiCall(`/attendance/${classId}`);
  },
};

// ============================================
// EXAM/QUIZ API
// ============================================

export const examAPI = {
  // Create new exam
  async create(examData: any) {
    return apiCall('/exams/create', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  // Get all exams
  async getAll() {
    return apiCall('/exams');
  },

  // Submit exam answers
  async submit(examId: string, answers: any[], timeSpent: number) {
    return apiCall(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent }),
    });
  },

  // Get exam results
  async getResults(examId: string, studentId: string) {
    return apiCall(`/exams/${examId}/results/${studentId}`);
  },
};

// ============================================
// MARKS API
// ============================================

export const marksAPI = {
  // Add marks
  async add(studentId: string, subject: string, marks: number, maxMarks: number, examType: string) {
    return apiCall('/marks/add', {
      method: 'POST',
      body: JSON.stringify({ studentId, subject, marks, maxMarks, examType }),
    });
  },

  // Get student marks
  async getByStudent(studentId: string) {
    return apiCall(`/marks/${studentId}`);
  },
};

// ============================================
// TODO API
// ============================================

export const todoAPI = {
  // Create todo
  async create(todoData: any) {
    return apiCall('/todos/create', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  },

  // Get all todos
  async getAll() {
    return apiCall('/todos');
  },

  // Update todo
  async update(todoId: string, updates: any) {
    return apiCall(`/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete todo
  async delete(todoId: string) {
    return apiCall(`/todos/${todoId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsAPI = {
  // Send notification
  async send(recipientId: string, title: string, message: string, type: string, priority: string) {
    return apiCall('/notifications/send', {
      method: 'POST',
      body: JSON.stringify({ recipientId, title, message, type, priority }),
    });
  },

  // Get user notifications
  async getAll() {
    return apiCall('/notifications');
  },

  // Mark as read
  async markRead(notificationId: string) {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};

// ============================================
// FEEDBACK API
// ============================================

export const feedbackAPI = {
  // Submit feedback
  async submit(feedbackData: any) {
    return apiCall('/feedback/submit', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  // Get all feedback (admin only)
  async getAll() {
    return apiCall('/feedback');
  },
};

// ============================================
// CERTIFICATES API
// ============================================

export const certificatesAPI = {
  // Issue certificate
  async issue(studentId: string, labName: string, score: number, completionDate: string) {
    return apiCall('/certificates/issue', {
      method: 'POST',
      body: JSON.stringify({ studentId, labName, score, completionDate }),
    });
  },

  // Get student certificates
  async getByStudent(studentId: string) {
    return apiCall(`/certificates/${studentId}`);
  },
};

// ============================================
// CHAT API
// ============================================

export const chatAPI = {
  // Send message
  async send(recipientId: string, message: string, type = 'text') {
    return apiCall('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ recipientId, message, type }),
    });
  },

  // Get chat messages
  async getMessages(otherUserId: string) {
    return apiCall(`/chat/${otherUserId}`);
  },
};

// ============================================
// DOCUMENTS API
// ============================================

export const documentsAPI = {
  // Upload document
  async upload(file: File, title: string, description: string, category: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  // Get user documents
  async getAll() {
    return apiCall('/documents');
  },

  // Delete document
  async delete(docId: string) {
    return apiCall(`/documents/${docId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  // Get student analytics
  async getStudent(studentId: string) {
    return apiCall(`/analytics/student/${studentId}`);
  },

  // Get class analytics
  async getClass(classId: string) {
    return apiCall(`/analytics/class/${classId}`);
  },
};
