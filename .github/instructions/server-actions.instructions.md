---
description: Read this before creating or modifying server actions for data mutations.
---

# Server Actions Instructions

## Core Principles

**All data mutations in this application must be done via server actions.** Never perform data mutations directly in components or API routes.

**Server actions must never throw errors.** Always return an object with either an `error` or `success` property to communicate the result to the client.

## File Structure and Naming

1. **File Name:** Server actions files MUST be named `actions.ts`
2. **Location:** Server actions must be colocated in the same directory as the component that calls them

   ```
   app/
     dashboard/
       page.tsx          # Client component that calls actions
       actions.ts        # Server actions for dashboard
   ```

## Server Action Requirements

### 1. Component Integration

- Server actions MUST be called from **client components** only
- Add `"use client"` directive to components that invoke server actions
- Import server actions from the colocated `actions.ts` file

### 2. Type Safety

- ALL data passed to server actions MUST have appropriate TypeScript types
- **DO NOT use the `FormData` TypeScript type**
- Define explicit interfaces or types for action parameters

  ```typescript
  // ✅ Correct
  interface CreateLinkParams {
    url: string;
    slug?: string;
  }

  export async function createLink(params: CreateLinkParams) {
    // ...
  }

  // ❌ Incorrect
  export async function createLink(formData: FormData) {
    // ...
  }
  ```

### 3. Data Validation

- ALL data MUST be validated using **Zod** schemas
- Validate at the beginning of each server action
- Return validation errors in a consistent format

  ```typescript
  import { z } from "zod";

  const createLinkSchema = z.object({
    url: z.string().url(),
    slug: z.string().optional(),
  });

  export async function createLink(params: CreateLinkParams) {
    const validated = createLinkSchema.safeParse(params);
    if (!validated.success) {
      return { error: validated.error.message };
    }
    // ...
  }
  ```

### 4. Authentication Check

- ALL server actions MUST check for a logged-in user **before** any database operations
- Use Clerk's `auth()` to get the current user
- Return early if user is not authenticated

  ```typescript
  import { auth } from "@clerk/nextjs/server";

  export async function createLink(params: CreateLinkParams) {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }
    // ... proceed with validated data
  }
  ```

### 5. Database Operations

- Server actions MUST NOT directly use Drizzle queries
- ALL database operations must be done via **helper functions**
- Helper functions are located in the `/data` directory
- Server actions should only orchestrate validation, auth, and call data layer functions

### 6. Error Handling

- Server actions MUST NOT throw errors
- Always catch errors and return an object with `{ error: string }`
- Return `{ success: true, data: T }` for successful operations
- This ensures predictable error handling in client components

  ```typescript
  // ✅ Correct - in actions.ts
  import { createLinkInDb } from "@/data/links";

  export async function createLink(params: CreateLinkParams) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const validated = createLinkSchema.safeParse(params);
    if (!validated.success) return { error: validated.error.message };

    const link = await createLinkInDb({ ...validated.data, userId });
    return { success: true, data: link };
  }

  // ❌ Incorrect - direct Drizzle query in action
  import { db } from "@/db";
  import { links } from "@/db/schema";

  export async function createLink(params: CreateLinkParams) {
    // ... validation ...
    const link = await db.insert(links).values({ ... }); // DON'T DO THIS
  }
  ```

## Template

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { dataLayerFunction } from "@/data/[module]";

// Define input schema
const actionSchema = z.object({
  // ... fields
});

// Define input type
type ActionInput = z.infer<typeof actionSchema>;

export async function actionName(input: ActionInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 2. Validate input
  const validated = actionSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.message };
  }

  // 3. Call data layer function
  try {
    const result = await dataLayerFunction(validated.data);
    return { success: true, data: result };
  } catch (error) {
    // Never throw - always return error object
    return {
      error:
        error instanceof Error ? error.message : "Failed to perform operation",
    };
  }
}
```

## Summary Checklist

- [ ] File named `actions.ts` and colocated with calling component
- [ ] Called from client component with `"use client"` directive
- [ ] Proper TypeScript types defined (not `FormData`)
- [ ] Zod validation for all inputs
- [ ] Authentication check using `auth()`
- [ ] Database operations via `/data` helper functions only
- [ ] Consistent error/success return format
- [ ] No thrown errors - all errors returned as objects
