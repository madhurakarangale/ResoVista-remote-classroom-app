import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ============================================
// HEALTH CHECK
// ============================================
app.get("/make-server-66a01e1b/health", (c) => {
  return c.json({ status: "ok", service: "ResoVista Backend" });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Sign Up - Create new user
app.post("/make-server-66a01e1b/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Email, password, name, and role are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role, // student, teacher, or admin
        created_at: new Date().toISOString()
      },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      created_at: new Date().toISOString(),
      profile_complete: false
    });

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get current user profile
app.get("/make-server-66a01e1b/auth/profile", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const profile = await kv.get(`user:${user.id}`);
  return c.json({ user: profile || user });
});

// Update user profile
app.put("/make-server-66a01e1b/auth/profile", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const updates = await c.req.json();
  const existingProfile = await kv.get(`user:${user.id}`) || {};
  
  const updatedProfile = {
    ...existingProfile,
    ...updates,
    id: user.id,
    updated_at: new Date().toISOString()
  };

  await kv.set(`user:${user.id}`, updatedProfile);
  return c.json({ success: true, profile: updatedProfile });
});

// ============================================
// ATTENDANCE ROUTES
// ============================================

// Mark attendance
app.post("/make-server-66a01e1b/attendance/mark", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const { classId, studentId, status, date } = await c.req.json();
  const attendanceId = `attendance:${classId}:${studentId}:${date}`;
  
  const record = {
    classId,
    studentId,
    status,
    date,
    markedBy: user.id,
    timestamp: new Date().toISOString()
  };

  await kv.set(attendanceId, record);
  return c.json({ success: true, record });
});

// Get attendance records
app.get("/make-server-66a01e1b/attendance/:classId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const classId = c.req.param('classId');
  const records = await kv.getByPrefix(`attendance:${classId}:`);
  
  return c.json({ success: true, records });
});

// ============================================
// EXAM/QUIZ ROUTES
// ============================================

// Create exam/quiz
app.post("/make-server-66a01e1b/exams/create", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const examData = await c.req.json();
  const examId = `exam:${Date.now()}`;
  
  const exam = {
    ...examData,
    id: examId,
    createdBy: user.id,
    createdAt: new Date().toISOString()
  };

  await kv.set(examId, exam);
  return c.json({ success: true, exam });
});

// Get all exams
app.get("/make-server-66a01e1b/exams", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const exams = await kv.getByPrefix('exam:');
  return c.json({ success: true, exams });
});

// Submit exam answers
app.post("/make-server-66a01e1b/exams/:examId/submit", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const examId = c.req.param('examId');
  const { answers, timeSpent } = await c.req.json();
  
  const submissionId = `submission:${examId}:${user.id}`;
  const submission = {
    examId,
    studentId: user.id,
    answers,
    timeSpent,
    submittedAt: new Date().toISOString()
  };

  await kv.set(submissionId, submission);
  return c.json({ success: true, submission });
});

// Get exam results
app.get("/make-server-66a01e1b/exams/:examId/results/:studentId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const examId = c.req.param('examId');
  const studentId = c.req.param('studentId');
  const submissionId = `submission:${examId}:${studentId}`;
  
  const submission = await kv.get(submissionId);
  return c.json({ success: true, submission });
});

// ============================================
// MARKS/RESULTS ROUTES
// ============================================

// Add marks
app.post("/make-server-66a01e1b/marks/add", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const { studentId, subject, marks, maxMarks, examType } = await c.req.json();
  const markId = `marks:${studentId}:${subject}:${Date.now()}`;
  
  const record = {
    studentId,
    subject,
    marks,
    maxMarks,
    examType,
    addedBy: user.id,
    date: new Date().toISOString()
  };

  await kv.set(markId, record);
  return c.json({ success: true, record });
});

// Get student marks
app.get("/make-server-66a01e1b/marks/:studentId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const studentId = c.req.param('studentId');
  const marks = await kv.getByPrefix(`marks:${studentId}:`);
  
  return c.json({ success: true, marks });
});

// ============================================
// TODO/ASSIGNMENTS ROUTES
// ============================================

// Create todo/assignment
app.post("/make-server-66a01e1b/todos/create", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const todoData = await c.req.json();
  const todoId = `todo:${user.id}:${Date.now()}`;
  
  const todo = {
    ...todoData,
    id: todoId,
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  await kv.set(todoId, todo);
  return c.json({ success: true, todo });
});

// Get user todos
app.get("/make-server-66a01e1b/todos", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const todos = await kv.getByPrefix(`todo:${user.id}:`);
  return c.json({ success: true, todos });
});

// Update todo
app.put("/make-server-66a01e1b/todos/:todoId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const todoId = c.req.param('todoId');
  const updates = await c.req.json();
  const existingTodo = await kv.get(todoId);
  
  if (!existingTodo || existingTodo.userId !== user.id) {
    return c.json({ error: 'Not found or unauthorized' }, 404);
  }

  const updatedTodo = { ...existingTodo, ...updates, updatedAt: new Date().toISOString() };
  await kv.set(todoId, updatedTodo);
  
  return c.json({ success: true, todo: updatedTodo });
});

// Delete todo
app.delete("/make-server-66a01e1b/todos/:todoId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const todoId = c.req.param('todoId');
  const todo = await kv.get(todoId);
  
  if (!todo || todo.userId !== user.id) {
    return c.json({ error: 'Not found or unauthorized' }, 404);
  }

  await kv.del(todoId);
  return c.json({ success: true });
});

// ============================================
// NOTIFICATIONS ROUTES
// ============================================

// Send notification
app.post("/make-server-66a01e1b/notifications/send", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const { recipientId, title, message, type, priority } = await c.req.json();
  const notificationId = `notification:${recipientId}:${Date.now()}`;
  
  const notification = {
    id: notificationId,
    recipientId,
    senderId: user.id,
    title,
    message,
    type,
    priority,
    read: false,
    createdAt: new Date().toISOString()
  };

  await kv.set(notificationId, notification);
  return c.json({ success: true, notification });
});

// Get user notifications
app.get("/make-server-66a01e1b/notifications", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const notifications = await kv.getByPrefix(`notification:${user.id}:`);
  return c.json({ success: true, notifications });
});

// Mark notification as read
app.put("/make-server-66a01e1b/notifications/:notificationId/read", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const notificationId = c.req.param('notificationId');
  const notification = await kv.get(notificationId);
  
  if (!notification || notification.recipientId !== user.id) {
    return c.json({ error: 'Not found or unauthorized' }, 404);
  }

  notification.read = true;
  notification.readAt = new Date().toISOString();
  await kv.set(notificationId, notification);
  
  return c.json({ success: true, notification });
});

// ============================================
// FEEDBACK ROUTES
// ============================================

// Submit feedback
app.post("/make-server-66a01e1b/feedback/submit", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const feedbackData = await c.req.json();
  const feedbackId = `feedback:${Date.now()}`;
  
  const feedback = {
    ...feedbackData,
    id: feedbackId,
    userId: user.id,
    createdAt: new Date().toISOString()
  };

  await kv.set(feedbackId, feedback);
  return c.json({ success: true, feedback });
});

// Get all feedback (admin only)
app.get("/make-server-66a01e1b/feedback", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const userProfile = await kv.get(`user:${user.id}`);
  if (!userProfile || userProfile.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  const feedback = await kv.getByPrefix('feedback:');
  return c.json({ success: true, feedback });
});

// ============================================
// LAB CERTIFICATES ROUTES
// ============================================

// Issue certificate
app.post("/make-server-66a01e1b/certificates/issue", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const { studentId, labName, score, completionDate } = await c.req.json();
  const certificateId = `certificate:${studentId}:${Date.now()}`;
  
  const certificate = {
    id: certificateId,
    studentId,
    labName,
    score,
    completionDate,
    issuedBy: user.id,
    issuedAt: new Date().toISOString(),
    certificateNumber: `RESOVISTA-${Date.now()}`
  };

  await kv.set(certificateId, certificate);
  return c.json({ success: true, certificate });
});

// Get student certificates
app.get("/make-server-66a01e1b/certificates/:studentId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const studentId = c.req.param('studentId');
  const certificates = await kv.getByPrefix(`certificate:${studentId}:`);
  
  return c.json({ success: true, certificates });
});

// ============================================
// CHAT/MESSAGES ROUTES
// ============================================

// Send message
app.post("/make-server-66a01e1b/chat/send", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const { recipientId, message, type } = await c.req.json();
  const messageId = `message:${Date.now()}`;
  
  const chatMessage = {
    id: messageId,
    senderId: user.id,
    recipientId,
    message,
    type: type || 'text',
    timestamp: new Date().toISOString(),
    read: false
  };

  await kv.set(messageId, chatMessage);
  
  // Store in both sender and recipient message lists
  await kv.set(`chat:${user.id}:${recipientId}:${messageId}`, chatMessage);
  await kv.set(`chat:${recipientId}:${user.id}:${messageId}`, chatMessage);
  
  return c.json({ success: true, message: chatMessage });
});

// Get chat messages
app.get("/make-server-66a01e1b/chat/:otherUserId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const otherUserId = c.req.param('otherUserId');
  const messages = await kv.getByPrefix(`chat:${user.id}:${otherUserId}:`);
  
  return c.json({ success: true, messages });
});

// ============================================
// DOCUMENT MANAGEMENT ROUTES
// ============================================

// Initialize storage bucket on server startup
(async () => {
  const bucketName = 'make-66a01e1b-documents';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    });
    console.log('Created documents storage bucket');
  }
})();

// Upload document
app.post("/make-server-66a01e1b/documents/upload", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-66a01e1b-documents')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from('make-66a01e1b-documents')
      .createSignedUrl(fileName, 31536000);

    // Store document metadata
    const docId = `document:${user.id}:${Date.now()}`;
    const document = {
      id: docId,
      userId: user.id,
      title,
      description,
      category,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath: fileName,
      url: urlData?.signedUrl,
      uploadedAt: new Date().toISOString()
    };

    await kv.set(docId, document);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.error('Document upload error:', error);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

// Get user documents
app.get("/make-server-66a01e1b/documents", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const documents = await kv.getByPrefix(`document:${user.id}:`);
  return c.json({ success: true, documents });
});

// Delete document
app.delete("/make-server-66a01e1b/documents/:docId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const docId = c.req.param('docId');
  const document = await kv.get(docId);
  
  if (!document || document.userId !== user.id) {
    return c.json({ error: 'Not found or unauthorized' }, 404);
  }

  // Delete from storage
  await supabase.storage
    .from('make-66a01e1b-documents')
    .remove([document.storagePath]);

  // Delete metadata
  await kv.del(docId);
  
  return c.json({ success: true });
});

// ============================================
// ANALYTICS & REPORTING ROUTES
// ============================================

// Get student analytics
app.get("/make-server-66a01e1b/analytics/student/:studentId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const studentId = c.req.param('studentId');
  
  // Gather data from different sources
  const marks = await kv.getByPrefix(`marks:${studentId}:`);
  const attendance = await kv.getByPrefix(`attendance:`);
  const certificates = await kv.getByPrefix(`certificate:${studentId}:`);
  
  const analytics = {
    totalMarks: marks.length,
    averageScore: marks.reduce((acc: number, m: any) => acc + (m.marks / m.maxMarks * 100), 0) / marks.length || 0,
    attendanceRecords: attendance.filter((a: any) => a.studentId === studentId).length,
    certificatesEarned: certificates.length,
  };

  return c.json({ success: true, analytics });
});

// Get class analytics (teacher/admin)
app.get("/make-server-66a01e1b/analytics/class/:classId", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const classId = c.req.param('classId');
  const attendance = await kv.getByPrefix(`attendance:${classId}:`);
  
  const analytics = {
    totalStudents: new Set(attendance.map((a: any) => a.studentId)).size,
    totalClasses: new Set(attendance.map((a: any) => a.date)).size,
    averageAttendance: attendance.filter((a: any) => a.status === 'present').length / attendance.length * 100 || 0,
  };

  return c.json({ success: true, analytics });
});

Deno.serve(app.fetch);
