---
name: interface-segregation
description: Interface Segregation Principle for Java - Small focused interfaces, role-based
when-to-use: fat interfaces, dependency management, interface design
keywords: ISP, interface design, role-based, composition, Java
priority: high
related: single-responsibility.md, dependency-inversion.md
---

# Interface Segregation Principle (ISP)

**Clients should not depend on interfaces they don't use.**

## Fat vs Segregated

### ❌ Bad: Fat Interface (14 methods)
```java
public interface Storage {
    void uploadFile(String path, InputStream data) throws IOException;
    InputStream downloadFile(String path) throws IOException;
    void deleteFile(String path) throws IOException;
    Map<String, Object> getMetadata(String path);
    void setMetadata(String path, Map<String, Object> meta);
    List<String> listDirectory(String path);
    void createDirectory(String path);
    void backupToS3(String bucket);
    void restoreFromS3(String bucket);
    void archiveOlderThan(LocalDate date);
    void compressDirectory(String path);
}

public class LocalFileStorage implements Storage {
    @Override public void backupToS3(String bucket) {
        throw new UnsupportedOperationException(); // Not applicable locally!
    }
}

public class FileUploader {
    private Storage storage; // Uses 3 methods, depends on 14!
}
```

### ✅ Good: Segregated (role-based)
```java
public interface FileStorage {
    void uploadFile(String path, InputStream data) throws IOException;
    InputStream downloadFile(String path) throws IOException;
    void deleteFile(String path) throws IOException;
}

public interface StorageMetadata {
    Map<String, Object> getMetadata(String path);
    void setMetadata(String path, Map<String, Object> meta);
}

public interface DirectoryOperations {
    List<String> listDirectory(String path);
    void createDirectory(String path);
}

public interface CloudBackup {
    void backupToS3(String bucket);
    void restoreFromS3(String bucket);
}

public class LocalFileStorage implements FileStorage, DirectoryOperations {
    // No unused methods!
}

public class S3Storage implements FileStorage, StorageMetadata, CloudBackup {
    // Only needed operations
}

public class FileUploader {
    private final FileStorage storage; // Uses 3 methods, depends on 3!
}
```

## Role-Based Naming

```java
// ✅ CLEAR ROLES
public interface UserRepository { }      // Data access
public interface UserValidator { }       // Business rules
public interface UserNotificationSender { } // Email/SMS

// ❌ AMBIGUOUS
public interface UserService { }  // What service?
public interface UserHelper { }   // Helper for what?
```

## Composition Over Fat

Break fat interfaces into focused pieces clients compose:

```java
public interface OrderReader {
    Order findById(Long id);
}
public interface OrderWriter {
    Order save(Order order);
}
public interface OrderPricing {
    BigDecimal calculateTotal(Order order);
}

@Service
public class CheckoutService {
    private final OrderWriter writer;
    private final OrderPricing pricing;

    public CheckoutService(OrderWriter w, OrderPricing p) {
        this.writer = w;
        this.pricing = p;
    }

    public Order checkout(Order order) {
        order.setTotal(pricing.calculateTotal(order));
        return writer.save(order);
    }
}
```

## Refactoring Checklist

- [ ] No interface with > 5-6 methods
- [ ] Each interface has single role/responsibility
- [ ] Clients use most methods they depend on
- [ ] No `UnsupportedOperationException` in implementations
- [ ] Role names signal purpose (Reader, Writer, Validator)
- [ ] Optional features in separate interfaces
- [ ] All interfaces in `modules/[feature]/interfaces/`
