# Stack-Specific Test Commands

Quick reference for test frameworks, run commands, and watch modes by stack.

---

## Test Commands by Stack

| Stack | Framework | Run Command | Watch Mode |
|-------|-----------|-------------|------------|
| React/Next.js | Vitest | `npx vitest run` | `npx vitest` |
| Laravel | Pest | `php artisan test` | `php artisan test --watch` |
| Swift | XCTest | `swift test` | - |
| Generic TS | Vitest | `bunx vitest run` | `bunx vitest` |
| Go | testing | `go test ./...` | - |
| Rust | cargo test | `cargo test` | `cargo watch -x test` |
| Python | pytest | `pytest` | `ptw` |
| Java/Kotlin | JUnit 5 | `./gradlew test` | - |

---

## Single Test Execution

Run a single test or file during RED-GREEN to get fast feedback:

| Stack | Run Single Test | Run Single File |
|-------|----------------|-----------------|
| Vitest | `npx vitest run -t "test name"` | `npx vitest run path/to/file` |
| Pest | `php artisan test --filter=test_name` | `php artisan test path/to/file` |
| XCTest | `swift test --filter TestClass/testMethod` | `swift test --filter TestClass` |
| Go | `go test -run TestName ./pkg/...` | `go test ./pkg/specific/` |
| Rust | `cargo test test_name` | `cargo test --lib module_name` |
| pytest | `pytest -k "test_name"` | `pytest path/to/file.py` |

---

## Project Detection

Before running tests, detect the stack:

| File Present | Stack | Default Framework |
|-------------|-------|-------------------|
| `vitest.config.*` | TS/React | Vitest |
| `jest.config.*` | TS/React | Jest |
| `phpunit.xml` or `pest.php` | Laravel/PHP | Pest/PHPUnit |
| `Package.swift` | Swift | XCTest |
| `go.mod` | Go | testing |
| `Cargo.toml` | Rust | cargo test |
| `pyproject.toml` or `pytest.ini` | Python | pytest |
| `build.gradle*` | Java/Kotlin | JUnit |

---

## Tips

- **Always use single-test execution during RED-GREEN** for faster feedback
- **Use watch mode during REFACTOR** to catch regressions instantly
- **Run full suite before committing** to verify no regressions
- **Check for existing test config** before adding a new framework
