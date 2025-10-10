# react-chatgpt-apps

> React hooks and utilities for building ChatGPT Apps with ease

[![npm version](https://img.shields.io/npm/v/react-chatgpt-apps.svg)](https://www.npmjs.com/package/react-chatgpt-apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A lightweight React library that provides hooks and TypeScript types for building interactive ChatGPT Apps. This library simplifies the integration with the ChatGPT Apps runtime API, making it easier to create responsive and type-safe applications.

## Features

- 🪝 **React Hooks** - Easy-to-use hooks for accessing ChatGPT runtime data
- 📘 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- 🎨 **Theme Aware** - Access theme, display mode, and layout information
- 🔧 **Tool Integration** - Built-in support for tool inputs, outputs, and refresh
- 📱 **Responsive** - Access device type and capabilities information
- 🌍 **Internationalization** - Access user locale information
- ⚡ **Lightweight** - Minimal dependencies, only requires React

## Installation

```bash
npm install react-chatgpt-apps
```

or with yarn:

```bash
yarn add react-chatgpt-apps
```

or with pnpm:

```bash
pnpm add react-chatgpt-apps
```

## Quick Start

```tsx
import {
  useToolInput,
  useToolOutput,
  useOpenAiGlobal,
} from "react-chatgpt-apps";

function MyChatGPTApp() {
  // Access tool input and output
  const toolInput = useToolInput<{ query: string }>();
  const toolOutput = useToolOutput<{ result: string }>();

  // Access theme and display mode
  const theme = useOpenAiGlobal("theme");
  const displayMode = useOpenAiGlobal("displayMode");

  return (
    <div className={`app-${theme}`}>
      <h1>Query: {toolInput?.query}</h1>
      {toolOutput && <p>Result: {toolOutput.result}</p>}
      <p>Display Mode: {displayMode}</p>
    </div>
  );
}
```

## API Reference

### Hooks

#### `useOpenAiGlobal<K>(key)`

Access any global value from the ChatGPT runtime environment.

**Parameters:**

- `key` - The key of the global value to access (see `OpenAiGlobals` type)

**Returns:** The value associated with the specified key

**Example:**

```tsx
const theme = useOpenAiGlobal("theme"); // 'light' | 'dark'
const locale = useOpenAiGlobal("locale"); // e.g., 'en-US'
const maxHeight = useOpenAiGlobal("maxHeight"); // number
const safeArea = useOpenAiGlobal("safeArea"); // SafeArea
const userAgent = useOpenAiGlobal("userAgent"); // UserAgent
const displayMode = useOpenAiGlobal("displayMode"); // 'pip' | 'inline' | 'fullscreen'
```

#### `useToolInput<T>()`

Access the input data passed to the current tool.

**Type Parameter:**

- `T` - The expected type of the tool input

**Returns:** The tool input data of type `T`

**Example:**

```tsx
interface MyToolInput {
  query: string;
  options?: {
    limit: number;
  };
}

const input = useToolInput<MyToolInput>();
console.log(input.query);
```

#### `useToolOutput<T>()`

Access the output data from the current tool.

**Type Parameter:**

- `T` - The expected type of the tool output

**Returns:** The tool output data of type `T | null`

**Example:**

```tsx
interface MyToolOutput {
  results: Array<{ id: string; name: string }>;
  total: number;
}

const output = useToolOutput<MyToolOutput>();
if (output) {
  console.log(`Found ${output.total} results`);
}
```

#### `useToolResponseMetadata()`

Access metadata about the tool response.

**Returns:** Tool response metadata object or `null`

**Example:**

```tsx
const metadata = useToolResponseMetadata();
console.log(metadata);
```

### Functions

#### `refreshTool(name, args)`

Refresh a tool by calling it with new arguments.

**Parameters:**

- `name` - The name of the tool to call
- `args` - Arguments to pass to the tool

**Returns:** `Promise<void>`

**Example:**

```tsx
import { refreshTool } from "react-chatgpt-apps";

async function handleRefresh() {
  await refreshTool("my-tool", { query: "updated query" });
}
```

### Types

#### `OpenAiGlobals`

The global state available from the ChatGPT runtime.

```typescript
type OpenAiGlobals<
  ToolInput = UnknownObject,
  ToolOutput = UnknownObject,
  ToolResponseMetadata = UnknownObject,
  WidgetState = UnknownObject,
> = {
  theme: Theme; // 'light' | 'dark'
  userAgent: UserAgent;
  locale: string;

  // Layout
  maxHeight: number;
  displayMode: DisplayMode; // 'pip' | 'inline' | 'fullscreen'
  safeArea: SafeArea;

  // State
  toolInput: ToolInput;
  toolOutput: ToolOutput | null;
  toolResponseMetadata: ToolResponseMetadata | null;
  widgetState: WidgetState | null;
};
```

#### `Theme`

```typescript
type Theme = "light" | "dark";
```

#### `DisplayMode`

```typescript
type DisplayMode = "pip" | "inline" | "fullscreen";
```

#### `UserAgent`

```typescript
type UserAgent = {
  device: {
    type: "mobile" | "tablet" | "desktop" | "unknown";
  };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
};
```

#### `SafeArea`

```typescript
type SafeArea = {
  insets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};
```

### Global API

The library extends the `window.openai` object with the following methods:

#### `window.openai.callTool(name, args)`

Call a tool on your MCP (Model Context Protocol).

**Parameters:**

- `name` - Tool name
- `args` - Tool arguments

**Returns:** `Promise<{ result: string }>`

#### `window.openai.sendFollowUpMessage({ prompt })`

Trigger a follow-up turn in the ChatGPT conversation.

**Parameters:**

- `prompt` - The follow-up message prompt

**Returns:** `Promise<void>`

#### `window.openai.openExternal({ href })`

Open an external link (redirects web page or mobile app).

**Parameters:**

- `href` - The URL to open

**Returns:** `void`

#### `window.openai.requestDisplayMode({ mode })`

Request a display mode change (inline to fullscreen or PiP).

**Parameters:**

- `mode` - The requested display mode

**Returns:** `Promise<{ mode: DisplayMode }>` - The granted mode (may differ from requested)

**Note:** On mobile, PiP is always coerced to fullscreen.

#### `window.openai.setWidgetState(state)`

Set the widget state.

**Parameters:**

- `state` - The new widget state

**Returns:** `Promise<void>`

## Usage Examples

### Theme-Aware Component

```tsx
import { useOpenAiGlobal } from "react-chatgpt-apps";

function ThemedComponent() {
  const theme = useOpenAiGlobal("theme");

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <h1>Current theme: {theme}</h1>
    </div>
  );
}
```

### Responsive Layout

```tsx
import { useOpenAiGlobal } from "react-chatgpt-apps";

function ResponsiveLayout() {
  const userAgent = useOpenAiGlobal("userAgent");
  const displayMode = useOpenAiGlobal("displayMode");

  const isMobile = userAgent.device.type === "mobile";
  const isFullscreen = displayMode === "fullscreen";

  return (
    <div className={`layout ${isMobile ? "mobile" : "desktop"}`}>
      {isFullscreen ? <FullscreenView /> : <CompactView />}
    </div>
  );
}
```

### Safe Area Handling

```tsx
import { useOpenAiGlobal } from "react-chatgpt-apps";

function SafeAreaComponent() {
  const safeArea = useOpenAiGlobal("safeArea");

  return (
    <div
      style={{
        paddingTop: safeArea.insets.top,
        paddingBottom: safeArea.insets.bottom,
        paddingLeft: safeArea.insets.left,
        paddingRight: safeArea.insets.right,
      }}
    >
      Content respects safe areas
    </div>
  );
}
```

### Tool Integration

```tsx
import { useToolInput, useToolOutput, refreshTool } from "react-chatgpt-apps";

interface SearchInput {
  query: string;
  filters?: {
    category: string;
  };
}

interface SearchOutput {
  results: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  total: number;
}

function SearchTool() {
  const input = useToolInput<SearchInput>();
  const output = useToolOutput<SearchOutput>();

  const handleRefresh = async () => {
    await refreshTool("search", {
      query: input.query,
      filters: input.filters,
    });
  };

  return (
    <div>
      <h2>Search: {input.query}</h2>
      {input.filters && <p>Category: {input.filters.category}</p>}

      <button onClick={handleRefresh}>Refresh</button>

      {output && (
        <div>
          <p>Found {output.total} results</p>
          <ul>
            {output.results.map((result) => (
              <li key={result.id}>
                <h3>{result.title}</h3>
                <p>{result.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Display Mode Management

```tsx
function DisplayModeToggle() {
  const displayMode = useOpenAiGlobal("displayMode");

  const handleToggleFullscreen = async () => {
    const newMode = displayMode === "fullscreen" ? "inline" : "fullscreen";
    const result = await window.openai.requestDisplayMode({ mode: newMode });
    console.log("Granted mode:", result.mode);
  };

  return (
    <button onClick={handleToggleFullscreen}>
      {displayMode === "fullscreen" ? "Exit Fullscreen" : "Go Fullscreen"}
    </button>
  );
}
```

### Follow-Up Messages

```tsx
function FollowUpButton() {
  const handleSendFollowUp = async () => {
    await window.openai.sendFollowUpMessage({
      prompt: "Can you explain this in more detail?",
    });
  };

  return <button onClick={handleSendFollowUp}>Ask for more details</button>;
}
```

## TypeScript Support

This library is written in TypeScript and provides comprehensive type definitions out of the box. All hooks and utilities are fully typed, providing excellent IDE autocomplete and type checking.

### Type Safety with Generics

```tsx
// Define your tool's input/output types
interface MyToolInput {
  query: string;
  limit: number;
}

interface MyToolOutput {
  items: string[];
  count: number;
}

// Get full type safety and autocomplete
const input = useToolInput<MyToolInput>();
const output = useToolOutput<MyToolOutput>();

// TypeScript knows the exact structure
console.log(input.query); // ✅ Type-safe
console.log(input.unknown); // ❌ TypeScript error
```

## Browser Compatibility

This library requires a modern browser environment with support for:

- ES2020 features
- React 18 or later
- CustomEvents API
- Window object

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run the build** (`npm run build`)
5. **Format your code** (`npm run format`)
6. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/tiste/react-chatgpt-apps.git
cd react-chatgpt-apps

# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Format code
npm run format
```

### Project Structure

```
react-chatgpt-apps/
├── src/
│   ├── hooks.ts      # React hooks implementation
│   ├── types.ts      # TypeScript type definitions
│   └── index.ts      # Public API exports
├── scripts/
│   └── build.mjs     # Build script
├── dist/             # Compiled output
├── package.json      # Package configuration
└── tsconfig.json     # TypeScript configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Baptiste Lecocq**

- Website: [https://tiste.io](https://tiste.io)
- Email: baptiste.lecocq@gmail.com

## Support

If you encounter any issues or have questions:

- 🐛 [Report bugs](https://github.com/tiste/react-chatgpt-apps/issues)
- 💡 [Request features](https://github.com/tiste/react-chatgpt-apps/issues)
- 📖 [View documentation](https://github.com/tiste/react-chatgpt-apps#readme)

## Acknowledgments

Built with ❤️ for the ChatGPT Apps community.

---

**Note:** This library is designed to work within the ChatGPT Apps runtime environment. Make sure you're developing a ChatGPT App to use these utilities effectively.
