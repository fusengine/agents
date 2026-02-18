# Linter Commands by Language

## Code Duplication Detection (All Languages)
```bash
# Install
npm install -g jscpd

# Run (auto-detect all languages)
npx jscpd ./src --threshold 5 --reporters console,json --output /tmp/jscpd/

# Run specific language (see duplication-thresholds.md for per-language thresholds)
npx jscpd ./src --format typescript --threshold 3
npx jscpd ./src --format python --threshold 3
npx jscpd ./src --format go --threshold 5
npx jscpd ./src --format php --threshold 5
npx jscpd ./src --format rust --threshold 3
npx jscpd ./src --format java --threshold 10
npx jscpd ./src --format ruby --threshold 5
npx jscpd ./src --format swift --threshold 5
npx jscpd ./src --format c,cpp --threshold 10

# CI/CD (fail on threshold exceeded)
npx jscpd . --threshold 5 --exitCode 1 --reporters console,json
```

See [duplication-thresholds.md](duplication-thresholds.md) for per-language thresholds and .jscpd.json config.

---

## JavaScript/TypeScript
```bash
# Install
bun install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Run
npx eslint . --fix
npx prettier --write .
npx tsc --noEmit
```

## Python
```bash
# Install
pip install pylint black flake8 mypy ruff isort

# Run
ruff check . --fix
black .
mypy .
isort .
```

## Go
```bash
# Install
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Run
go fmt ./...
go vet ./...
golangci-lint run
staticcheck ./...
```

## PHP
```bash
# Install
composer require --dev phpstan/phpstan squizlabs/php_codesniffer friendsofphp/php-cs-fixer

# Run
./vendor/bin/phpstan analyse -l 8
./vendor/bin/phpcs
./vendor/bin/php-cs-fixer fix
```

## Rust
```bash
cargo fmt
cargo clippy -- -D warnings
```

## Java
```bash
mvn checkstyle:check
mvn spotbugs:check
mvn pmd:check
```

## Ruby
```bash
gem install rubocop
rubocop -a
```

## C/C++
```bash
clang-format -i *.cpp *.h
cppcheck --enable=all .
```
