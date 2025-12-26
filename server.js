require('dotenv').config();
const fetch = require('node-fetch').default;
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser les requêtes depuis votre PWA
// Middleware pour gérer les requêtes CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://srv-ped2.iut-acv_univ-smb.fr'); // ⚠️ Votre domaine
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.header('Access-Control-Allow-Credentials', 'true'); // Si vous utilisez des cookies

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Middleware pour parser le JSON
app.use(express.json());

// Endpoint pour les billets d'un événement
app.get('/api/event/:eventId/tickets', async (req, res) => {
  const { eventId } = req.params;
  const url = `https://api.infomaniak.com/1/event/${eventId}/tickets`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erreur API Infomaniak', details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Endpoint pour scanner un billet (exemple)
app.post('/api/event/:eventId/ticket/:ticketId/scan', async (req, res) => {
  const { eventId, ticketId } = req.params;
  const url = `https://api.infomaniak.com/1/event/${eventId}/ticket/${ticketId}/scan`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erreur API Infomaniak', details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.send('Proxy Infomaniak fonctionne ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur http://localhost:${PORT}`);
});
