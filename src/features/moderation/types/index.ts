export type ModerationAction = 
  | 'APPROVE'
  | 'REMOVE'
  | 'HIDE'
  | 'PIN'
  | 'UNPIN'
  | 'LOCK'
  | 'UNLOCK'
  | 'WARN_USER'
  | 'BAN_USER'
  | 'UNBAN_USER';

export type ReportReason = 
  | 'SPAM'
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'MISINFORMATION'
  | 'OFF_TOPIC'
  | 'DUPLICATE'
  | 'OTHER';

export type ModerationStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REMOVED'
  | 'HIDDEN'
  | 'LOCKED';

export interface ModerationLog {
  id: string;
  moderatorId: string;
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  action: ModerationAction;
  reason?: string;
  details?: string;
  createdAt: Date;
  
  // Relations
  moderator: {
    id: string;
    name: string;
  };
}

export interface Report {
  id: string;
  reporterId?: string; // null pour rapports anonymes
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  reason: ReportReason;
  description?: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  
  // Relations
  reporter?: {
    id: string;
    name: string;
  };
}

export interface ModerationQueue {
  id: string;
  type: 'POST' | 'COMMENT' | 'REPORT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: ModerationStatus;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Contenu à modérer
  post?: {
    id: string;
    content: string;
    authorName: string;
    reportCount: number;
  };
  comment?: {
    id: string;
    content: string;
    authorName: string;
    postId: string;
    reportCount: number;
  };
  report?: Report;
}

export interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedToday: number;
  averageResponseTime: number; // en heures
  topReasons: Array<{
    reason: ReportReason;
    count: number;
  }>;
  moderatorActivity: Array<{
    moderatorId: string;
    moderatorName: string;
    actionsCount: number;
  }>;
}

export interface AutoModerationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  conditions: AutoModerationCondition[];
  actions: AutoModerationAction[];
  createdBy: string;
  createdAt: Date;
}

export interface AutoModerationCondition {
  type: 'KEYWORD' | 'REGEX' | 'SCORE' | 'USER_KARMA' | 'REPORT_COUNT';
  operator: 'CONTAINS' | 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'MATCHES';
  value: string | number;
  caseSensitive?: boolean;
}

export interface AutoModerationAction {
  type: 'FLAG' | 'HIDE' | 'REMOVE' | 'NOTIFY_MODERATORS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message?: string;
}

export interface PinnedPost {
  id: string;
  postId: string;
  pinnedBy: string;
  pinnedAt: Date;
  expiresAt?: Date;
  reason?: string;
  isGlobal: boolean; // true = épinglé partout, false = épinglé dans une zone
  zoneId?: string;
  
  // Relations
  post: {
    id: string;
    content: string;
    authorName: string;
    zone?: string;
  };
  pinnedByUser: {
    id: string;
    name: string;
  };
}
