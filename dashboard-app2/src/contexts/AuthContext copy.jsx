// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Buat Context
const AuthContext = createContext(null);

// Buat Provider untuk membungkus komponen yang membutuhkan akses ke AuthContext
export const AuthProvider = ({ children }) => {
  // State untuk melacak apakah pengguna terotentikasi (simulasi)
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // Log status otentikasi saat context diinisialisasi
  useEffect(() => {
    console.log("AuthContext diinisialisasi. isAuthenticated:", isAuthenticated);
  }, []); // Jalankan hanya sekali saat komponen mount

  // Fungsi login (simulasi)
  const login = (email, password) => {
    // Di aplikasi nyata, Anda akan memanggil API backend di sini
    if (email === "admin@gmail.com" && password === "admin") {
      setIsAuthenticated(true);
      console.log("Percobaan login berhasil. isAuthenticated diatur ke true.");
      return true; // Login berhasil
    }
    console.log("Percobaan login gagal.");
    return false; // Login gagal
  };

  // Fungsi logout
  const logout = () => {
    setIsAuthenticated(false);
    console.log("Logout. isAuthenticated diatur ke false.");
  };

  // Sediakan nilai context kepada children
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk memudahkan penggunaan AuthContext
export const useAuth = () => useContext(AuthContext);
