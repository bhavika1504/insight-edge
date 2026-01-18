import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
console.log('Loaded API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT LOADED');

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            console.error('Gemini API key not configured');
            return res.status(500).json({ error: 'API key not configured. Please add GEMINI_API_KEY to .env file.' });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Try multiple models in case one has quota issues
        // Verified available models from ListModels API
        const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
        let lastError: any = null;

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                const context = history?.slice(-6).map((m: any) => `${m.role}: ${m.content}`).join('\n') || '';
                const prompt = `You are a helpful assistant for InsightEdge, a Smart Cities career guidance platform. Be concise and helpful.\n\n${context}\nuser: ${message}\nassistant:`;

                const result = await model.generateContent(prompt);
                const response = result.response.text();

                console.log(`Success with model: ${modelName}`);
                return res.json({ response });
            } catch (modelError: any) {
                console.log(`Model ${modelName} failed:`, modelError?.message?.substring(0, 100));
                lastError = modelError;
                // Continue to next model
            }
        }

        // All models failed
        throw lastError;
    } catch (error: any) {
        console.error('Gemini API error:', error?.message || error);

        // Check for rate limit error
        if (error?.message?.includes('quota') || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
            return res.status(429).json({ error: 'API rate limit reached. Please wait a moment and try again.' });
        }

        res.status(500).json({ error: error?.message || 'Failed to get response from AI' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
