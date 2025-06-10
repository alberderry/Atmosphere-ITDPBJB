// src/utils/relocationUtils.js

// Fungsi untuk menghitung jarak antara dua koordinat (rumus Haversine)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Radius Bumi dalam kilometer
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Fungsi untuk mendapatkan skema warna berdasarkan potensi
export const getColorScheme = (potential) => {
  switch (potential) {
    case "Berpotensi":
      return "green"
    case "Perlu Diperhitungkan":
      return "yellow"
    case "Rentan":
      return "red"
    default:
      return "gray"
  }
}

// Fungsi untuk mendapatkan warna tier
export const getTierColor = (tier) => {
  switch (tier) {
    case "TIER 1":
      return "green"
    case "TIER 2":
      return "yellow"
    case "TIER 3":
      return "red"
    default:
      return "gray"
  }
}

// Fungsi untuk mendapatkan ikon tipe cabang
export const getBranchTypeIcon = (types) => {
  if (types.includes("atm")) return "🏧"
  if (types.includes("bank")) return "🏦"
  return "🏢"
}

// Fungsi untuk mendapatkan ikon lokasi umum
export const getCommonPlaceIcon = (types) => {
  if (types.includes("school")) return "�";
  if (types.includes("supermarket")) return "🛒";
  if (types.includes("market")) return "🍎"; // Menggunakan apel sebagai ikon pasar generik
  if (types.includes("university")) return "🎓";
  if (types.includes("lodging")) return "🏨";
  return "📍";
}