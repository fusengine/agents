---
name: solid-csharp-patterns
description: C# 12/.NET 9 patterns - project structure, Contracts, records, XML docs, xUnit
when-to-use: project structure, testing, C#-specific SOLID implementation
keywords: C#, .NET, Contracts, records, xUnit, XML docs
priority: high
related: principles.md
---

# C# Patterns & Structure

## Project Structure (Modules MANDATORY)

```
src/Modules/
├── Users/
│   ├── Controllers/           # HTTP endpoints (< 50 lines)
│   ├── Services/              # Business logic (< 100 lines)
│   ├── Repositories/          # Data access (< 100 lines)
│   ├── Contracts/             # Interfaces (< 30 lines)
│   └── Models/                # Entities + DTOs (< 50 lines)
└── Core/                      # Shared across features
    ├── Services/
    ├── Contracts/
    └── Models/
```

## Record Types (DTOs & Value Objects)

```csharp
public record CreateUserRequest(string Email, string Name);
public record UserResponse(string Id, string Email, DateTime CreatedAt);
public readonly record struct Email(string Value);
```

- `record` for DTOs, `record struct` for value objects
- `readonly record struct` for fully immutable value objects

## XML Documentation

```csharp
/// <summary>Creates a new user.</summary>
/// <param name="email">User email address.</param>
/// <param name="ct">Cancellation token.</param>
/// <returns>The created user.</returns>
/// <exception cref="ArgumentException">If email is invalid.</exception>
public async Task<User> CreateUserAsync(string email, CancellationToken ct)
```

Every public member must have XML documentation.

## xUnit Test Patterns

```csharp
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repoMock = new();
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _sut = new UserService(_repoMock.Object);
    }

    [Fact]
    public async Task CreateUser_ValidEmail_ReturnsUser()
    {
        _repoMock.Setup(r => r.SaveAsync(It.IsAny<User>(), default))
            .ReturnsAsync(new User("test@example.com"));
        var result = await _sut.CreateUserAsync("test@example.com", default);
        Assert.Equal("test@example.com", result.Email);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task CreateUser_InvalidEmail_Throws(string? email)
    {
        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.CreateUserAsync(email!, default));
    }
}
```

- `[Fact]` for single cases, `[Theory]` + `[InlineData]` for parameterized
- Name: `Method_Scenario_ExpectedResult`, use Moq for mocking
