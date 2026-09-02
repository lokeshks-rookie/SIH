const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const SIMULATION_SERVICE_URL = 'http://127.0.0.1:8000/simulate';

app.use(cors());
app.use(express.json());

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
