---
name: solid-csharp-principles
description: All 5 SOLID principles applied to C# 12/.NET 9 with interfaces, DI, and records
when-to-use: overview of SOLID for C#, quick reference, principle selection
keywords: SOLID, C#, .NET, interfaces, DI, records
priority: high
related: patterns.md
---

# SOLID Principles - C# Quick Reference

## Principles Overview

| Principle | Summary | C# Pattern |
|-----------|---------|------------|
| **SRP** | One responsibility per class | Controller, Service, Repository layers |
| **OCP** | Open for extension, closed for modification | Interfaces + implementations |
| **LSP** | Subtypes honor base contracts | Interface compliance |
| **ISP** | Small, focused interfaces | 1-3 members per interface |
| **DIP** | Depend on abstractions | `Microsoft.Extensions.DependencyInjection` |

---

## S - Single Responsibility (SRP)

- Files < 100 lines (split at 90)
- Controllers: HTTP I/O only, delegate to services
- Services: Business logic, use repositories
- Repositories: Data access only (EF Core / Dapper)

## O - Open/Closed (OCP)

```csharp
public interface IPaymentProcessor
{
    Task<bool> ProcessAsync(decimal amount, CancellationToken ct);
}

public class StripeProcessor : IPaymentProcessor
{
    public Task<bool> ProcessAsync(decimal amount, CancellationToken ct)
        => _stripe.ChargeAsync(amount, ct);
}
```

Extend by adding new implementations, not modifying existing.

## L - Liskov Substitution (LSP)

- Honor interface contracts fully
- Never throw `NotImplementedException` in production
- Return types must be same or more specific (covariance)

---

## I - Interface Segregation (ISP)

```csharp
public interface IReadRepository<T>
{
    Task<T?> GetByIdAsync(string id, CancellationToken ct);
}

public interface IWriteRepository<T>
{
    Task<T> SaveAsync(T entity, CancellationToken ct);
}
```

Split fat interfaces (4+ members) into focused ones.

## D - Dependency Inversion (DIP)

```csharp
public class UserService(IUserRepository repo, IMailer mailer)
{
    public async Task<User> CreateUserAsync(string email, CancellationToken ct)
    {
        var user = await repo.SaveAsync(new User(email), ct);
        await mailer.SendWelcomeAsync(user.Email, ct);
        return user;
    }
}
```

Register in `Program.cs` with `AddScoped<IUserRepository, PostgresRepository>()`.
