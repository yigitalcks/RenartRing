// ✅ GÜVENLI BACKEND ÖRNEK (Node.js/Express)
// Dosya: backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Environment variables için

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL'niz
  credentials: true
}));

app.use(express.json());

// ✅ API Key'ler environment variable'da güvenli
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

// ✅ GÜVENLI: Backend proxy endpoint
app.get('/api/rings', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    // ✅ Backend'de API key ile harici API'ye istek
    const response = await fetch(`${EXTERNAL_API_URL}/rings?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json',
        // Veya API key header olarak:
        // 'X-API-Key': EXTERNAL_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    
    // ✅ Veriyi işleyip client'a gönder (API key'ler hiç görünmez)
    const processedData = {
      data: data.rings,
      pagination: {
        currentPage: parseInt(page),
        pageSize: 4,
        totalItems: data.total,
        totalPages: Math.ceil(data.total / 4),
        hasNextPage: parseInt(page) < Math.ceil(data.total / 4)
      }
    };

    res.json(processedData);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 4,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false
      }
    });
  }
});

// ✅ Rate limiting için (isteğe bağlı)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // 15 dakikada max 100 istek
});
app.use('/api/', limiter);

// ✅ Caching için (isteğe bağlı)
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 dakika cache

app.get('/api/rings-cached', async (req, res) => {
  const { page = 1 } = req.query;
  const cacheKey = `rings_page_${page}`;
  
  // Cache'den kontrol et
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Cache'de yoksa API'den çek ve cache'le
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/rings?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    const processedData = {
      data: data.rings,
      pagination: {
        currentPage: parseInt(page),
        pageSize: 4,
        totalItems: data.total,
        totalPages: Math.ceil(data.total / 4),
        hasNextPage: parseInt(page) < Math.ceil(data.total / 4)
      }
    };
    
    // Cache'e kaydet
    cache.set(cacheKey, processedData);
    res.json(processedData);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

const PORT = process.env.PORT || 5268;
app.listen(PORT, () => {
  console.log(`✅ Secure server running on port ${PORT}`);
});

// ✅ .env dosyası örneği (backend/.env):
/*
EXTERNAL_API_KEY=your-secret-api-key-here
EXTERNAL_API_URL=https://api.example.com
PORT=5268
NODE_ENV=production
*/ 