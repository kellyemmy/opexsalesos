# Copilot Instructions for opexsalesos

## Project Overview

**opexsalesos** is a React/TypeScript sales engagement dashboard built with Vite, shadcn/ui components, and TailwindCSS. The project features a multi-page SPA with dashboard analytics, campaign management, lead tracking, and communications tools.

## Tech Stack & Key Dependencies

- **Frontend**: React 18.3, React Router 6.30, React Hook Form 7.61, TanStack Query 5.83
- **UI Components**: shadcn/ui (Radix UI primitives + TailwindCSS)
- **Styling**: TailwindCSS 3, Tailwind Merge, CVA (class-variance-authority)
- **Forms**: React Hook Form + Zod for validation
- **Charts**: Recharts 2.15 for analytics visualizations
- **Build**: Vite 5 with SWC transpilation, Bun package manager
- **Testing**: Vitest + React Testing Library
- **Theme**: next-themes for dark mode support

## Architecture & Component Structure

### Layout Pattern
All pages wrap in `<DashboardLayout>` component ([src/components/layout/DashboardLayout.tsx](src/components/layout/DashboardLayout.tsx)), which provides:
- Fixed sidebar navigation with collapse state
- Sticky top header (h-16) with page title, subtitle, and action buttons
- Main content area with auto margin adjustment
- Support for custom actions via `actions` prop

**Page Template**:
```tsx
const Page = () => (
  <DashboardLayout 
    title="Page Title"
    subtitle="Optional subtitle"
    actions={<Button>Action</Button>}
  >
    <div className="space-y-6">
      {/* Content */}
    </div>
  </DashboardLayout>
);
```

### Component Organization
- [src/components/ui/](src/components/ui/) - Shadcn primitive components (accordion, button, card, dialog, etc.)
- [src/components/layout/](src/components/layout/) - Layout wrappers (AppSidebar, DashboardLayout)
- [src/components/dashboard/](src/components/dashboard/) - Feature-specific: MetricCards, Charts, ActivityFeed
- [src/pages/](src/pages/) - Route-level page components (Dashboard, Leads, Campaigns, etc.)

### Routing & Navigation
Routes defined in [src/App.tsx](src/App.tsx):
```tsx
/ → Dashboard
/leads → Leads
/campaigns → Campaigns
/conversations → Conversations
/templates → Templates
/analytics → Analytics
/brand → BrandSettings
/settings → Settings
```
Navigation items in [src/components/layout/AppSidebar.tsx](src/components/layout/AppSidebar.tsx) use Lucide icons + React Router NavLink.

## Key Patterns & Conventions

### Styling & Component Variants
- Use **shadcn/ui components** for all UI elements - don't create custom button/card/etc.
- Apply TailwindCSS classes directly; use `cn()` utility ([src/lib/utils.ts](src/lib/utils.ts)) to merge class strings conditionally
- Button variants: `primary` (default), `outline`, `ghost`, `accent`, `destructive` - check [src/components/ui/button.tsx](src/components/ui/button.tsx)
- **Grid layouts**: Use `grid-cols-1 lg:grid-cols-3 gap-6` pattern for responsive multi-column dashboards

## State Management

### Server State (React Query)
- Use for API-backed data: leads, campaigns, conversations, analytics
- Automatic caching, deduplication, and background refetching
- Query keys follow pattern: `['resource', id?, filter?]` → `['leads']`, `['campaigns', cid]`

### Client/UI State (Zustand)
Use `src/store/index.ts` for lightweight global state:
- **Auth**: `authUser`, `accessToken`, `isAuthenticated`, `isLoading`
- **UI**: `sidebarCollapsed`, `activeModalType`, `theme`
- **App Context**: `selectedLeadId`, `selectedCampaignId`, `toastQueue`

```tsx
import { useAppStore, useHasRole, useIsAuthenticated } from '@/store';

const MyComponent = () => {
  const { authUser, logout } = useAppStore();
  const isAdmin = useHasRole('admin');
  const authenticated = useIsAuthenticated();
  
  return <div>{authUser?.name}</div>;
};
```

Initialization happens automatically in [src/App.tsx](src/App.tsx) - calls `initializeAuth()` on mount to load user from localStorage.

**Guidelines**:
- Keep stores minimal; prefer URL state for navigation (React Router)
- Auth loading: Use `useEffect + initializeAuth()` on app startup
- UI toggles: Store in Zustand only if reused across multiple components



### Data Fetching & API Integration

**Backend Communication** ([src/lib/api.ts](src/lib/api.ts)):
- Axios client with automatic JWT injection and refresh token handling
- Base URL from `VITE_API_BASE_URL` environment variable
- All errors normalized to consistent format: `{ status, message, data, originalError }`
- Request timeout: 30s default (configurable via `VITE_API_TIMEOUT`)
- Credentials included for httpOnly refresh token cookies

**JWT Authentication Pattern**:
- Access token: Short-lived (15min), stored in memory after login
- Refresh token: Long-lived (7d), stored in httpOnly cookie
- Auto-refresh: On 401, automatically calls `/auth/refresh` and retries request
- Logout: Clears tokens and redirects to login on refresh failure

**Basic Usage**:
```tsx
import api from '@/lib/api';

// Automatic JWT injection - token added from localStorage
const { data } = await api.get('/leads');
await api.post('/leads', { name: 'John' });
await api.put('/leads/123', { status: 'qualified' });
await api.delete('/leads/123');
```

**TanStack Query Integration**:
- Configured in [src/App.tsx](src/App.tsx) with QueryClientProvider
- `useQuery` for GET requests with automatic caching/stale time
- `useMutation` for POST/PUT/DELETE with optimistic updates
- Query keys: Use factory functions like `['leads', leadId]` for consistency
- Cache invalidation: `queryClient.invalidateQueries(['leads'])` after mutations

Example Query:
```tsx
const { data: leads } = useQuery({
  queryKey: ['leads'],
  queryFn: () => api.get('/leads').then(res => res.data),
  staleTime: 5 * 60 * 1000, // 5 min
});
```

Example Mutation:
```tsx
const mutation = useMutation({
  mutationFn: (data) => api.post('/leads', data),
  onSuccess: () => queryClient.invalidateQueries(['leads']),
});
```

## Performance Optimization

### Code Splitting & Dynamic Imports
Lazy-load heavy pages (Analytics, Campaigns, Brand Settings) in [src/App.tsx](src/App.tsx):
```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Campaigns = lazy(() => import('./pages/Campaigns'));

// In routes:
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/analytics" element={<Analytics />} />
</Suspense>
```

### Memoization Patterns
- Use `React.memo()` for expensive components receiving props (charts, tables)
- `useMemo()` for derived data: filtered lists, aggregated metrics
- `useCallback()` for event handlers passed to memoized children

Example:
```tsx
const MetricsTable = React.memo(({ data, onSelect }) => {
  const sorted = useMemo(() => data.sort(...), [data]);
  const handleClick = useCallback((id) => onSelect(id), [onSelect]);
  return ...;
});
```

### React Query Caching
- Set `staleTime` to defer refetch: 5min for leads/campaigns, 30min for analytics
- Use `keepPreviousData: true` for pagination to avoid layout shift
- Batch mutations with `useMutation().mutateAsync()` before cache invalidation
- Prefetch related data: When opening a lead, prefetch conversations

```tsx
const { prefetchQuery } = useQueryClient();
onLeadSelect: (id) => {
  prefetchQuery({
    queryKey: ['conversations', id],
    queryFn: () => api.get(`/conversations/${id}`),
  });
}
```

## Design System & Theming

### Opex Brand Tokens
Custom CSS variables in [src/index.css](src/index.css) (HSL format):
- **Primary**: `hsl(215 50% 23%)` - Dark navy (main CTA, headers)
- **Accent**: `hsl(175 65% 40%)` - Teal (highlights, success states)
- **Gradients**: `--gradient-primary`, `--gradient-accent`, `--gradient-hero` for hero sections and cards

Apply via TailwindCSS: `bg-primary`, `text-accent`, or custom CSS: `background: var(--gradient-primary)`

### Component Customization

**Reusable Form Components** [src/components/form/](src/components/form/):
```tsx
// FormField.tsx - Wrapper around shadcn Form + Zod
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function FormInput({ name, label, ...props }) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

// Usage in LeadForm.tsx:
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormInput name="email" label="Email" type="email" />
    <FormSelect name="status" label="Lead Status" options={[...]} />
  </form>
</Form>
```

**Data Tables** - shadcn table + sorting/pagination:
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

const LeadTable = ({ leads }) => {
  const [sorted, setSorted] = useState(leads);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => setSorted(...)}>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(lead => (
          <TableRow key={lead.id}>
            <TableCell>{lead.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

**Modals & Dialogs** - shadcn Dialog with form:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function CreateLeadDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Add Lead</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Lead</DialogTitle></DialogHeader>
        <LeadForm onSuccess={() => queryClient.invalidateQueries(['leads'])} />
      </DialogContent>
    </Dialog>
  );
}
```

**Charts** - Recharts with Opex theme:
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function EngagementChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis />
        <YAxis />
        <Tooltip />
        <Line stroke="hsl(var(--primary))" dataKey="emails" />
        <Line stroke="hsl(var(--accent))" dataKey="replies" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```



## Development Workflows

### Environment Setup
Create `.env` file in project root (never commit secrets):
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

Access in code:
```tsx
const apiBase = import.meta.env.VITE_API_BASE_URL;
```

### Local Setup
```bash
# Install (uses Bun)
bun install

# Development server with HMR
npm run dev          # Runs on http://localhost:8080

# Production build
npm run build        # Creates dist/

# Type checking & linting
npm run lint         # ESLint check

# Testing
npm run test         # Run all tests once
npm run test:watch   # Watch mode
```

### Debugging
VS Code launch config in [.vscode/launch.json](.vscode/launch.json) supports Chrome debugging:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Launch VS Code debugger (F5)
# Breakpoints will pause execution in Chrome
```

### File Path Resolution
- Use `@` alias for imports: `import { cn } from "@/lib/utils"` → resolves to `src/lib/utils.ts`
- Configured in [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts)

### Testing Convention
- Test files: `src/**/*.{test,spec}.{ts,tsx}`
- Setup file: [src/test/setup.ts](src/test/setup.ts) configures jsdom + Testing Library
- Example: [src/test/example.test.ts](src/test/example.test.ts)

## Critical Integration Points

### Sidebar Navigation State
- Sidebar collapse state managed in AppSidebar component (currently hardcoded `false`)
- Main content respects collapse via margin: `ml-64` (expanded) or `ml-16` (collapsed)
- Update [src/components/layout/AppSidebar.tsx](src/components/layout/AppSidebar.tsx) if adding new nav items

### Global UI Providers
Order matters in [src/App.tsx](src/App.tsx):
1. QueryClientProvider (data fetching)
2. TooltipProvider (Radix primitives)
3. Toaster components (Shadcn + Sonner toast)
4. BrowserRouter (routing)

Adding providers must follow this order to avoid context issues.

### ESLint & Type Safety
- Relaxed TypeScript: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedLocals: false`
- ESLint disables `@typescript-eslint/no-unused-vars` - be intentional with imports anyway
- React Hooks linting enabled via `eslint-plugin-react-hooks`

## Common Tasks

**Add a new page**:
1. Create [src/pages/NewPage.tsx](src/pages/) with DashboardLayout wrapper
2. Import in [src/App.tsx](src/App.tsx) and add Route (wrapped in ProtectedRoute)
3. Add NavLink to [src/components/layout/AppSidebar.tsx](src/components/layout/AppSidebar.tsx)

**Add UI component**: Copy a shadcn component from [src/components/ui/](src/components/ui/) (e.g., accordion, tabs) and adapt; don't create from scratch.

**Create a form**: Use form abstractions from [src/components/forms/FormComponents.tsx](src/components/forms/FormComponents.tsx):
```tsx
import { FormWrapper, FormInput, FormSelect, FormActions } from '@/components/forms/FormComponents';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({ email: z.string().email() });
const form = useForm({ resolver: zodResolver(schema) });

<FormWrapper form={form} onSubmit={onSubmit}>
  <FormInput name="email" label="Email" type="email" required />
  <FormActions onCancel={onCancel} />
</FormWrapper>
```

**Add chart**: Use Recharts (already imported in [src/components/dashboard/Charts.tsx](src/components/dashboard/Charts.tsx)); follow responsive grid pattern.

**Protect routes**: Use [src/utils/authGuards.tsx](src/utils/authGuards.tsx):
```tsx
import { ProtectedRoute, RoleBasedRoute } from '@/utils/authGuards';

<Route path="/admin" element={<RoleBasedRoute requiredRoles="admin"><Admin /></RoleBasedRoute>} />
```

**Create data tables**: Use [src/components/tables/DataTable.tsx](src/components/tables/DataTable.tsx):
```tsx
import { DataTable, DataTableColumn } from '@/components/tables/DataTable';

const columns: DataTableColumn<Lead>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
];

<DataTable columns={columns} data={leads} onRowClick={handleRow} />
```

**Handle loading states**: Use skeletons from [src/components/skeletons/LoadingSkeletons.tsx](src/components/skeletons/LoadingSkeletons.tsx):
```tsx
import { DashboardSkeleton, TableLoadingSkeleton } from '@/components/skeletons/LoadingSkeletons';

{isLoading ? <DashboardSkeleton /> : <Dashboard />}
```

**Log user actions**: Use [src/hooks/useAuditLog.ts](src/hooks/useAuditLog.ts) for compliance:
```tsx
import { useAuditLog } from '@/hooks/useAuditLog';

const { logAction } = useAuditLog();
await logAction('DELETE_LEAD', 'lead', leadId, 'Deleted lead');
```

**Handle errors**: Wrap components in [src/utils/errorBoundary.tsx](src/utils/errorBoundary.tsx):
```tsx
import { ErrorBoundary } from '@/utils/errorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```
