/**
 * Demo: AgentBrowser API Wrapper Usage Examples
 *
 * This demo shows how to use the AgentBrowserClient to automate browser interactions
 * through MCP tool calls.
 */

import { AgentBrowserClient } from './client';

/**
 * Mock MCP Client for demonstration purposes
 * In production, replace this with an actual MCP client instance
 */
class MockMCPClient {
  async callTool(toolCall: any) {
    console.log('MCP Tool Call:', JSON.stringify(toolCall, null, 2));

    // Mock response structure
    return {
      content: [
        {
          type: 'text',
          text: 'Mock response from agent-browser',
        },
      ],
    };
  }
}

/**
 * Demo 1: Basic Navigation and Snapshot
 */
async function demoBasicNavigation() {
  console.log('\n=== Demo 1: Basic Navigation and Snapshot ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  // Navigate to a webpage
  await browser.open('https://example.com');
  console.log('Navigated to example.com');

  // Get a snapshot of interactive elements
  const snapshot = await browser.snapshot({ interactive: true });
  console.log('Interactive elements found:', snapshot.elements.length);

  // Get page information
  const title = await browser.getTitle();
  const url = await browser.getUrl();
  console.log('Page title:', title);
  console.log('Current URL:', url);

  await browser.close();
}

/**
 * Demo 2: Form Filling and Submission
 */
async function demoFormInteraction() {
  console.log('\n=== Demo 2: Form Filling and Submission ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  // Navigate to form page
  await browser.open('https://example.com/contact');

  // Get interactive elements
  const snapshot = await browser.snapshot({ interactive: true });

  // Assuming the snapshot returns refs like @e1, @e2, @e3
  // In real usage, you'd parse the snapshot to find specific elements
  const emailInput = '@e1';
  const messageInput = '@e2';
  const submitButton = '@e3';

  // Fill form fields
  await browser.fill(emailInput, 'user@example.com');
  await browser.fill(messageInput, 'Hello from AgentBrowser!');

  // Submit the form
  await browser.click(submitButton);

  // Wait for navigation or success message
  await browser.wait('@e4', { text: 'Success' });

  console.log('Form submitted successfully');

  await browser.close();
}

/**
 * Demo 3: Authentication Flow with State Management
 */
async function demoAuthentication() {
  console.log('\n=== Demo 3: Authentication Flow ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  // Navigate to login page
  await browser.open('https://app.example.com/login');

  // Get login form elements
  const snapshot = await browser.snapshot({ interactive: true });

  // Fill login credentials
  await browser.fill('@e1', 'testuser@example.com');
  await browser.fill('@e2', 'password123');
  await browser.click('@e3'); // Login button

  // Wait for successful login
  await browser.wait('2000');
  await browser.wait({ load: 'networkidle' });

  // Save authenticated state for later use
  await browser.saveState('auth-session.json');
  console.log('Authenticated state saved');

  await browser.close();

  // Later: Load the saved state
  const browser2 = new AgentBrowserClient(mcpClient);
  await browser2.loadState('auth-session.json');
  await browser2.open('https://app.example.com/dashboard');
  console.log('Resumed authenticated session');

  await browser2.close();
}

/**
 * Demo 4: Web Scraping and Data Extraction
 */
async function demoDataExtraction() {
  console.log('\n=== Demo 4: Data Extraction ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  await browser.open('https://news.example.com');

  // Get full page snapshot
  const snapshot = await browser.snapshot({ depth: 3 });

  // Extract data from elements
  const headlines: string[] = [];

  for (const element of snapshot.elements) {
    if (element.type === 'heading') {
      const text = await browser.getText(element.ref);
      headlines.push(text);
    }
  }

  console.log('Extracted headlines:', headlines);

  // Take a screenshot
  await browser.screenshot({ path: 'news-page.png', fullPage: true });
  console.log('Screenshot saved');

  await browser.close();
}

/**
 * Demo 5: Multi-Session Browser Automation
 */
async function demoMultipleSessions() {
  console.log('\n=== Demo 5: Multiple Sessions ===\n');

  const mcpClient = new MockMCPClient();

  // Create separate browser sessions
  const browser1 = await AgentBrowserClient.createSession(mcpClient, 'session-1');
  const browser2 = await AgentBrowserClient.createSession(mcpClient, 'session-2');

  // Each session operates independently
  await browser1.open('https://site-a.com');
  await browser2.open('https://site-b.com');

  console.log('Session 1 URL:', await browser1.getUrl());
  console.log('Session 2 URL:', await browser2.getUrl());

  // List all active sessions
  const sessions = await AgentBrowserClient.listSessions(mcpClient);
  console.log('Active sessions:', sessions);

  await browser1.close();
  await browser2.close();
}

/**
 * Demo 6: Advanced Interactions
 */
async function demoAdvancedInteractions() {
  console.log('\n=== Demo 6: Advanced Interactions ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  await browser.open('https://example.com/app');

  // Keyboard shortcuts
  await browser.press('Control+a');
  await browser.press('Control+c');

  // Hover interactions
  await browser.hover('@e1');
  await browser.wait(500);

  // Double-click
  await browser.doubleClick('@e2');

  // Checkbox operations
  await browser.check('@e3');
  await browser.uncheck('@e3');

  // Dropdown selection
  await browser.select('@e4', 'option-value');

  // Scrolling
  await browser.scroll('down', 500);
  await browser.scrollIntoView('@e5');

  // Semantic locators (find by role/text/label)
  await browser.find({ type: 'role', value: 'button', name: 'Submit' }, 'click');
  await browser.find({ type: 'label', value: 'Email' }, 'fill', 'user@example.com');

  await browser.close();
}

/**
 * Demo 7: Error Handling and Debugging
 */
async function demoDebugging() {
  console.log('\n=== Demo 7: Debugging ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  // Open with headed mode for visual debugging
  await browser.open('https://example.com', { headed: true });

  // Check console messages
  const consoleLogs = await browser.getConsole();
  console.log('Console messages:', consoleLogs);

  // Check for errors
  const errors = await browser.getErrors();
  if (errors.length > 0) {
    console.log('Page errors detected:', errors);
  }

  await browser.close();
}

/**
 * Demo 8: E2E Testing Workflow
 */
async function demoE2ETesting() {
  console.log('\n=== Demo 8: E2E Testing Workflow ===\n');

  const mcpClient = new MockMCPClient();
  const browser = new AgentBrowserClient(mcpClient);

  try {
    // Test: User Registration Flow
    await browser.open('https://app.example.com/register');

    const snapshot = await browser.snapshot({ interactive: true });

    // Fill registration form
    await browser.fill('@e1', 'newuser@example.com');
    await browser.fill('@e2', 'SecurePassword123!');
    await browser.fill('@e3', 'SecurePassword123!');
    await browser.check('@e4'); // Terms checkbox
    await browser.click('@e5'); // Submit

    // Verify success
    await browser.wait({ text: 'Registration successful' });

    // Take evidence screenshot
    await browser.screenshot({ path: 'test-registration-success.png' });

    console.log('✓ Registration test passed');

    // Test: Navigate to dashboard
    await browser.open('https://app.example.com/dashboard');
    await browser.wait({ load: 'networkidle' });

    const dashboardTitle = await browser.getTitle();
    console.log('✓ Dashboard loaded:', dashboardTitle);

    // Test: Feature interaction
    await browser.find({ type: 'role', value: 'button', name: 'Create New' }, 'click');
    await browser.wait(1000);

    console.log('✓ All E2E tests passed');
  } catch (error) {
    console.error('✗ Test failed:', error);

    // Capture error state
    await browser.screenshot({ path: 'test-failure.png' });

    const errors = await browser.getErrors();
    console.error('Page errors:', errors);
  } finally {
    await browser.close();
  }
}

/**
 * Run all demos
 */
export async function runAllDemos() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   AgentBrowser API Wrapper - Demo Examples                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const demos = [
    { name: 'Basic Navigation', fn: demoBasicNavigation },
    { name: 'Form Interaction', fn: demoFormInteraction },
    { name: 'Authentication', fn: demoAuthentication },
    { name: 'Data Extraction', fn: demoDataExtraction },
    { name: 'Multiple Sessions', fn: demoMultipleSessions },
    { name: 'Advanced Interactions', fn: demoAdvancedInteractions },
    { name: 'Debugging', fn: demoDebugging },
    { name: 'E2E Testing', fn: demoE2ETesting },
  ];

  for (const demo of demos) {
    try {
      await demo.fn();
    } catch (error) {
      console.error(`Error in ${demo.name}:`, error);
    }
  }

  console.log('\n✅ All demos completed\n');
}

// Export individual demos for selective execution
export {
  demoBasicNavigation,
  demoFormInteraction,
  demoAuthentication,
  demoDataExtraction,
  demoMultipleSessions,
  demoAdvancedInteractions,
  demoDebugging,
  demoE2ETesting,
};

// Run demos if executed directly
if (require.main === module) {
  runAllDemos().catch(console.error);
}
