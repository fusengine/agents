---
name: api-route-template
description: API Route Handler template with validation and auth middleware
---

# API Route Handler

```typescript
// modules/users/api/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '../src/services/user.service'
import { validateCreateUser } from '../src/validators/user.validator'
import { withAuth } from '@/modules/cores/middleware/auth'

/**
 * GET /api/users - List users
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const users = await UserService.findAll({ page, limit })
  return NextResponse.json(users)
}

/**
 * POST /api/users - Create user (protected)
 */
export const POST = withAuth(async (request: NextRequest) => {
  const body = await request.json()
  const validated = validateCreateUser(body)

  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error },
      { status: 400 }
    )
  }

  const user = await UserService.create(validated.data)
  return NextResponse.json(user, { status: 201 })
})
```

## Dynamic Route

```typescript
// modules/users/api/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '../../src/services/user.service'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/users/:id - Get user by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  const user = await UserService.findById(id)

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}

/**
 * PATCH /api/users/:id - Update user
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await request.json()

  const user = await UserService.update(id, body)
  return NextResponse.json(user)
}

/**
 * DELETE /api/users/:id - Delete user
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  await UserService.delete(id)
  return new NextResponse(null, { status: 204 })
}
```
