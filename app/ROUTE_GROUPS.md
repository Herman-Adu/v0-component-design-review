# Route Group Structure

This project uses Next.js App Router route groups for clean architectural separation.

## Route Groups

### (marketing)
- **Purpose**: Public-facing marketing pages
- **Layout**: Simple layout with navbar and footer
- **Pages**: Homepage, services, contact, quotations
- **URL**: Routes appear at root level (e.g., `/`, `/services`)

### (dashboard)
- **Purpose**: Authenticated dashboard application
- **Layout**: Dashboard layout with sidebar navigation
- **Pages**: Admin panels, content library, documentation
- **URL**: Routes appear under `/dashboard/*`
- **Features**: Loading states, error boundaries

### (auth)
- **Purpose**: Authentication pages (future implementation)
- **Layout**: Centered auth layout
- **Pages**: Login, register, password reset (placeholders)
- **URL**: Routes appear at root level (e.g., `/login`)
- **Status**: Skeleton ready for implementation

## Benefits

1. **Layout Isolation**: Each route group has its own layout
2. **Clean URLs**: Route groups don't appear in URLs
3. **Better Organization**: Clear separation between public, authenticated, and auth pages
4. **Scalability**: Easy to add new sections with different layouts
5. **Error Boundaries**: Granular error handling per section

## File Structure

```
app/
├── layout.tsx                 # Root layout (applies to all)
├── globals.css               # Global styles
│
├── (marketing)/              # Public pages
│   ├── layout.tsx           # Marketing layout
│   ├── loading.tsx          # Loading UI
│   └── page.tsx             # Homepage
│
├── (dashboard)/             # Dashboard pages
│   ├── layout.tsx          # Dashboard group layout
│   ├── loading.tsx         # Loading UI
│   ├── error.tsx           # Error boundary
│   └── dashboard/          # Actual dashboard routes
│       ├── layout.tsx      # Dashboard layout with sidebar
│       └── [all pages]     # 98+ dashboard pages
│
└── (auth)/                 # Auth pages (future)
    ├── layout.tsx         # Auth layout
    ├── loading.tsx        # Loading UI
    └── login/
        └── page.tsx       # Placeholder
```

## Next Steps

1. Add more marketing pages to `(marketing)/`
2. Implement authentication in `(auth)/`
3. Continue building dashboard features in `(dashboard)/dashboard/`
