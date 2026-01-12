/**
 * AgentBrowser API Wrapper
 *
 * A type-safe TypeScript wrapper for the agent-browser MCP tool.
 * Provides automated browser control via MCP tool calls.
 *
 * @example
 * ```typescript
 * import { AgentBrowserClient } from '@/lib/agent-browser';
 *
 * const browser = new AgentBrowserClient(mcpClient);
 *
 * await browser.open('https://example.com');
 * const snapshot = await browser.snapshot({ interactive: true });
 * await browser.fill(snapshot.elements[0].ref, 'Hello');
 * await browser.click(snapshot.elements[1].ref);
 * ```
 */

export { AgentBrowserClient } from './client';
export * from './types';
