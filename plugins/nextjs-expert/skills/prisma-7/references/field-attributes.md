---
name: field-attributes
description: Prisma 7 field-level attributes (@id, @unique, @default, @map, @db)
when-to-use: Configuring fields, mapping to database columns, constraints
keywords: attribute, @id, @unique, @default, @map, @db, constraint
priority: high
requires: schema.md
related: model-attributes.md, default-values.md
---

# Field Attributes

Field-level configuration and constraints in Prisma 7.
Type definitions in `/references/interfaces/field-attributes.types.md`.

## Identity Fields

```prisma
/**
 * User model with auto-increment primary key.
 * See IdentityType in /interfaces/field-attributes.types.md
 */
model User {
  // Primary key (auto-increment)
  id Int @id @default(autoincrement())

  // UUID primary key (distributed ID)
  // id String @id @default(uuid()) @db.Uuid

  // CUID primary key (better for distributed systems)
  // id String @id @default(cuid())
}

/**
 * Post model with UUID primary key.
 */
model Post {
  id String @id @default(uuid())
}
```

## Uniqueness Constraints

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  phone String  @unique
  slug  String  @unique
}

model Product {
  id   Int    @id @default(autoincrement())
  sku  String @unique
  name String
}
```

## Default Values

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  published Boolean  @default(false)
  status    String   @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Database Column Mapping

```prisma
/**
 * User model with column name mapping.
 * Bridge camelCase Prisma names to snake_case database columns.
 * See FieldMapping and ModelMapping in /interfaces/field-attributes.types.md
 */
model User {
  // Prisma field name → Database column name
  id          Int    @id @default(autoincrement()) @map("user_id")
  firstName   String @map("first_name")
  lastName    String @map("last_name")
  emailAddress String @unique @map("email")

  /**
   * Model table name mapping.
   * @map directive bridges Prisma model to database table.
   */
  @@map("users")
}

/**
 * Generated SQL from mapped model.
 * Prisma: User.firstName → Database: users.first_name
 */
// CREATE TABLE users (
//   user_id INT PRIMARY KEY,
//   first_name VARCHAR,
//   last_name VARCHAR,
//   email VARCHAR UNIQUE
// )
```

## Database Types

```prisma
model Article {
  id      Int     @id @default(autoincrement())
  // PostgreSQL specific types
  content String  @db.Text
  metadata Json   @db.JsonB
  tags    String[] @db.Array(String)

  // MySQL specific
  // largeData String @db.LongText
  // binary    Bytes  @db.LongBlob
}

model Coordinate {
  id  Int   @id @default(autoincrement())
  lat Float @db.DoublePrecision
  lng Float @db.DoublePrecision
}
```

## Nullable and Optional

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  phone    String? // Optional field (nullable)
  middle   String? @map("middle_name")
  avatar   String?
}

// Queries:
const user = await prisma.user.findUnique({
  where: { id: 1 }
})
// user.phone: string | null
```

## Index Configuration

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique // Implicit index
  name  String  @db.VarChar(255)
  tags  String[]
}

// Explicit indexing (use @@index)
```

## Field Validation

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  age      Int     // Prisma: no built-in validation
  password String  // Must validate in application
}

// Application-level validation required:
const { error } = userSchema.validate({ age })
if (age < 0 || age > 150) throw new Error("Invalid age")
```

## Best Practices

1. **Use @map for legacy databases** - Bridge naming gaps
2. **@id for primary keys** - Always required
3. **@unique for constraints** - Database-enforced
4. **@default for auto-generation** - Timestamps, UUIDs
5. **@db for type specificity** - PostgreSQL JSON, arrays
6. **Make fields optional with ?** - null values allowed
