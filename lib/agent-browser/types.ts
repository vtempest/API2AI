/**
 * Type definitions for agent-browser MCP tool integration
 */

export interface BrowserSession {
  id: string;
  url?: string;
  isHeaded?: boolean;
}

export interface ElementRef {
  ref: string;
  type: string;
  name?: string;
  text?: string;
}

export interface SnapshotOptions {
  interactive?: boolean;
  compact?: boolean;
  depth?: number;
  json?: boolean;
}

export interface SnapshotResult {
  elements: ElementRef[];
  tree: string;
  url: string;
  title: string;
}

export interface ScreenshotOptions {
  path?: string;
  fullPage?: boolean;
  json?: boolean;
}

export interface WaitOptions {
  selector?: string;
  text?: string;
  timeout?: number;
  load?: 'load' | 'domcontentloaded' | 'networkidle';
}

export interface FindOptions {
  type: 'role' | 'text' | 'label';
  value: string;
  name?: string;
}

export interface BrowserState {
  cookies: any[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

export type ScrollDirection = 'up' | 'down' | 'left' | 'right';

export type KeyboardKey =
  | 'Enter'
  | 'Tab'
  | 'Escape'
  | 'Backspace'
  | 'Delete'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Control+a'
  | 'Control+c'
  | 'Control+v'
  | string;

/**
 * MCP tool call interface for agent-browser
 */
export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPToolResponse {
  content: Array<{
    type: 'text' | 'image';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
}
