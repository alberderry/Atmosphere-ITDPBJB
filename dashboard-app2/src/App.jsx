import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'; // Import useState

import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MapView from './pages/MapView.jsx'
import CBAAnalytics from './pages/CBAAnalytics.jsx';
import CBASelectionPage from './pages/CBASelectionPage.jsx'
import Master from './pages/Master.jsx'
// Header diimpor di sini, tetapi kemungkinan besar dirender di dalam komponen Layout.
// import Header from './components/Header' 
import ApiTester from './ApiTester.jsx' // Import ApiTester untuk pengujian API
import ATMCRMPage from './pages/ATMCRMPage.jsx'
import CostPage from './pages/CostPage.jsx'
import Relocation from './pages/Relocation.jsx'
import Login from './contexts/Login.jsx'
import TrxFeePage from './pages/TRXFee.jsx'
import { useAuth } from '../src/contexts/AuthContext'; // Import useAuth untuk otentikasi
import MachineDetail from './pages/MachineDetails.jsx'

function App() {
  const { isAuthenticated } = useAuth();

  // State untuk periode yang dipilih, dikelola di komponen induk (App.jsx)
  const [selectedPeriod, setSelectedPeriod] = useState('Januari - Maret, 2025');

  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        {/* Rute untuk halaman Login, selalu dapat diakses tanpa otentikasi */}
        <Route path="/login" element={<Login />} />

        {/* Rute untuk halaman utama (/) */}
        {/* Jika tidak terotentikasi, arahkan ke /login */}
        {/* Jika terotentikasi, tampilkan Layout dan rute anak-anaknya */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              // Meneruskan selectedPeriod dan setSelectedPeriod ke Layout
              // Layout kemudian harus meneruskannya ke komponen Header di dalamnya.
              <Layout selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Rute anak-anak di dalam Layout. Rute-rute ini otomatis dilindungi
              karena parent Route (path="/") sudah memeriksa otentikasi. */}
          <Route index element={<Dashboard />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics/map-view" element={<MapView />} />
          {/* Rute untuk Trx-Fee, menerima selectedPeriod dari App.jsx */}
          <Route path="analytics/trx-fee" element={<TrxFeePage currentPeriod={selectedPeriod} />} />
          
          {/* Rute baru untuk halaman pemilihan CBA (tanpa parameter) */}
          {/* PENTING: Rute ini harus didefinisikan SEBELUM rute dengan parameter (:atmId) */}
          <Route path="analytics/cba" element={<CBASelectionPage />} />
          {/* Rute untuk CBA Analytics dengan parameter atmId */}
          <Route path="analytics/cba/:atmId" element={<CBAAnalytics />} />
          
          {/* Parent route "Action" */}
          <Route path="action">
            {/* Rute untuk Relocation */}
            <Route path="relocation" element={<Relocation />} />
            {/* Rute untuk CBA Simulation (menggunakan komponen Relocation juga) */}
            <Route path="cba-simulation" element={<Relocation />} />
          </Route>

          <Route path="master" element={<Master />} />
          <Route path="master/:id" element={<MachineDetail />} />
          <Route path="atm-crm" element={<ATMCRMPage />} />
          <Route path="atm-crm/cost" element={<CostPage />} />
        </Route>

        {/* Catch-all route untuk rute yang tidak dikenal */}
        {/* Jika pengguna mencoba mengakses rute lain yang tidak terdefinisi,
            selalu arahkan ke /login (jika tidak terotentikasi, ini akan menjadi default) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Box>
  )
}

export default App
