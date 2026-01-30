# Installation Better Auth

## Installation

```bash
npm install better-auth
# ou
bun add better-auth
```

## Structure Projet

```
lib/
├── auth.ts              # Configuration serveur
├── auth-client.ts       # Configuration client
└── prisma.ts            # Instance Prisma
app/api/auth/[...all]/
└── route.ts             # Handler API
middleware.ts            # Protection routes
```

## Variables d'environnement

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
BETTER_AUTH_SECRET=openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# OAuth (optionnel)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

## Génération Schéma DB

```bash
# Générer les migrations Prisma
npx @better-auth/cli generate

# Appliquer
npx prisma migrate dev
```

## Route API Handler

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

## Vérification Installation

```typescript
// Test en console
import { auth } from "@/lib/auth"
console.log(auth.api) // Doit afficher les méthodes disponibles
```

## Ordre d'installation

1. `npm install better-auth`
2. Créer `lib/auth.ts` (serveur)
3. Créer `lib/auth-client.ts` (client)
4. Créer `app/api/auth/[...all]/route.ts`
5. Générer schéma DB
6. Configurer middleware (optionnel)

## Dépendances Recommandées

```bash
npm install @prisma/client prisma
# ou pour Drizzle
npm install drizzle-orm
```
