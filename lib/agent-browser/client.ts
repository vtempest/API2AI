/**
 * AgentBrowserClient - API wrapper for controlling agent-browser via MCP tool calls
 *
 * This client provides a type-safe interface for automating browser interactions
 * through the agent-browser MCP server.
 */

import {
  BrowserSession,
  ElementRef,
  SnapshotOptions,
  SnapshotResult,
  ScreenshotOptions,
  WaitOptions,
  FindOptions,
  BrowserState,
  ScrollDirection,
  KeyboardKey,
  MCPToolCall,
  MCPToolResponse,
} from './types';

export class AgentBrowserClient {
  private sessionId?: string;
  private mcpClient: any; // MCP client instance

  constructor(mcpClient: any, sessionId?: string) {
    this.mcpClient = mcpClient;
    this.sessionId = sessionId;
  }

  /**
   * Execute an MCP tool call to agent-browser
   */
  private async executeTool(command: string, args: string[] = []): Promise<MCPToolResponse> {
    const toolCall: MCPToolCall = {
      name: 'agent-browser',
      arguments: {
        command,
        args,
        session: this.sessionId,
      },
    };

    // Call the MCP server
    const response = await this.mcpClient.callTool(toolCall);
    return response;
  }

  /**
   * Build command arguments with session support
   */
  private buildArgs(...args: string[]): string[] {
    const cmdArgs: string[] = [];

    if (this.sessionId) {
      cmdArgs.push('--session', this.sessionId);
    }

    return [...cmdArgs, ...args];
  }

  // ============================================================================
  // Navigation Commands
  // ============================================================================

  /**
   * Navigate to a URL
   */
  async open(url: string, options?: { headed?: boolean }): Promise<void> {
    const args = this.buildArgs('open', url);
    if (options?.headed) {
      args.push('--headed');
    }
    await this.executeTool('open', args);
  }

  /**
   * Go back in browser history
   */
  async back(): Promise<void> {
    await this.executeTool('back', this.buildArgs('back'));
  }

  /**
   * Go forward in browser history
   */
  async forward(): Promise<void> {
    await this.executeTool('forward', this.buildArgs('forward'));
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.executeTool('reload', this.buildArgs('reload'));
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    await this.executeTool('close', this.buildArgs('close'));
  }

  // ============================================================================
  // Snapshot Commands (Page Analysis)
  // ============================================================================

  /**
   * Get a snapshot of the current page state
   * Returns accessibility tree with interactive elements and their refs
   */
  async snapshot(options?: SnapshotOptions): Promise<SnapshotResult> {
    const args = this.buildArgs('snapshot');

    if (options?.interactive) args.push('-i');
    if (options?.compact) args.push('-c');
    if (options?.depth) args.push('-d', options.depth.toString());
    if (options?.json) args.push('--json');

    const response = await this.executeTool('snapshot', args);

    // Parse the snapshot response
    const text = response.content[0]?.text || '';

    if (options?.json) {
      return JSON.parse(text);
    }

    // Parse text output to extract element refs
    const elements = this.parseSnapshotElements(text);

    return {
      elements,
      tree: text,
      url: '',
      title: '',
    };
  }

  /**
   * Parse snapshot text to extract element references
   */
  private parseSnapshotElements(text: string): ElementRef[] {
    const elements: ElementRef[] = [];
    const refPattern = /\[ref=(@?e\d+)\]/g;
    const lines = text.split('\n');

    for (const line of lines) {
      const match = refPattern.exec(line);
      if (match) {
        const ref = match[1];
        // Extract element type and name from the line
        const typeMatch = line.match(/(\w+)\s+"([^"]+)"/);

        elements.push({
          ref,
          type: typeMatch?.[1] || 'element',
          name: typeMatch?.[2],
          text: line.trim(),
        });
      }
    }

    return elements;
  }

  // ============================================================================
  // Interaction Commands
  // ============================================================================

  /**
   * Click an element by reference
   */
  async click(ref: string): Promise<void> {
    await this.executeTool('click', this.buildArgs('click', ref));
  }

  /**
   * Double-click an element
   */
  async doubleClick(ref: string): Promise<void> {
    await this.executeTool('dblclick', this.buildArgs('dblclick', ref));
  }

  /**
   * Fill an input field (clears then types)
   */
  async fill(ref: string, text: string): Promise<void> {
    await this.executeTool('fill', this.buildArgs('fill', ref, text));
  }

  /**
   * Type text without clearing
   */
  async type(ref: string, text: string): Promise<void> {
    await this.executeTool('type', this.buildArgs('type', ref, text));
  }

  /**
   * Press a keyboard key
   */
  async press(key: KeyboardKey): Promise<void> {
    await this.executeTool('press', this.buildArgs('press', key));
  }

  /**
   * Hover over an element
   */
  async hover(ref: string): Promise<void> {
    await this.executeTool('hover', this.buildArgs('hover', ref));
  }

  /**
   * Check a checkbox
   */
  async check(ref: string): Promise<void> {
    await this.executeTool('check', this.buildArgs('check', ref));
  }

  /**
   * Uncheck a checkbox
   */
  async uncheck(ref: string): Promise<void> {
    await this.executeTool('uncheck', this.buildArgs('uncheck', ref));
  }

  /**
   * Select an option from a dropdown
   */
  async select(ref: string, value: string): Promise<void> {
    await this.executeTool('select', this.buildArgs('select', ref, value));
  }

  /**
   * Scroll the page
   */
  async scroll(direction: ScrollDirection, pixels: number): Promise<void> {
    await this.executeTool('scroll', this.buildArgs('scroll', direction, pixels.toString()));
  }

  /**
   * Scroll an element into view
   */
  async scrollIntoView(ref: string): Promise<void> {
    await this.executeTool('scrollintoview', this.buildArgs('scrollintoview', ref));
  }

  // ============================================================================
  // Get Information Commands
  // ============================================================================

  /**
   * Get text content of an element
   */
  async getText(ref: string): Promise<string> {
    const response = await this.executeTool('get', this.buildArgs('get', 'text', ref));
    return response.content[0]?.text || '';
  }

  /**
   * Get value of an input element
   */
  async getValue(ref: string): Promise<string> {
    const response = await this.executeTool('get', this.buildArgs('get', 'value', ref));
    return response.content[0]?.text || '';
  }

  /**
   * Get current page title
   */
  async getTitle(): Promise<string> {
    const response = await this.executeTool('get', this.buildArgs('get', 'title'));
    return response.content[0]?.text || '';
  }

  /**
   * Get current page URL
   */
  async getUrl(): Promise<string> {
    const response = await this.executeTool('get', this.buildArgs('get', 'url'));
    return response.content[0]?.text || '';
  }

  // ============================================================================
  // Screenshot Commands
  // ============================================================================

  /**
   * Take a screenshot
   */
  async screenshot(options?: ScreenshotOptions): Promise<string | Buffer> {
    const args = this.buildArgs('screenshot');

    if (options?.path) args.push(options.path);
    if (options?.fullPage) args.push('--full');
    if (options?.json) args.push('--json');

    const response = await this.executeTool('screenshot', args);

    // Return image data or path
    if (response.content[0]?.type === 'image') {
      return response.content[0].data || '';
    }

    return response.content[0]?.text || '';
  }

  // ============================================================================
  // Wait Commands
  // ============================================================================

  /**
   * Wait for an element, time, or condition
   */
  async wait(refOrMs: string | number, options?: WaitOptions): Promise<void> {
    const args = this.buildArgs('wait');

    if (typeof refOrMs === 'number') {
      args.push(refOrMs.toString());
    } else {
      args.push(refOrMs);
    }

    if (options?.text) args.push('--text', options.text);
    if (options?.load) args.push('--load', options.load);

    await this.executeTool('wait', args);
  }

  // ============================================================================
  // Semantic Locator Commands
  // ============================================================================

  /**
   * Find and interact with elements using semantic locators
   */
  async find(options: FindOptions, action: 'click' | 'fill', value?: string): Promise<void> {
    const args = this.buildArgs('find', options.type, options.value, action);

    if (options.name) args.push('--name', options.name);
    if (value) args.push(value);

    await this.executeTool('find', args);
  }

  // ============================================================================
  // State Management
  // ============================================================================

  /**
   * Save browser state (cookies, localStorage, etc.)
   */
  async saveState(path: string): Promise<void> {
    await this.executeTool('state', this.buildArgs('state', 'save', path));
  }

  /**
   * Load browser state
   */
  async loadState(path: string): Promise<void> {
    await this.executeTool('state', this.buildArgs('state', 'load', path));
  }

  // ============================================================================
  // Debugging Commands
  // ============================================================================

  /**
   * Get console messages
   */
  async getConsole(): Promise<string[]> {
    const response = await this.executeTool('console', this.buildArgs('console'));
    const text = response.content[0]?.text || '';
    return text.split('\n').filter(line => line.trim());
  }

  /**
   * Get page errors
   */
  async getErrors(): Promise<string[]> {
    const response = await this.executeTool('errors', this.buildArgs('errors'));
    const text = response.content[0]?.text || '';
    return text.split('\n').filter(line => line.trim());
  }

  // ============================================================================
  // Session Management
  // ============================================================================

  /**
   * Create a new session
   */
  static async createSession(mcpClient: any, sessionId: string): Promise<AgentBrowserClient> {
    return new AgentBrowserClient(mcpClient, sessionId);
  }

  /**
   * List all active sessions
   */
  static async listSessions(mcpClient: any): Promise<string[]> {
    const toolCall: MCPToolCall = {
      name: 'agent-browser',
      arguments: {
        command: 'session',
        args: ['list'],
      },
    };

    const response = await mcpClient.callTool(toolCall);
    const text = response.content[0]?.text || '';
    return text.split('\n').filter(line => line.trim());
  }
}
