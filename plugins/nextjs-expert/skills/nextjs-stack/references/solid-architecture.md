# SOLID Architecture

### Project Structure

```
src/
├── app/                    # Route handlers only
│   ├── [locale]/          # i18n routing
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── modules/
│   ├── cores/             # Shared infrastructure
│   │   ├── i18n/          # Internationalization
│   │   ├── shadcn/        # UI components
│   │   ├── lib/           # Utilities (cn, etc.)
│   │   └── db/            # Prisma client
│   ├── auth/              # Authentication module
│   └── [feature]/         # Feature modules
└── proxy.ts               # Route protection
```

### Module Pattern

Each feature module contains:

- **src/services/** - Business logic
- **src/hooks/** - React hooks
- **src/components/** - UI components
- **src/interfaces/** - TypeScript types
