---
name: oauth-pkce
description: Complete OAuth authorization-code flow in Start with state + PKCE and a hardened callback
keywords: oauth, PKCE, state, code_verifier, code_challenge, redirect, createServerFn, session-rotation
source: https://tanstack.com/start/latest/docs/framework/react/guide/authentication-server-primitives
---

# OAuth with state + PKCE

## Overview

A DIY OAuth authorization-code flow using Start server functions. It generates a one-time `state` (CSRF defense on the callback) and a PKCE `code_verifier`/`code_challenge` pair (defense against code interception), stores both in a short-lived signed `__Host-` cookie, and verifies everything in the callback before issuing a rotated session.

---

## Prerequisites

- An OAuth provider (client id/secret, authorize + token endpoints)
- Session helpers from [session-and-csrf.md](session-and-csrf.md)
- A `signed()` / `verifySigned()` helper (HMAC over the cookie payload)

---

## File: src/server/oauth.functions.ts (initiate)

```ts
/**
 * Start the OAuth flow. state defeats callback CSRF; PKCE defeats code interception.
 * Both are stored in a short-lived signed cookie keyed to THIS attempt.
 * All env reads happen inside the handler (never at module scope).
 */
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { setResponseHeader } from '@tanstack/react-start/server'
import crypto from 'node:crypto'
import { signed } from '~/lib/signing'

const OAUTH_COOKIE = '__Host-oauth'

function base64url(buf: Buffer) {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export const startOAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const state = base64url(crypto.randomBytes(32))
  const verifier = base64url(crypto.randomBytes(32))
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest())

  setResponseHeader(
    'Set-Cookie',
    `${OAUTH_COOKIE}=${signed({ state, verifier })}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
  )

  throw redirect({
    href:
      `https://provider.example/authorize` +
      `?response_type=code` +
      `&client_id=${process.env.OAUTH_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URI!)}` +
      `&state=${state}` +
      `&code_challenge=${challenge}` +
      `&code_challenge_method=S256`,
  })
})
```

---

## File: src/server/oauth-callback.functions.ts (callback)

```ts
/**
 * Callback: verify the signed cookie, match state, exchange the code (sending the
 * PKCE verifier), find/create the user, issue a rotated session, clear the cookie.
 * Any failed check means the request did NOT originate from startOAuth → reject.
 */
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server'
import { z } from 'zod'
import { verifySigned } from '~/lib/signing'
import { setSessionCookie } from './session'
import { db } from '~/db'

const OAUTH_COOKIE = '__Host-oauth'

function readOAuthCookie(): { state: string; verifier: string } | null {
  const header = getRequestHeader('cookie')
  if (!header) return null
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=')
    if (eq !== -1 && part.slice(0, eq) === OAUTH_COOKIE) {
      return verifySigned(part.slice(eq + 1)) // null if signature invalid
    }
  }
  return null
}

export const oauthCallback = createServerFn({ method: 'GET' })
  .validator(z.object({ code: z.string(), state: z.string() }))
  .handler(async ({ data }) => {
    const stored = readOAuthCookie()
    if (!stored || stored.state !== data.state) throw new Error('OAuth state mismatch')

    const tokenRes = await fetch('https://provider.example/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: data.code,
        code_verifier: stored.verifier, // PKCE proof
        client_id: process.env.OAUTH_CLIENT_ID!,
        client_secret: process.env.OAUTH_CLIENT_SECRET!,
        redirect_uri: process.env.OAUTH_REDIRECT_URI!,
      }),
    })
    if (!tokenRes.ok) throw new Error('Token exchange failed')
    const { access_token } = await tokenRes.json()

    const profile = await fetch('https://provider.example/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    }).then((r) => r.json())

    const user = await db.users.findOrCreateByProvider(profile)

    await db.sessions.revokeAllForUser(user.id) // rotate on privilege change
    const token = await db.sessions.create({ userId: user.id })
    setSessionCookie(token)

    // Clear the one-time OAuth cookie.
    setResponseHeader('Set-Cookie', `${OAUTH_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`)
    throw redirect({ to: '/dashboard' })
  })
```

---

## Notes

- The callback rejects unless the cookie signature is valid AND cookie-`state` equals query `state`.
- PKCE (`code_challenge_method=S256`) is sent on authorize and the `code_verifier` on token exchange.
- The `__Host-oauth` cookie has `Max-Age=600` (10 min) — a bounded attempt window.
- Session is rotated after login (revoke all + issue fresh) to neutralize fixation.
- If you prefer a managed library, Auth.js is an officially-listed option; install `@auth/core` and follow its current docs rather than assuming a Start adapter shape.
