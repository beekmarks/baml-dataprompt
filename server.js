import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { OpenAIProvider } from './src/lib/openai-provider.js';
import fs from 'fs/promises';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize OpenAI provider
const provider = new OpenAIProvider(process.env.OPENAI_API_KEY);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Load prompt template
async function loadPromptTemplate(templatePath) {
    const content = await fs.readFile(templatePath, 'utf8');
    return yaml.load(content);
}

// Handle summarization requests
app.post('/api/summarize', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            throw new Error('Text is required');
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not set. Please set OPENAI_API_KEY environment variable.');
        }

        // Load the prompt template
        const template = await loadPromptTemplate('./prompts/summarize.prompt');
        
        // Replace template variables
        const prompt = template.prompt.replace('{{text}}', text);
        
        // Generate summary using our provider
        const summary = await provider.generate(prompt, template.config);
        
        res.json({ summary });
    } catch (error) {
        console.error('Summarization error:', error);
        
        // Handle specific OpenAI errors
        if (error.error?.type === 'insufficient_quota') {
            return res.status(402).json({
                error: 'OpenAI API Quota Exceeded',
                message: 'Your OpenAI API key has insufficient quota. Please check your billing details at https://platform.openai.com/account/billing'
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to generate summary',
            message: error.message || 'An unexpected error occurred'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to test the summarizer`);
});
