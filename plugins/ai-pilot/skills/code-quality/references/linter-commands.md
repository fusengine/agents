# Linter Commands by Language

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
