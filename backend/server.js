require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const SIMULATION_SERVICE_URL = process.env.SIMULATION_SERVICE_URL || 'http://127.0.0.1:8000/simulate';
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

app.use(cors());
app.use(express.json());

app.post('/api/tutor', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'A message is required.' });
  if (!process.env.AI_API_KEY) return res.status(503).json({ error: 'AI tutor is not configured. Add AI_API_KEY to backend/.env.' });

  try {
    const response = await axios.post(AI_API_URL, {
      model: AI_MODEL,
      temperature: 0.3,
      messages: [
        { role: 'system', content: 'You are Qdemy, a patient quantum computing tutor. Explain concepts accurately at the student\'s level, use small examples, and help debug circuits. Keep answers concise and use plain text.' },
        ...history.slice(-8).map((item) => ({ role: item.role === 'assistant' ? 'assistant' : 'user', content: item.content })),
        { role: 'user', content: message },
      ],
    }, { headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` } });
    res.json({ reply: response.data.choices?.[0]?.message?.content || 'I could not generate a response.' });
  } catch (error) {
    res.status(error.response?.status || 502).json({ error: 'The AI tutor could not be reached.' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', simulationService: SIMULATION_SERVICE_URL }));

app.post('/api/circuits/run', async (req, res) => {
  try {
    const circuitData = req.body;
    
    // Forward the circuit JSON to the FastAPI simulation service
    const response = await axios.post(SIMULATION_SERVICE_URL, circuitData);
    
    // Relay the response back to the frontend
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // The simulation service responded with a status code outside the 2xx range
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      res.status(503).json({ error: 'Simulation service is unavailable. Please try again later.' });
    } else {
      // Something happened in setting up the request
      res.status(500).json({ error: 'An internal server error occurred while connecting to the simulation service.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Express proxy server running on http://localhost:${PORT}`);
});
