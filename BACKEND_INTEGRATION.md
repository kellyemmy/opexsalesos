# Backend Integration Guide

This document explains how to use the new backend integration patterns in opexsalesos.

## Table of Contents

1. [API Client](#api-client)
2. [State Management](#state-management)
3. [Authentication & Protected Routes](#authentication--protected-routes)
4. [Data Fetching](#data-fetching)
5. [Form Handling](#form-handling)
6. [Tables & Lists](#tables--lists)
7. [Error Handling](#error-handling)
8. [Audit Logging](#audit-logging)
9. [Environment Configuration](#environment-configuration)

---

## API Client

The API client is configured in `src/lib/api.ts` with automatic JWT token injection and refresh token handling.

### Basic Usage

```typescript
import api from '@/lib/api';

// GET request
const response = await api.get('/leads');

// POST request with data
await api.post('/leads', { name: 'John', email: 'john@example.com' });

// PUT request
await api.put('/leads/123', { status: 'qualified' });

// DELETE request
await api.delete('/leads/123');
```

### Features

- **Auto JWT Injection**: Access token automatically added to all requests
- **Token Refresh**: Automatically refreshes expired access tokens
- **Error Normalization**: All errors follow consistent format
- **Request Timeout**: 30s default timeout (configurable via `VITE_API_TIMEOUT`)
- **Credentials**: Includes cookies for refresh token (httpOnly)

### Error Handling

```typescript
try {
  await api.post('/leads', data);
} catch (error) {
  console.error(error.status); // HTTP status code
  console.error(error.message); // Normalized error message
  console.error(error.data); // Backend response data
}
```

---

## State Management

Use Zustand for lightweight UI and auth state. Delegate server state to React Query.

### Auth State

```typescript
import { useAppStore } from '@/store';

const MyComponent = () => {
  const { authUser, isAuthenticated, logout } = useAppStore();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return <div>Welcome, {authUser?.name}</div>;
};
```

### Initialize Auth on App Startup

Done automatically in `App.tsx`, but if needed:

```typescript
const { initializeAuth } = useAppStore();

useEffect(() => {
  initializeAuth(); // Loads user from localStorage
}, []);
```

### Check User Roles

```typescript
import { useAppStore, useHasRole } from '@/store';

const MyComponent = () => {
  const hasAdminRole = useHasRole('admin');
  const hasManagerOrAdmin = useHasRole(['manager', 'admin']);
  
  if (!hasAdminRole) return <div>Admin only</div>;
};
```

### UI State

```typescript
const { sidebarCollapsed, toggleSidebar, openModal, closeModal } = useAppStore();

// Toggle sidebar
<button onClick={toggleSidebar}>Toggle</button>

// Open modal
<button onClick={() => openModal('createLead')}>Create Lead</button>
```

---

## Authentication & Protected Routes

### Protecting Routes

```typescript
import { ProtectedRoute, RoleBasedRoute } from '@/utils/authGuards';

<Routes>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  
  {/* Admin only */}
  <Route
    path="/admin"
    element={
      <RoleBasedRoute requiredRoles="admin">
        <AdminPanel />
      </RoleBasedRoute>
    }
  />
</Routes>
```

### Role-Based UI Guards

```typescript
import { RoleBasedGuard } from '@/utils/authGuards';

const MyComponent = () => (
  <div>
    <RoleBasedGuard requiredRoles="admin">
      <button>Delete All Data</button>
    </RoleBasedGuard>
  </div>
);
```

### Role Checking in Components

```typescript
import { useAuthGuard } from '@/utils/authGuards';

const MyComponent = () => {
  const { authUser, hasRole, requireRole } = useAuthGuard();
  
  // Check roles
  if (hasRole(['admin', 'manager'])) {
    // Show admin/manager UI
  }
  
  // Throw error if insufficient permissions
  try {
    requireRole('admin');
  } catch (e) {
    // Handle permission error
  }
};
```

---

## Data Fetching

Use TanStack Query for server state with React Query caching.

### Simple Query

```typescript
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/leads').then(res => res.data),
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <ul>{data.map(lead => <li key={lead.id}>{lead.name}</li>)}</ul>;
};
```

### Query with Parameters

```typescript
const { data } = useQuery({
  queryKey: ['leads', status, page],
  queryFn: () => api.get('/leads', {
    params: { status, page, limit: 10 }
  }).then(res => res.data),
});
```

### Mutation (Create/Update/Delete)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MyComponent = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/leads', data),
    onSuccess: () => {
      // Invalidate and refetch leads
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
  
  return (
    <button 
      onClick={() => createMutation.mutate({ name: 'John' })}
      disabled={createMutation.isPending}
    >
      Create Lead
    </button>
  );
};
```

---

## Form Handling

Use the provided form components with React Hook Form + Zod validation.

### Basic Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  FormWrapper, 
  FormInput, 
  FormSelect, 
  FormActions 
} from '@/components/forms/FormComponents';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.enum(['new', 'contacted', 'qualified']),
});

const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    await api.post('/leads', data);
  };
  
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <FormInput name="name" label="Name" required />
      <FormInput name="email" label="Email" type="email" required />
      <FormSelect 
        name="status" 
        label="Status"
        options={[
          { value: 'new', label: 'New' },
          { value: 'contacted', label: 'Contacted' },
        ]}
      />
      <FormActions 
        onCancel={() => form.reset()}
        isLoading={form.formState.isSubmitting}
      />
    </FormWrapper>
  );
};
```

---

## Tables & Lists

Use the reusable DataTable component for sortable, paginated tables.

### Basic Table

```typescript
import { DataTable, DataTableColumn } from '@/components/tables/DataTable';

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
}

const LeadsTable = ({ leads }) => {
  const columns: DataTableColumn<Lead>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <span className="capitalize">{value}</span>,
    },
  ];
  
  return (
    <DataTable
      columns={columns}
      data={leads}
      onRowClick={(lead) => console.log(lead.id)}
    />
  );
};
```

---

## Error Handling

Use Error Boundaries to catch and display component errors gracefully.

### Error Boundary

```typescript
import { ErrorBoundary } from '@/utils/errorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Custom Error Fallback

```typescript
<ErrorBoundary
  fallback={(error, retry) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### Loading Skeletons

```typescript
import { 
  CardSkeleton, 
  TableLoadingSkeleton,
  DashboardSkeleton 
} from '@/components/skeletons/LoadingSkeletons';

const MyComponent = ({ isLoading }) => {
  if (isLoading) return <DashboardSkeleton />;
  
  return <Dashboard />;
};
```

---

## Audit Logging

Log user actions for compliance and debugging.

### Audit Logging

```typescript
import { useAuditLog } from '@/hooks/useAuditLog';

const MyComponent = () => {
  const { logAction } = useAuditLog();
  
  const handleDelete = async (leadId) => {
    await api.delete(`/leads/${leadId}`);
    
    // Log the action
    await logAction(
      'DELETE_LEAD',
      'lead',
      leadId,
      'Deleted lead record',
      { reason: 'Duplicate' }
    );
  };
};
```

### Message Logging

```typescript
import { useMessageLog } from '@/hooks/useAuditLog';

const { logMessageSent } = useMessageLog();

await logMessageSent(
  leadId,
  'John Doe',
  'email',
  'welcome_template',
  { subject: 'Welcome!' }
);
```

### Error Logging

```typescript
import { useErrorLog } from '@/hooks/useAuditLog';

const { logError } = useErrorLog();

try {
  // do something
} catch (error) {
  await logError(error, 'CreateLead', { leadId: '123' });
}
```

---

## Environment Configuration

Set environment variables in `.env` (or copy from `.env.example`):

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WEBHOOKS=false
VITE_ENABLE_AI_FEATURES=false

# AI Integration
VITE_AI_ENDPOINT=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4

# Debug
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

Access in code:

```typescript
const apiBase = import.meta.env.VITE_API_BASE_URL;
const aiEnabled = import.meta.env.VITE_ENABLE_AI_FEATURES === 'true';
```

---

## Example: Complete Lead Creation Flow

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

const CreateLeadDialog = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();
  const form = useForm();
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/leads', data),
    onSuccess: (response) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      // Log the action
      logAction(
        'CREATE_LEAD',
        'lead',
        response.data.id,
        `Created new lead: ${data.name}`
      );
      
      // Close dialog
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create lead:', error.message);
    },
  });
  
  return (
    <FormWrapper form={form} onSubmit={(data) => createMutation.mutate(data)}>
      <FormInput name="name" label="Name" required />
      <FormInput name="email" label="Email" type="email" required />
      <FormActions 
        isLoading={createMutation.isPending}
        onCancel={onClose}
      />
    </FormWrapper>
  );
};

export default CreateLeadDialog;
```
