# BAML + Dataprompt Integration Example

This project demonstrates how to effectively combine [BAML](https://github.com/BoundaryML/baml) (Basically a Made Up Language) with [dataprompt](https://github.com/davideast/dataprompt) in a single application. BAML is a domain-specific language for defining type-safe prompts, while dataprompt is a library that enables flexible, YAML-based prompt templating and configuration management with built-in support for various AI providers like OpenAI and Google AI.

While the application itself is a text summarizer, its primary purpose is to showcase how these two prompt engineering approaches can complement each other - BAML providing compile-time type safety and dataprompt offering runtime flexibility and easy prompt iteration.

## Why BAML + Dataprompt?

### BAML's Strengths
- **Type Safety**: Compile-time type checking for prompts
- **Code Generation**: Automatic TypeScript interfaces
- **IDE Integration**: Better development experience with type hints
- **Contract Enforcement**: Ensures consistent input/output structures

### Dataprompt's Strengths
- **Multi-Provider Support**: Built-in integration with OpenAI, Google AI, and other providers
- **Runtime Flexibility**: Easy-to-modify YAML templates
- **Configuration Management**: Simple model and parameter tuning per environment
- **Provider Switching**: Easily switch between AI providers without code changes
- **Prompt Versioning**: Track and manage prompt changes over time
- **Readable Format**: Clear, declarative prompt definitions in YAML

## How BAML and Dataprompt Work Together

The integration uses two complementary files for each prompt:

### Type Definition (`src/prompts/summarize.baml`)
```typescript
// Defines the contract - what goes in, what comes out
class Summary {
    text: String
    summary: String
}

@prompt("Summarize the following text concisely: {text}")
fn summarize(text: String) -> Summary {
    "Generate a concise summary of the provided text."
}
```
This BAML file:
- Defines input/output types
- Enables compile-time checking
- Generates TypeScript interfaces
- Ensures type safety in your code

### Implementation (`prompts/summarize.prompt`)
```yaml
# Defines the actual prompt and runtime configuration
model: gpt-4
config:
  temperature: 0.7
  max_tokens: 150

input:
  text: string

output:
  summary: string

prompt: |
  You are a highly skilled AI assistant specialized in creating concise summaries.
  
  Text to summarize:
  {{text}}
  
  Instructions:
  1. Create a clear and concise summary
  2. Maintain key information
```
This prompt file:
- Contains the actual prompt template
- Configures model parameters
- Can be modified without recompilation
- Supports easy A/B testing of prompts

### Working Together
```javascript
// In your application code:
import { Summary } from './generated/baml';  // BAML-generated types
import { loadPrompt } from 'dataprompt';     // Runtime prompt loading

// BAML ensures type safety
async function summarize(text: string): Promise<Summary> {
    // Dataprompt provides runtime flexibility
    const template = await loadPrompt('./prompts/summarize.prompt');
    return template.execute({ text });
}
```

This separation provides several benefits:
1. **Type Safety**: BAML catches type errors at compile time
2. **Runtime Flexibility**: Change prompts without rebuilding
3. **Clear Contract**: BAML file documents the interface
4. **Easy Testing**: Swap prompt implementations easily

## Integration Architecture

```
baml-dataprompt/
├── prompts/           # Dataprompt runtime templates
│   └── summarize.prompt
├── src/
│   ├── lib/          # Integration layer
│   │   └── openai-provider.js
│   └── prompts/      # BAML type definitions
│       └── summarize.baml
└── [Config Files]
```

### 1. BAML Type Definitions

BAML provides the type-safe foundation (`src/prompts/summarize.baml`):
```typescript
class Summary {
    text: String
    summary: String
}

@prompt("Summarize the following text concisely: {text}")
fn summarize(text: String) -> Summary {
    "Generate a concise summary of the provided text."
}
```

This ensures:
- Type-safe prompt inputs/outputs
- Generated TypeScript interfaces
- Compile-time validation
- IDE support for refactoring

### 2. Dataprompt Templates

Dataprompt handles runtime configuration (`prompts/summarize.prompt`):
```yaml
model: gpt-4
config:
  temperature: 0.7
  max_tokens: 150

input:
  text: string

output:
  summary: string

prompt: |
  You are a highly skilled AI assistant specialized in creating concise summaries.
  Text to summarize: {{text}}
  Instructions:
  1. Create a clear and concise summary
  2. Maintain key information
```

Benefits:
- Easy prompt iteration
- Runtime configuration
- Clear prompt organization
- No recompilation needed

### 3. Integration Layer

The server (`server.js`) demonstrates how to combine both approaches:
```javascript
import { OpenAIProvider } from './src/lib/openai-provider.js';
import yaml from 'js-yaml';

// Load and validate prompt template at runtime
const template = await loadPromptTemplate('./prompts/summarize.prompt');

// Use BAML-generated types for type safety
app.post('/api/summarize', async (req: SummarizeRequest) => {
    const prompt = template.prompt.replace('{{text}}', req.body.text);
    const summary = await provider.generate(prompt, template.config);
    return { summary };
});
```

## Development Workflow

1. **Define Types with BAML**
   ```bash
   # Create type definitions
   touch src/prompts/summarize.baml
   
   # Generate TypeScript interfaces
   baml generate
   ```

2. **Create Runtime Templates**
   ```bash
   # Create prompt template
   touch prompts/summarize.prompt
   
   # Edit and test without recompilation
   ```

3. **Implement Integration**
   ```javascript
   // Use BAML types with dataprompt templates
   const template = loadPromptTemplate();
   const result = generateWithTypes(template);
   ```

## Best Practices

### 1. Type Safety First
- Define core types in BAML
- Use generated interfaces in integration code
- Validate runtime templates against BAML types

### 2. Flexible Prompts
- Keep prompt content in dataprompt templates
- Use YAML for configuration
- Iterate quickly on prompt design

### 3. Clear Separation
- BAML for type definitions
- Dataprompt for runtime templates
- Integration layer to combine both

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   npm install -g @baml/cli
   ```

2. **Configure Environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   # OPENAI_API_KEY=your_api_key_here
   ```

3. **Start the Server**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## Why This Matters

This integration pattern solves common prompt engineering challenges:

1. **Development Experience**
   - Type safety from BAML
   - Quick iterations from dataprompt
   - Best of both worlds

2. **Maintainability**
   - Clear separation of concerns
   - Type-safe refactoring
   - Easy prompt management

3. **Flexibility**
   - Compile-time safety where needed
   - Runtime changes where helpful
   - Scalable prompt organization

## Example App

While the primary focus is on BAML + dataprompt integration, this repo includes a text summarization app as a practical example. The app demonstrates:

- BAML type definitions for summarization
- Dataprompt templates for the summary prompt
- Integration of both systems in a real application
- Client-side persistence using IndexedDB

### Core Files
- `src/prompts/summarize.baml` for BAML usage
- `prompts/summarize.prompt` for dataprompt usage
- `server.js` for integration code

### Client-Side Storage

The application uses IndexedDB to persist summaries in the browser:

```javascript
import { openDB } from 'idb';

// Database configuration
const DB_NAME = 'AIResponsesDB';
const STORE_NAME = 'summaries';

// Initialize database with proper schema
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        // Create indexes for efficient querying
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('text', 'text');
      }
    },
  });
}

// Store a new summary
async function storeSummary({ text, summary }) {
  const db = await getDB();
  await db.add(STORE_NAME, {
    text,
    summary,
    timestamp: new Date().toISOString(),
    modelVersion: 'gpt-4' // Track which model generated the summary
  });
}

// Retrieve all summaries
async function getSummaries() {
  const db = await getDB();
  return db.getAllFromIndex(STORE_NAME, 'timestamp');
}

// Usage in the application
document.querySelector('#summarize-form').onsubmit = async (e) => {
  e.preventDefault();
  const text = document.querySelector('#text-input').value;
  
  // Get summary from server
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const { summary } = await response.json();
  
  // Store in IndexedDB
  await storeSummary({ text, summary });
  
  // Update UI
  await displaySummaries();
};

// Display stored summaries
async function displaySummaries() {
  const summaries = await getSummaries();
  const container = document.querySelector('#summaries-list');
  
  container.innerHTML = summaries
    .map(({ text, summary, timestamp }) => `
      <div class="summary-item">
        <div class="original-text">${text}</div>
        <div class="summary-text">${summary}</div>
        <div class="timestamp">${new Date(timestamp).toLocaleString()}</div>
      </div>
    `)
    .join('');
}

// Load existing summaries on page load
window.addEventListener('load', displaySummaries);
```

This implementation:
1. Creates an IndexedDB database on first use
2. Stores summaries with metadata (timestamp, model version)
3. Provides efficient querying through indexes
4. Automatically displays stored summaries
5. Updates the UI when new summaries are added

## Contributing

Interested in improving this integration pattern?
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See LICENSE file for details
