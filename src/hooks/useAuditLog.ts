import { useAppStore } from '@/store';

/**
 * Audit Log Types
 */
export type AuditEventType =
  | 'CREATE_LEAD'
  | 'UPDATE_LEAD'
  | 'DELETE_LEAD'
  | 'CREATE_CAMPAIGN'
  | 'UPDATE_CAMPAIGN'
  | 'SEND_MESSAGE'
  | 'AI_ACTION'
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'EXPORT_DATA'
  | 'IMPORT_DATA';

export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  userId: string;
  userName: string;
  eventType: AuditEventType;
  resourceType: string;
  resourceId: string;
  action: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

/**
 * useAuditLog Hook
 * Logs user actions to backend audit trail
 */
export const useAuditLog = () => {
  const authUser = useAppStore((state) => state.authUser);

  const logAction = async (
    eventType: AuditEventType,
    resourceType: string,
    resourceId: string,
    action: string,
    metadata?: Record<string, any>
  ) => {
    if (!authUser) {
      console.warn('Cannot log audit action: user not authenticated');
      return;
    }

    const logEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId: authUser.id,
      userName: authUser.name,
      eventType,
      resourceType,
      resourceId,
      action,
      metadata,
    };

    try {
      // Send to backend audit log endpoint
      // This should be implemented on backend: POST /api/audit-logs
      if (import.meta.env.DEV) {
        console.debug('[AuditLog]', logEntry);
      }

      // Uncomment when backend is ready:
      // await api.post('/audit-logs', logEntry);
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  };

  return { logAction };
};

/**
 * Hook to log API errors for debugging
 */
export const useErrorLog = () => {
  const authUser = useAppStore((state) => state.authUser);

  const logError = async (
    error: any,
    context: string,
    metadata?: Record<string, any>
  ) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      userId: authUser?.id || 'anonymous',
      context,
      message: error?.message || String(error),
      stack: error?.stack,
      metadata,
    };

    try {
      if (import.meta.env.DEV) {
        console.error('[ErrorLog]', errorLog);
      }

      // Send to backend error log endpoint when ready:
      // await api.post('/error-logs', errorLog);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  return { logError };
};

/**
 * Hook to log AI actions (prompts, responses, decisions)
 */
export const useAILog = () => {
  const authUser = useAppStore((state) => state.authUser);

  const logAIAction = async (
    action: string,
    prompt?: string,
    response?: any,
    metadata?: Record<string, any>
  ) => {
    const aiLog = {
      timestamp: new Date().toISOString(),
      userId: authUser?.id || 'anonymous',
      action,
      prompt,
      response,
      metadata,
    };

    try {
      if (import.meta.env.DEV) {
        console.debug('[AILog]', aiLog);
      }

      // Send to backend AI log endpoint when ready:
      // await api.post('/ai-logs', aiLog);
    } catch (error) {
      console.error('Failed to log AI action:', error);
    }
  };

  return { logAIAction };
};

/**
 * Hook to log message sending (email, SMS, etc.)
 */
export const useMessageLog = () => {
  const authUser = useAppStore((state) => state.authUser);
  const { logAction } = useAuditLog();

  const logMessageSent = async (
    leadId: string,
    leadName: string,
    messageType: 'email' | 'sms' | 'linkedin' | 'phone',
    template?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      // Log via audit trail
      await logAction(
        'SEND_MESSAGE',
        'lead',
        leadId,
        `Sent ${messageType} to ${leadName}`,
        {
          messageType,
          template,
          ...metadata,
        }
      );

      if (import.meta.env.DEV) {
        console.debug(`[MessageLog] Sent ${messageType} to ${leadName}`);
      }
    } catch (error) {
      console.error('Failed to log message:', error);
    }
  };

  return { logMessageSent };
};
