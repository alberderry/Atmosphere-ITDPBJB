import React, { useState } from 'react';
import DashboardComponent from '../components/DashboardComponent'; // Import komponen presentasi

// --- Mock Data ---
// Data untuk header unit ATM/CRM/Total
const totalUnits = {
  atm: 540, // Diperbarui sesuai gambar
  crm: 17,  // Diperbarui sesuai gambar
  total: 557, // Diperbarui sesuai gambar (540 + 17)
};

// Data untuk kartu statistik ringkasan
const summaryStats = [
  { label: 'Total Revenue', value: 'Rp.567.890.098', growth: '+13.5%', color: 'green' },
  { label: 'Total Transaction', value: '11.308.212', growth: '+13.5%', color: 'green' },
  { label: 'Total Amount', value: 'Rp.6.567.890.098', growth: '+13.5%', color: 'green' },
  { label: 'Total Fee', value: 'Rp.2.034.187.998', growth: '+13.5%', color: 'green' },
];

// Data untuk Donut Chart (Tier Distribution) - Diperbarui dengan atmCount dan crmCount
const tierDistributionData = [
  { name: 'TIDAK DIHITUNG', value: 3.79, atmCount: 540, crmCount: 17, color: '#6c757d' }, // gray.400
  { name: 'TIER 1', value: 15.27, atmCount: 120, crmCount: 30, color: '#007bff' }, // blue.400
  { name: 'TIER 2', value: 25.36, atmCount: 200, crmCount: 50, color: '#28a745' }, // green.400
  { name: 'TIER 3', value: 27.05, atmCount: 220, crmCount: 60, color: '#ffc107' }, // yellow.400
  { name: 'TIER 4', value: 28.53, atmCount: 230, crmCount: 70, color: '#dc3545' }, // red.500
];

// Data untuk Bar/Line Chart (Performance Trends)
const performanceTrendsData = [
  { name: 'Q1 \'24', amount: 90, fee: 30, transaction: 100 },
  { name: 'Q2 \'24', amount: 120, fee: 40, transaction: 130 },
  { name: 'Q3 \'24', amount: 100, fee: 35, transaction: 110 },
  { name: 'Q4 \'24', amount: 150, fee: 50, transaction: 160 },
  { name: 'Q1 \'25', amount: 80, fee: 25, transaction: 90 },
];

// Data untuk Line Chart (ROI Trends)
const roiTrendsData = [
  { name: 'Figma', roi: 70, cost: 30 },
  { name: 'Sketch', roi: 85, cost: 25 },
  { name: 'XD', roi: 60, cost: 40 },
  { name: 'Photoshop', roi: 95, cost: 20 },
  { name: 'Illustrator', roi: 75, cost: 35 },
  { name: 'AfterEffect', roi: 90, cost: 28 },
];

// Data untuk Performance Leaderboard
const leaderboardData = {
  atm: [
    { id: 1, name: 'ATM KC SUBANG 1', code: 'A017', kc: '0008 - Subang', kanwil: 'Kanwil I', revenue: '2.176.897', fee: '1.656.537', transactions: '7.450', growth: '+15.3%', avatarBg: 'yellow.400' },
    { id: 2, name: 'ATM KC BANDUNG 2', code: 'A022', kc: '0010 - Bandung', kanwil: 'Kanwil I', revenue: '1.980.500', fee: '1.500.000', transactions: '6.800', growth: '+12.1%', avatarBg: 'blue.400' },
    { id: 3, name: 'ATM KC CIMAHI 3', code: 'A030', kc: '0015 - Cimahi', kanwil: 'Kanwil II', revenue: '1.800.000', fee: '1.400.000', transactions: '6.200', growth: '+10.5%', avatarBg: 'green.400' },
  ],
  kc: [
    { id: 1, name: 'KC SUBANG', code: '0008', kanwil: 'Kanwil I', revenue: '15.2M', fee: '10.5M', transactions: '50.000', growth: '+10.0%', avatarBg: 'purple.400' },
    { id: 2, name: 'KC BANDUNG', code: '0010', kanwil: 'Kanwil I', revenue: '14.8M', fee: '9.8M', transactions: '48.000', growth: '+9.5%', avatarBg: 'orange.400' },
  ],
  kanwil: [
    { id: 1, name: 'KANWIL I', code: 'KW01', revenue: '50M', fee: '35M', transactions: '200.000', growth: '+8.0%', avatarBg: 'red.400' },
    { id: 2, name: 'KANWIL II', code: 'KW02', revenue: '45M', fee: '30M', transactions: '180.000', growth: '+7.5%', avatarBg: 'teal.400' },
  ],
};

const Dashboard = () => {
  const [leaderboardTab, setLeaderboardTab] = useState(0); // 0: ATM, 1: KC, 2: KANWIL
  const [leaderboardMetric, setLeaderboardMetric] = useState('Transaction');

  // Logika untuk mendapatkan data leaderboard yang sedang aktif
  const currentLeaderboardData = (() => {
    switch (leaderboardTab) {
      case 0: return leaderboardData.atm;
      case 1: return leaderboardData.kc;
      case 2: return leaderboardData.kanwil;
      default: return leaderboardData.atm;
    }
  })();

  return (
    <DashboardComponent
      totalUnits={totalUnits}
      summaryStats={summaryStats}
      tierDistributionData={tierDistributionData} // Meneruskan data yang sudah diperbarui
      performanceTrendsData={performanceTrendsData}
      roiTrendsData={roiTrendsData}
      leaderboardData={currentLeaderboardData}
      leaderboardTab={leaderboardTab}
      setLeaderboardTab={setLeaderboardTab}
      leaderboardMetric={leaderboardMetric}
      setLeaderboardMetric={setLeaderboardMetric}
    />
  );
};

export default Dashboard;
