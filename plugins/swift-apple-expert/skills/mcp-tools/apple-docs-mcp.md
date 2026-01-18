# Apple Docs MCP Usage Guide

**MCP Server for Apple Developer Documentation with offline WWDC access.**

Source: [apple-docs-mcp GitHub](https://github.com/kimsungwhee/apple-docs-mcp)

---

## Installation

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "apple-docs": {
      "command": "npx",
      "args": ["-y", "@kimsungwhee/apple-docs-mcp"]
    }
  }
}
```

---

## Available Tools

### 1. Search Documentation

**Purpose**: Find information across all Apple frameworks

**Searchable content**:
- SwiftUI (views, modifiers, state management)
- UIKit (view controllers, UI components)
- Foundation (data types, networking, file system)
- CoreData (persistence, fetch requests)
- ARKit (augmented reality)
- CoreML (machine learning)
- All other Apple frameworks

**Use when**:
- Starting implementation of new feature
- Looking for specific API
- Exploring available frameworks
- Researching best practices

**Example queries**:
```
"SwiftUI Navigation"
"UITableView delegate methods"
"URLSession async await"
"Core Data relationships"
```

---

### 2. Get Framework Details

**Purpose**: Access detailed information about specific framework

**Use when**:
- Need comprehensive framework overview
- Understanding framework architecture
- Exploring framework capabilities
- Planning implementation strategy

**Returns**:
- Framework description
- Key classes and protocols
- Common usage patterns
- Related frameworks

---

### 3. Get Symbol Information

**Purpose**: Retrieve detailed docs for class, method, property

**Use when**:
- Need exact API signature
- Understanding method parameters
- Checking return types
- Reading detailed documentation

**Returns**:
- Full declaration
- Parameter descriptions
- Return value info
- Code examples
- Availability (iOS 15+, macOS 12+, etc.)

---

### 4. List Technologies

**Purpose**: Explore available Apple frameworks with filtering

**Use when**:
- Discovering available frameworks
- Finding frameworks by category
- Planning technology stack
- Exploring new capabilities

**Returns**: Categorized list of frameworks

---

### 5. Search WWDC Sessions

**Purpose**: Find WWDC videos with transcripts (2014-2025)

**Features**:
- Keyword search
- Topic filtering
- Year filtering
- Full transcripts included
- **Offline access** (bundled in npm package)

**Use when**:
- Learning best practices from Apple engineers
- Understanding new features
- Finding implementation guidance
- Researching design patterns

**Example queries**:
```
"SwiftUI data flow"
"Concurrency Swift 6"
"Core Data performance"
"Metal rendering"
```

**Returns**:
- Session title
- Description
- Transcript
- Code examples
- Resources

---

### 6. Get WWDC Transcript

**Purpose**: Retrieve full transcript for specific WWDC session

**Use when**:
- Need detailed session content
- Extracting code examples
- Finding specific quotes
- Studying implementation details

---

### 7. Get Sample Code

**Purpose**: Access Apple code examples and snippets

**Use when**:
- Need reference implementation
- Learning API usage patterns
- Starting new feature
- Debugging implementation

**Returns**:
- Complete code examples
- Inline documentation
- Usage context

---

## Key Features

### 🚀 Offline WWDC Access

**All WWDC video data (2014-2025) bundled in package**:
- Zero network latency
- Always available
- Complete transcripts
- No API rate limits

### 🔍 Smart Search

Intelligent search across:
- API documentation
- WWDC sessions
- Sample code
- Framework guides

### 📦 Comprehensive Coverage

Access to:
- 100+ Apple frameworks
- Thousands of APIs
- 10+ years of WWDC content
- Official sample code

---

## Best Practices

### 1. Research-First Workflow

```bash
# MANDATORY before coding
1. Search Documentation for API
2. Get Symbol Information (exact signature)
3. Search WWDC for best practices
4. Get Sample Code for reference
5. Implement with official patterns
```

### 2. Priority: Apple Docs > Context7

**Always use Apple Docs MCP FIRST** for:
- SwiftUI APIs
- UIKit components
- Foundation types
- Apple frameworks

**Use Context7** for:
- Third-party libraries
- Community packages
- General Swift syntax

### 3. WWDC Session Research

```bash
# Before implementing new feature
1. Search WWDC sessions for topic
2. Watch/read most recent session
3. Extract code examples
4. Follow Apple's recommended approach
```

### 4. API Verification

```bash
# Always verify before using API
1. Get Symbol Information
2. Check availability (iOS version)
3. Check deprecation status
4. Read parameter requirements
```

---

## Integration with Swift Expert Agent

**Automatic usage when**:
- User asks about Apple API
- Need SwiftUI/UIKit documentation
- Researching framework capabilities
- Looking for code examples

**Priority**: Use BEFORE Context7 for Apple-specific queries.

---

## Example Workflows

### Implementing SwiftUI Navigation

```bash
1. Search Documentation: "SwiftUI NavigationStack"
2. Get Symbol Info: NavigationStack initializer
3. Search WWDC: "SwiftUI navigation iOS 16"
4. Get Sample Code: Navigation examples
5. Implement following Apple patterns
```

### Debugging Core Data Issue

```bash
1. Search Documentation: "Core Data fetch requests"
2. Get Framework Details: Core Data overview
3. Search WWDC: "Core Data performance"
4. Get Symbol Info: NSFetchRequest configuration
5. Apply recommended solutions
```

### Learning New iOS Feature

```bash
1. Search WWDC: "iOS 17 new features"
2. Get WWDC Transcript: Specific session
3. Search Documentation: New APIs
4. Get Sample Code: Implementation examples
5. Experiment with new capabilities
```

---

## Coverage

### Frameworks (100+)
- SwiftUI, UIKit, AppKit
- Foundation, CoreData, CoreML
- ARKit, RealityKit, SceneKit
- AVFoundation, CoreAudio
- Network, CloudKit, HealthKit
- And many more...

### WWDC Years
- 2014 → 2025 (complete coverage)
- All sessions with transcripts
- Code examples included
- Resources and links

---

## Resources

- [GitHub Repository](https://github.com/kimsungwhee/apple-docs-mcp)
- [npm Package](https://www.npmjs.com/@kimsungwhee/apple-docs-mcp)
- [Glama MCP Directory](https://glama.ai/mcp/servers/@kimsungwhee/apple-docs-mcp)
