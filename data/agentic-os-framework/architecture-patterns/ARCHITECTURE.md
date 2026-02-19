# Frontend & Backend Architecture Specification
# Component Design Review System
# Agentic OS Framework v1.0
# Created: 2026-02-13

---

## Overview

This document defines the architectural patterns for the Component Design Review System, implementing a **Feature-Based + Atomic Design** architecture to ensure scalability, maintainability, and consistency across frontend and backend.

---

## Core Architecture Principles

### 1. Separation of Concerns
- **Global Components**: Reusable across entire application (`/components/`)
- **Feature Modules**: Self-contained business logic and UI (`/features/`)
- **Utilities**: Shared functions and helpers (`/lib/`)

### 2. Atomic Design Methodology
Components organized by complexity level:
- **Atoms**: Smallest building blocks (buttons, inputs, icons)
- **Molecules**: Simple combinations of atoms (form fields, cards)
- **Organisms**: Complex UI sections (headers, forms, data tables)
- **Templates**: Page-level layouts (not component-specific)
- **Pages**: Actual application routes (`/app/`)

### 3. Feature-Based Organization
Prevents component folder bloat by co-locating related code:
- Feature components, hooks, schemas, API calls together
- Clear feature boundaries and dependencies
- Self-contained modules for scalability

---

## Frontend Architecture

### Directory Structure

```
/app/                          - Next.js App Router pages
  /{route}/
    page.tsx
    layout.tsx

/components/                   - Global Reusable Components
  /atoms/                      - Smallest UI units
    /button/
      button.tsx
      button.test.tsx
      index.ts
    /input/
    /icon/
    
  /molecules/                  - Simple combinations
    /form-field/
    /card/
    /search-bar/
    
  /organisms/                  - Complex compositions
    /header/
    /navigation/
    /data-table/
    
  /ui/                        - shadcn/ui primitives
    accordion.tsx
    alert.tsx
    button.tsx
    ...

/features/                     - Feature Modules (Planned)
  /auth/
    /components/               - Auth-specific components
      login-form.tsx
      signup-form.tsx
    /hooks/                    - Auth-specific hooks
      use-auth.ts
      use-session.ts
    /schemas/                  - Validation schemas
      auth.schema.ts
    /api/                      - API calls
      auth.api.ts
    /types/                    - TypeScript types
      auth.types.ts
    index.ts                   - Public exports
    
  /dashboard/
    /components/
    /hooks/
    /schemas/
    /api/
    /types/
    index.ts
    
  /analytics/
    ...

/lib/                         - Shared Utilities
  /actions/                   - Server actions
  /utils/                     - Helper functions
  /validation/                - Global validators
  /store/                     - State management
  /security/                  - Security utilities
  /errors/                    - Error handling

/hooks/                       - Global React hooks
  use-mobile.tsx
  use-toast.ts
```

### Component File Pattern

```typescript
// Feature component example
// /features/auth/components/login-form.tsx

import { useAuth } from '../hooks/use-auth'
import { loginSchema } from '../schemas/auth.schema'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'

export function LoginForm() {
  // Component implementation
}

// Co-located test
// /features/auth/components/login-form.test.tsx
import { render, screen } from '@testing-library/react'
import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('renders login form', () => {
    // Test implementation
  })
})

// Public API export
// /features/auth/index.ts
export { LoginForm } from './components/login-form'
export { useAuth } from './hooks/use-auth'
export * from './types/auth.types'
```

### Import Conventions

```typescript
// Global components (from /components/)
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/molecules/card'
import { Header } from '@/components/organisms/header'

// Feature modules (from /features/)
import { LoginForm, useAuth } from '@/features/auth'
import { Dashboard } from '@/features/dashboard'

// Utilities (from /lib/)
import { cn } from '@/lib/utils'
import { validateEmail } from '@/lib/validation'

// UI primitives (from /components/ui/)
import { Button as UIButton } from '@/components/ui/button'
```

---

## Backend Architecture (Strapi CMS)

### Strapi Directory Structure (Planned)

```
/strapi/
  /src/
    /components/              - Content Type Components
      /atoms/                 - Mirrors frontend atomic structure
        button.json
        icon.json
        
      /molecules/             - Component combinations
        card.json
        form-field.json
        
      /organisms/             - Complex sections
        hero-section.json
        feature-grid.json
        
    /features/                - Feature-specific logic
      /auth/
        controllers/
        services/
        routes/
        
      /content/
        controllers/
        services/
        routes/
        
    /api/                     - API definitions
      /{content-type}/
        controllers/
        services/
        routes/
        schema.json
```

### Frontend-Backend Consistency

**Goal**: Same mental model across both codebases

**Implementation:**
1. Strapi components mirror frontend atomic structure
2. Feature organization matches frontend feature modules
3. Shared TypeScript types via ORPC
4. Consistent naming conventions

**Example:**
```
Frontend: /components/atoms/button/button.tsx
Backend:  /strapi/src/components/atoms/button.json

Frontend: /features/auth/
Backend:  /strapi/src/features/auth/
```

---

## Migration Strategy

### Phase 1: Foundation (Current)
- ✅ Atomic design in `/components/` (existing)
- ✅ Global utilities in `/lib/` (existing)
- ⏳ Document architecture patterns (this document)

### Phase 2: Feature Module Setup (Planned)
- Create `/features/` directory
- Identify first feature to migrate (e.g., auth, dashboard)
- Set up feature module template
- Migrate first feature and validate pattern

### Phase 3: Incremental Migration (Future)
- Migrate features one at a time
- Maintain backward compatibility during transition
- Update imports as features move
- Remove old structure after full migration

### Phase 4: Backend Integration (Future)
- Set up Strapi with atomic component structure
- Implement feature-based backend organization
- Establish ORPC for type safety
- Validate frontend-backend consistency

---

## Benefits

### Scalability
- New features are self-contained modules
- Clear boundaries prevent feature coupling
- Easy to add/remove features without affecting others

### Maintainability
- Co-location: Related code lives together
- Clear structure: Know where to find things
- Atomic design: Component hierarchy is explicit

### Team Collaboration
- Feature ownership is clear
- Consistent patterns across codebase
- Same mental model frontend/backend

### Performance
- Code splitting by feature
- Lazy load features on demand
- Tree-shaking removes unused feature code

---

## Decision Log

### Why Feature-Based Over Component-Based?

**Problem:** Component folders grow unmanageably large (100+ components)
**Solution:** Organize by feature, not just component type

**Example:**
```
❌ BAD: /components/login-form.tsx, /components/signup-form.tsx, /components/profile-form.tsx
✅ GOOD: /features/auth/components/{login,signup,profile}-form.tsx
```

### Why Atomic Design?

**Problem:** No clear component hierarchy or composition rules
**Solution:** Atomic design provides clear levels of complexity

**Benefit:** Developers know whether to build atom, molecule, or organism based on composition needs

### Why Mirror Frontend-Backend?

**Problem:** Different mental models cause confusion and errors
**Solution:** Same structure across codebases

**Benefit:** Developers can navigate both codebases with same mental map

---

## Standards

### Component Standards
- TDD where possible (write tests first for business logic)
- Co-locate tests with components
- TypeScript interfaces (no classes)
- Separation of concerns (UI, logic, data)

### Feature Module Standards
- Each feature has `index.ts` for public API
- Internal implementation details not exported
- Features don't import from other features' internals
- Shared code goes in `/lib/` or `/components/`

### Testing Standards
- Unit tests for utilities and hooks
- Integration tests for feature workflows
- Component tests for UI behavior
- Co-located test files

---

## References

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [Feature-Driven Architecture](https://feature-sliced.design/)
- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
- [Strapi Components](https://docs.strapi.io/dev-docs/backend-customization/models)

---

## Version History

**v1.0 (2026-02-13)**
- Initial architecture specification
- Defined feature-based + atomic design hybrid
- Documented frontend/backend consistency goals
- Established migration strategy
