import { OpenAI } from 'openai';

export class OpenAIProvider {
    constructor(apiKey) {
        this.client = new OpenAI({ apiKey });
    }

    async generate(prompt, config = {}) {
        const completion = await this.client.chat.completions.create({
            model: config.model || "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates concise summaries."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: config.temperature || 0.7,
            max_tokens: config.max_tokens || 150
        });

        return completion.choices[0].message.content;
    }
}
