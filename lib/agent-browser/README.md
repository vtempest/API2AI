# AgentBrowser API Wrapper

A type-safe TypeScript wrapper for controlling the [agent-browser](https://github.com/modelcontextprotocol/servers/tree/main/src/agent-browser) MCP server through tool calls.

## Overview

This wrapper provides a clean, Promise-based API for automating browser interactions via the Model Context Protocol (MCP). It's designed for:

- 🧪 **E2E Testing** - Automated web application testing
- 🤖 **Web Automation** - Form filling, data extraction, screenshots
- 🔐 **Auth Flows** - Login automation with state persistence
- 📊 **Web Scraping** - Data extraction from websites
- 🎯 **Multi-Session** - Parallel browser automation

## Installation

```bash
npm install @modelcontextprotocol/sdk
```

## Quick Start

```typescript
import { AgentBrowserClient } from '@/lib/agent-browser';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

// Initialize MCP client
const mcpClient = new Client({
  name: 'my-app',
  version: '1.0.0',
});

// Create browser client
const browser = new AgentBrowserClient(mcpClient);

// Navigate and interact
await browser.open('https://example.com');
const snapshot = await browser.snapshot({ interactive: true });
await browser.fill(snapshot.elements[0].ref, 'Hello World');
await browser.click(snapshot.elements[1].ref);
await browser.close();
```

## Core Workflow

The typical workflow with AgentBrowser follows this pattern:

1. **Navigate** to a URL
2. **Snapshot** to get interactive elements with refs
3. **Interact** using the refs from the snapshot
4. **Re-snapshot** after navigation or DOM changes

```typescript
// 1. Navigate
await browser.open('https://example.com/form');

// 2. Snapshot - get element references
const snapshot = await browser.snapshot({ interactive: true });
// Returns: textbox "Email" [ref=@e1], button "Submit" [ref=@e2]

// 3. Interact using refs
await browser.fill('@e1', 'user@example.com');
await browser.click('@e2');

// 4. Re-snapshot after changes
await browser.wait({ load: 'networkidle' });
const newSnapshot = await browser.snapshot({ interactive: true });
```

## API Reference

### Navigation

```typescript
await browser.open(url: string, options?: { headed?: boolean })
await browser.back()
await browser.forward()
await browser.reload()
await browser.close()
```

### Snapshot (Page Analysis)

```typescript
const snapshot = await browser.snapshot({
  interactive?: boolean,  // Show only interactive elements (recommended)
  compact?: boolean,      // Compact output format
  depth?: number,         // Limit tree depth
  json?: boolean,         // JSON output format
});

// Returns:
interface SnapshotResult {
  elements: ElementRef[];  // Array of { ref, type, name, text }
  tree: string;           // Full accessibility tree
  url: string;
  title: string;
}
```

### Interactions

```typescript
// Basic interactions
await browser.click(ref: string)
await browser.doubleClick(ref: string)
await browser.fill(ref: string, text: string)
await browser.type(ref: string, text: string)
await browser.hover(ref: string)

// Form elements
await browser.check(ref: string)
await browser.uncheck(ref: string)
await browser.select(ref: string, value: string)

// Keyboard
await browser.press(key: KeyboardKey)
// Examples: 'Enter', 'Tab', 'Control+a', 'Control+c'

// Scrolling
await browser.scroll(direction: 'up'|'down'|'left'|'right', pixels: number)
await browser.scrollIntoView(ref: string)
```

### Get Information

```typescript
const text = await browser.getText(ref: string)
const value = await browser.getValue(ref: string)
const title = await browser.getTitle()
const url = await browser.getUrl()
```

### Screenshots

```typescript
await browser.screenshot({
  path?: string,      // Save to file path
  fullPage?: boolean, // Capture full page
  json?: boolean,     // JSON output
})
```

### Wait Commands

```typescript
// Wait for element
await browser.wait(ref: string)

// Wait for time (milliseconds)
await browser.wait(2000)

// Wait for conditions
await browser.wait(ref, {
  text?: string,
  timeout?: number,
  load?: 'load' | 'domcontentloaded' | 'networkidle'
})
```

### Semantic Locators

Alternative to refs - find elements by semantic meaning:

```typescript
// Find by role
await browser.find(
  { type: 'role', value: 'button', name: 'Submit' },
  'click'
)

// Find by text
await browser.find(
  { type: 'text', value: 'Sign In' },
  'click'
)

// Find by label and fill
await browser.find(
  { type: 'label', value: 'Email' },
  'fill',
  'user@example.com'
)
```

### State Management

Save and restore browser state (cookies, localStorage, etc.):

```typescript
// Save authenticated state
await browser.saveState('auth.json')

// Later: restore state
await browser.loadState('auth.json')
await browser.open('https://app.example.com/dashboard')
```

### Debugging

```typescript
// Get console messages
const logs = await browser.getConsole()

// Get page errors
const errors = await browser.getErrors()

// Open with visible browser (headed mode)
await browser.open('https://example.com', { headed: true })
```

### Multi-Session Support

Run multiple browsers in parallel:

```typescript
// Create separate sessions
const browser1 = await AgentBrowserClient.createSession(mcpClient, 'session-1')
const browser2 = await AgentBrowserClient.createSession(mcpClient, 'session-2')

await browser1.open('https://site-a.com')
await browser2.open('https://site-b.com')

// List all sessions
const sessions = await AgentBrowserClient.listSessions(mcpClient)
```

## Examples

### Example 1: Form Submission

```typescript
async function submitContactForm() {
  const browser = new AgentBrowserClient(mcpClient);

  await browser.open('https://example.com/contact');
  const snapshot = await browser.snapshot({ interactive: true });

  // Fill form fields
  await browser.fill('@e1', 'user@example.com');
  await browser.fill('@e2', 'Hello from automation!');

  // Submit
  await browser.click('@e3');
  await browser.wait({ text: 'Success' });

  await browser.close();
}
```

### Example 2: Authentication Flow

```typescript
async function loginAndSaveSession() {
  const browser = new AgentBrowserClient(mcpClient);

  // Login
  await browser.open('https://app.example.com/login');
  await browser.snapshot({ interactive: true });
  await browser.fill('@e1', 'user@example.com');
  await browser.fill('@e2', 'password123');
  await browser.click('@e3');

  // Wait for login
  await browser.wait({ load: 'networkidle' });

  // Save state
  await browser.saveState('auth-session.json');

  await browser.close();
}

async function useAuthenticatedSession() {
  const browser = new AgentBrowserClient(mcpClient);

  // Load saved state
  await browser.loadState('auth-session.json');
  await browser.open('https://app.example.com/dashboard');

  // Already authenticated!
  await browser.close();
}
```

### Example 3: E2E Testing

```typescript
async function testUserRegistration() {
  const browser = new AgentBrowserClient(mcpClient);

  try {
    // Navigate to registration
    await browser.open('https://app.example.com/register');

    // Fill registration form
    await browser.snapshot({ interactive: true });
    await browser.fill('@e1', 'newuser@example.com');
    await browser.fill('@e2', 'SecurePass123!');
    await browser.check('@e3'); // Terms checkbox
    await browser.click('@e4'); // Submit

    // Verify success
    await browser.wait({ text: 'Registration successful' });

    // Take screenshot evidence
    await browser.screenshot({ path: 'test-success.png' });

    console.log('✓ Test passed');
  } catch (error) {
    // Capture failure state
    await browser.screenshot({ path: 'test-failure.png' });
    const errors = await browser.getErrors();
    console.error('✗ Test failed:', errors);
    throw error;
  } finally {
    await browser.close();
  }
}
```

### Example 4: Web Scraping

```typescript
async function scrapeArticles() {
  const browser = new AgentBrowserClient(mcpClient);

  await browser.open('https://news.example.com');
  const snapshot = await browser.snapshot({ depth: 3 });

  const articles = [];

  for (const element of snapshot.elements) {
    if (element.type === 'heading') {
      const title = await browser.getText(element.ref);
      articles.push({ title });
    }
  }

  await browser.screenshot({ path: 'news-page.png', fullPage: true });
  await browser.close();

  return articles;
}
```

## Running the Demo

```bash
# Run all demo examples
npx tsx lib/agent-browser/demo.ts

# Or import specific demos
import { demoFormInteraction, demoE2ETesting } from '@/lib/agent-browser/demo';
await demoFormInteraction();
await demoE2ETesting();
```

## Architecture

```
lib/agent-browser/
├── index.ts        # Main exports
├── types.ts        # TypeScript type definitions
├── client.ts       # AgentBrowserClient implementation
├── demo.ts         # Demo examples and usage patterns
└── README.md       # This file
```

The wrapper converts high-level TypeScript methods into MCP tool calls:

```typescript
// Your code
await browser.click('@e1');

// Becomes MCP tool call
{
  name: 'agent-browser',
  arguments: {
    command: 'click',
    args: ['click', '@e1']
  }
}
```

## Best Practices

1. **Always snapshot after navigation** - DOM refs change after page loads
2. **Use interactive snapshots** - Reduces noise: `snapshot({ interactive: true })`
3. **Wait for network idle** - Ensure dynamic content loads: `wait({ load: 'networkidle' })`
4. **Save state for auth flows** - Avoid re-logging in: `saveState()` / `loadState()`
5. **Use semantic locators** - More stable than refs: `find({ type: 'role', ... })`
6. **Handle errors gracefully** - Capture screenshots and logs on failure
7. **Close sessions** - Always call `close()` to cleanup resources

## MCP Server Setup

This wrapper requires the agent-browser MCP server. To set it up:

1. Install the agent-browser MCP server
2. Configure your MCP client to connect to it
3. Pass the MCP client to `AgentBrowserClient`

See the [agent-browser documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/agent-browser) for server setup details.

## Type Safety

The wrapper is fully typed with TypeScript:

```typescript
import type {
  ElementRef,
  SnapshotResult,
  SnapshotOptions,
  KeyboardKey,
  ScrollDirection,
} from '@/lib/agent-browser';
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
