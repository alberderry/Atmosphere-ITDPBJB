// server.js
const express = require('express');
const axios = require('axios'); // Menggunakan axios untuk permintaan HTTP
const cors = require('cors');
require('dotenv').config(); // Untuk memuat variabel lingkungan dari .env

const app = express();
const PORT = process.env.PORT || 5000; // Menggunakan port 5000 agar konsisten dengan frontend

// Middleware
app.use(cors()); // Mengizinkan semua origin untuk pengembangan. Sesuaikan untuk produksi.
app.use(express.json()); // Untuk mengurai body JSON

// --- Konfigurasi Google Maps API Key ---
// Sangat disarankan untuk menyimpan API Key di variabel lingkungan
// Pastikan ada file .env di folder yang sama dengan server.js dan tambahkan:
// GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY_HERE"; // Ganti dengan API Key Anda

// Root endpoint (opsional, hanya untuk memeriksa apakah server berjalan)
app.get('/', (req, res) => {
  res.send('Google Maps Proxy Backend is running!');
});

// Endpoint untuk Places API - Place Details (untuk mendapatkan lat/lng dari place_id)
// Diperbaiki untuk menerima place_id sebagai parameter path
app.get('/api/place-details/:place_id', async (req, res) => {
  const { place_id } = req.params; // Mengambil place_id dari parameter path
  if (!place_id) {
    return res.status(400).json({ error: 'Parameter "place_id" diperlukan.' });
  }

  try {
    // Fields yang diminta harus sesuai dengan yang diizinkan oleh Places API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&key=${GOOGLE_MAPS_API_KEY}&fields=geometry,formatted_address,name,place_id`;
    console.log(`Backend calling Google Place Details API: ${url.replace(GOOGLE_MAPS_API_KEY, 'YOUR_API_KEY_HIDDEN')}`); // Log URL tanpa API key
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error in place details API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Gagal mendapatkan detail tempat dari Google API.', details: error.response ? error.response.data : error.message });
  }
});

// Endpoint untuk Places API - Nearby Search
// Diperbaiki untuk menjadi POST dan menerima data dari body
app.post('/api/places-search', async (req, res) => {
  const { location, radius, keyword, type, exclude_keyword } = req.body; // Mengambil data dari body, termasuk exclude_keyword

  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ error: 'Location (lat, lng) is required.' });
  }
  // Keyword tidak lagi wajib karena kita mungkin hanya ingin mencari 'bank' dengan pengecualian
  // if (!keyword) {
  //   return res.status(400).json({ error: 'Parameter "keyword" diperlukan.' });
  // }

  try {
    const searchRadius = radius || 5000; // Default radius 5km
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${searchRadius}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }

    console.log(`Backend calling Google Nearby Search API: ${url.replace(GOOGLE_MAPS_API_KEY, 'YOUR_API_KEY_HIDDEN')}`); // Log URL tanpa API key
    const response = await axios.get(url); // Tetap GET request ke Google API
    let results = response.data.results;

    // Filter hasil jika ada exclude_keyword
    if (exclude_keyword && results) {
      const excludeKeywordsArray = Array.isArray(exclude_keyword) ? exclude_keyword : [exclude_keyword];
      const lowerCaseExcludeKeywords = excludeKeywordsArray.map(k => k.toLowerCase());

      results = results.filter(place => {
        const placeName = place.name ? place.name.toLowerCase() : '';
        const placeAddress = place.vicinity ? place.vicinity.toLowerCase() : '';
        const formattedAddress = place.formatted_address ? place.formatted_address.toLowerCase() : '';

        // Cek apakah ada keyword pengecualian di nama atau alamat
        const isExcluded = lowerCaseExcludeKeywords.some(exK => 
          placeName.includes(exK) || placeAddress.includes(exK) || formattedAddress.includes(exK)
        );
        return !isExcluded;
      });
    }

    res.json({ results: results, status: response.data.status });

  } catch (error) {
    console.error('Error in nearby places API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Gagal mencari tempat terdekat dari Google API.', details: error.response ? error.response.data : error.message });
  }
});

// --- NEW ENDPOINT: Reverse Geocoding ---
// Endpoint untuk Geocoding API - Reverse Geocoding (mengubah lat/lng menjadi alamat)
app.post('/api/reverse-geocode', async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log(`Backend calling Google Reverse Geocoding API: ${url.replace(GOOGLE_MAPS_API_KEY, 'YOUR_API_KEY_HIDDEN')}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error in reverse geocoding API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Gagal melakukan reverse geocoding dari Google API.', details: error.response ? error.response.data : error.message });
  }
});


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server proxy berjalan di http://localhost:${PORT}`);
  console.log("Pastikan Google Maps API Key Anda aktif dan memiliki akses ke Geocoding API, Places API, dan Maps JavaScript API.");
});
