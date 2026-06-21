export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string | null;
  ownerEmail: string;
  memberCount: number;
  boardCount: number;
  createdAt: string | null;
}

export interface WorkspaceRequest {
  name: string;
  description?: string;
}

export interface BoardResponse {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  taskCount: number;
  createdAt: string | null;
}

export interface BoardRequest {
  name: string;
  description?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  boardId: string;
  assigneeEmail: string | null;
  dueDate: string | null;
  createdAt: string | null;
}

export interface TaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  assigneeId?: string;
  dueDate?: string;
}

export interface AttachmentResponse {
  id: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedByEmail: string;
  createdAt: string | null;
}

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  s3Key: string;
  attachmentId: string;
}
