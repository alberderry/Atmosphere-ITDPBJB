// src/components/TRXFeeComponent.jsx

import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Card,
  CardBody,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react"
import { useState, useMemo } from "react"

// Definisikan periode yang tersedia dan urutannya
const periods = [
  'Januari - Maret, 2025',
  'April - Juni, 2025',
  'Juli - September, 2025',
  'Oktober - Desember, 2025'
];

// Fungsi helper untuk mendapatkan data periode sebelumnya
const getPreviousPeriodData = (currentPeriod, allDataByPeriod) => {
  const currentIndex = periods.indexOf(currentPeriod);
  if (currentIndex > 0) {
    const previousPeriodName = periods[currentIndex - 1];
    return allDataByPeriod[previousPeriodName];
  }
  return null; // Tidak ada periode sebelumnya
};

// Fungsi helper untuk memformat perubahan (+X hijau, -X merah)
const formatChange = (currentValue, previousValue) => {
  if (previousValue === undefined || previousValue === null || previousValue === 0) {
    return { value: '-', color: 'gray' }; // Tidak ada data sebelumnya atau data sebelumnya 0 untuk perbandingan
  }
  const diff = currentValue - previousValue;
  if (diff > 0) {
    return { value: `+${diff.toLocaleString('id-ID')}`, color: 'green' };
  } else if (diff < 0) {
    return { value: `${diff.toLocaleString('id-ID')}`, color: 'red' };
  }
  return { value: '0', color: 'gray' }; // Tidak ada perubahan
};


const TRXFeeComponent = ({ selectedPeriod }) => { // Menerima selectedPeriod sebagai prop
  const [selectedKanwil, setSelectedKanwil] = useState('All'); // Default ke 'All' Kanwil
  const [selectedQuarter, setSelectedQuarter] = useState('All'); // State untuk filter bulan/kuartal
  const bgColor = useColorModeValue("blue.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  // Data dummy untuk ATM per Kanwil, diatur per periode
  const allAtmDetailsByPeriod = useMemo(() => ({
    'Januari - Maret, 2025': [
      { kodeAtm: 'A032', kodeCabang: '0404', kodeCabangInduk: '0404', kanwil: 'Kanwil 2', frekuensiTransaksi: 99, laporanPerQuarter: { Q1: 9430, Q2: 9252, Q3: 10521 }, rataRata3Bulan: 9734, tier: 'TIER 1' },
      { kodeAtm: 'A033', kodeCabang: '0025', kodeCabangInduk: '0025', kanwil: 'Kanwil 2', frekuensiTransaksi: 3298, laporanPerQuarter: { Q1: 3412, Q2: 5070, Q3: 2811 }, rataRata3Bulan: 3764, tier: 'TIER 2' },
      { kodeAtm: 'A034', kodeCabang: '0048', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 3986, laporanPerQuarter: { Q1: 10214, Q2: 11892, Q3: 7399 }, rataRata3Bulan: 9835, tier: 'TIER 1' },
      { kodeAtm: 'A035', kodeCabang: '0134', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 1152, laporanPerQuarter: { Q1: 1735, Q2: 3791, Q3: 186 }, rataRata3Bulan: 1904, tier: 'TIER 3' },
      { kodeAtm: 'A036', kodeCabang: '0263', kodeCabangInduk: '0010', kanwil: 'Kanwil 2', frekuensiTransaksi: 2063, laporanPerQuarter: { Q1: 4875, Q2: 3876, Q3: 4794 }, rataRata3Bulan: 4515, tier: 'TIER 2' },
      { kodeAtm: 'A037', kodeCabang: '0003', kodeCabangInduk: '0003', kanwil: 'Kanwil 1', frekuensiTransaksi: 842, laporanPerQuarter: { Q1: 4772, Q2: 6987, Q3: 1013 }, rataRata3Bulan: 4257, tier: 'TIER 3' },
      { kodeAtm: 'A038', kodeCabang: '0018', kodeCabangInduk: '0018', kanwil: 'Kanwil 1', frekuensiTransaksi: 7377, laporanPerQuarter: { Q1: 7513, Q2: 8665, Q3: 7704 }, rataRata3Bulan: 7960, tier: 'TIER 1' },
      { kodeAtm: 'A039', kodeCabang: '0026', kodeCabangInduk: '0026', kanwil: 'Kanwil 2', frekuensiTransaksi: 4559, laporanPerQuarter: { Q1: 5167, Q2: 6644, Q3: 6369 }, rataRata3Bulan: 6060, tier: 'TIER 2' },
      { kodeAtm: 'A040', kodeCabang: '0021', kodeCabangInduk: '0021', kanwil: 'Kanwil 4', frekuensiTransaksi: 4678, laporanPerQuarter: { Q1: 8168, Q2: 5492, Q3: 3912 }, rataRata3Bulan: 5857, tier: 'TIER 2' },
      { kodeAtm: 'A041', kodeCabang: '0020', kodeCabangInduk: '0020', kanwil: 'Kanwil 4', frekuensiTransaksi: 3547, laporanPerQuarter: { Q1: 5772, Q2: 3969, Q3: 2900 }, rataRata3Bulan: 4214, tier: 'TIER 3' },
      { kodeAtm: 'A042', kodeCabang: '0019', kodeCabangInduk: '0019', kanwil: 'Kanwil 4', frekuensiTransaksi: 6190, laporanPerQuarter: { Q1: 19848, Q2: 11939, Q3: 13598 }, rataRata3Bulan: 15128, tier: 'TIER 1' },
      { kodeAtm: 'A043', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 2612, laporanPerQuarter: { Q1: 3509, Q2: 3160, Q3: 2805 }, rataRata3Bulan: 3158, tier: 'TIER 3' },
      { kodeAtm: 'A044', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 2975, laporanPerQuarter: { Q1: 3620, Q2: 4307, Q3: 3861 }, rataRata3Bulan: 3929, tier: 'TIER 3' },
      { kodeAtm: 'A045', kodeCabang: '0016', kodeCabangInduk: '0016', kanwil: 'Kanwil 3', frekuensiTransaksi: 3717, laporanPerQuarter: { Q1: 9103, Q2: 9059, Q3: 9005 }, rataRata3Bulan: 9056, tier: 'TIER 1' },
      { kodeAtm: 'A046', kodeCabang: '0009', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 3332, laporanPerQuarter: { Q1: 8268, Q2: 6439, Q3: 5458 }, rataRata3Bulan: 6721, tier: 'TIER 2' },
      { kodeAtm: 'A047', kodeCabang: '0038', kodeCabangInduk: '0038', kanwil: 'Kanwil 3', frekuensiTransaksi: 3510, laporanPerQuarter: { Q1: 4514, Q2: 6448, Q3: 4102 }, rataRata3Bulan: 5021, tier: 'TIER 2' },
      { kodeAtm: 'A048', kodeCabang: '0327', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 453, laporanPerQuarter: { Q1: 3988, Q2: 4197, Q3: 3273 }, rataRata3Bulan: 3819, tier: 'TIER 4' },
      { kodeAtm: 'A049', kodeCabang: '0011', kodeCabangInduk: '0011', kanwil: 'Kanwil 3', frekuensiTransaksi: 8317, laporanPerQuarter: { Q1: 11522, Q2: 9177, Q3: 8426 }, rataRata3Bulan: 9708, tier: 'TIER 1' },
      { kodeAtm: 'A050', kodeCabang: '0403', kodeCabangInduk: '0403', kanwil: 'Kanwil 1', frekuensiTransaksi: 1860, laporanPerQuarter: { Q1: 1135, Q2: 3014, Q3: 3496 }, rataRata3Bulan: 2548, tier: 'TIER 3' },
      { kodeAtm: 'A051', kodeCabang: '0005', kodeCabangInduk: '0005', kanwil: 'Kanwil 3', frekuensiTransaksi: 4040, laporanPerQuarter: { Q1: 7793, Q2: 5654, Q3: 4898 }, rataRata3Bulan: 6115, tier: 'TIER 2' },
      { kodeAtm: 'A052', kodeCabang: '0017', kodeCabangInduk: '0017', kanwil: 'Kanwil 3', frekuensiTransaksi: 7176, laporanPerQuarter: { Q1: 11475, Q2: 8431, Q3: 9739 }, rataRata3Bulan: 9882, tier: 'TIER 1' },
      { kodeAtm: 'A053', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 5388, laporanPerQuarter: { Q1: 8314, Q2: 7431, Q3: 6709 }, rataRata3Bulan: 7485, tier: 'TIER 1' },
      { kodeAtm: 'A054', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 179, laporanPerQuarter: { Q1: 11010, Q2: 10640, Q3: 3271 }, rataRata3Bulan: 8307, tier: 'TIDAK DIHITUNG' },
      { kodeAtm: 'A055', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 2622, laporanPerQuarter: { Q1: 2319, Q2: 4007, Q3: 2186 }, rataRata3Bulan: 2837, tier: 'TIER 3' },
      { kodeAtm: 'A056', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 2033, laporanPerQuarter: { Q1: 201, Q2: 1364, Q3: 2248 }, rataRata3Bulan: 1271, tier: 'TIER 4' },
      { kodeAtm: 'A057', kodeCabang: '0001', kodeCabangInduk: '0001', kanwil: 'Kanwil 1', frekuensiTransaksi: 266, laporanPerQuarter: { Q1: 2488, Q2: 3340, Q3: 2971 }, rataRata3Bulan: 2933, tier: 'TIDAK DIHITUNG' },
    ],
    'April - Juni, 2025': [
      { kodeAtm: 'A032', kodeCabang: '0404', kodeCabangInduk: '0404', kanwil: 'Kanwil 2', frekuensiTransaksi: 105, laporanPerQuarter: { Q1: 9500, Q2: 9300, Q3: 10600 }, rataRata3Bulan: 9800, tier: 'TIER 1' },
      { kodeAtm: 'A033', kodeCabang: '0025', kodeCabangInduk: '0025', kanwil: 'Kanwil 2', frekuensiTransaksi: 3350, laporanPerQuarter: { Q1: 3450, Q2: 5100, Q3: 2850 }, rataRata3Bulan: 3800, tier: 'TIER 2' },
      { kodeAtm: 'A034', kodeCabang: '0048', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 4000, laporanPerQuarter: { Q1: 10300, Q2: 11950, Q3: 7450 }, rataRata3Bulan: 9900, tier: 'TIER 1' },
      { kodeAtm: 'A035', kodeCabang: '0134', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 1200, laporanPerQuarter: { Q1: 1800, Q2: 3850, Q3: 200 }, rataRata3Bulan: 1950, tier: 'TIER 3' },
      { kodeAtm: 'A036', kodeCabang: '0263', kodeCabangInduk: '0010', kanwil: 'Kanwil 2', frekuensiTransaksi: 2100, laporanPerQuarter: { Q1: 4900, Q2: 3900, Q3: 4800 }, rataRata3Bulan: 4550, tier: 'TIER 2' },
      { kodeAtm: 'A037', kodeCabang: '0003', kodeCabangInduk: '0003', kanwil: 'Kanwil 1', frekuensiTransaksi: 850, laporanPerQuarter: { Q1: 4800, Q2: 7000, Q3: 1050 }, rataRata3Bulan: 4300, tier: 'TIER 3' },
      { kodeAtm: 'A038', kodeCabang: '0018', kodeCabangInduk: '0018', kanwil: 'Kanwil 1', frekuensiTransaksi: 7400, laporanPerQuarter: { Q1: 7550, Q2: 8700, Q3: 7750 }, rataRata3Bulan: 8000, tier: 'TIER 1' },
      { kodeAtm: 'A039', kodeCabang: '0026', kodeCabangInduk: '0026', kanwil: 'Kanwil 2', frekuensiTransaksi: 4600, laporanPerQuarter: { Q1: 5200, Q2: 6700, Q3: 6400 }, rataRata3Bulan: 6100, tier: 'TIER 2' },
      { kodeAtm: 'A040', kodeCabang: '0021', kodeCabangInduk: '0021', kanwil: 'Kanwil 4', frekuensiTransaksi: 4700, laporanPerQuarter: { Q1: 8200, Q2: 5500, Q3: 3950 }, rataRata3Bulan: 5900, tier: 'TIER 2' },
      { kodeAtm: 'A041', kodeCabang: '0020', kodeCabangInduk: '0020', kanwil: 'Kanwil 4', frekuensiTransaksi: 3600, laporanPerQuarter: { Q1: 5800, Q2: 4000, Q3: 2950 }, rataRata3Bulan: 4250, tier: 'TIER 3' },
      { kodeAtm: 'A042', kodeCabang: '0019', kodeCabangInduk: '0019', kanwil: 'Kanwil 4', frekuensiTransaksi: 6200, laporanPerQuarter: { Q1: 19900, Q2: 12000, Q3: 13650 }, rataRata3Bulan: 15200, tier: 'TIER 1' },
      { kodeAtm: 'A043', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 2650, laporanPerQuarter: { Q1: 3550, Q2: 3200, Q3: 2850 }, rataRata3Bulan: 3200, tier: 'TIER 3' },
      { kodeAtm: 'A044', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 3000, laporanPerQuarter: { Q1: 3650, Q2: 4350, Q3: 3900 }, rataRata3Bulan: 3950, tier: 'TIER 3' },
      { kodeAtm: 'A045', kodeCabang: '0016', kodeCabangInduk: '0016', kanwil: 'Kanwil 3', frekuensiTransaksi: 3750, laporanPerQuarter: { Q1: 9150, Q2: 9100, Q3: 9050 }, rataRata3Bulan: 9100, tier: 'TIER 1' },
      { kodeAtm: 'A046', kodeCabang: '0009', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 3350, laporanPerQuarter: { Q1: 8300, Q2: 6450, Q3: 5500 }, rataRata3Bulan: 6750, tier: 'TIER 2' },
      { kodeAtm: 'A047', kodeCabang: '0038', kodeCabangInduk: '0038', kanwil: 'Kanwil 3', frekuensiTransaksi: 3550, laporanPerQuarter: { Q1: 4550, Q2: 6500, Q3: 4150 }, rataRata3Bulan: 5050, tier: 'TIER 2' },
      { kodeAtm: 'A048', kodeCabang: '0327', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 460, laporanPerQuarter: { Q1: 4000, Q2: 4200, Q3: 3300 }, rataRata3Bulan: 3850, tier: 'TIER 4' },
      { kodeAtm: 'A049', kodeCabang: '0011', kodeCabangInduk: '0011', kanwil: 'Kanwil 3', frekuensiTransaksi: 8350, laporanPerQuarter: { Q1: 11550, Q2: 9200, Q3: 8450 }, rataRata3Bulan: 9750, tier: 'TIER 1' },
      { kodeAtm: 'A050', kodeCabang: '0403', kodeCabangInduk: '0403', kanwil: 'Kanwil 1', frekuensiTransaksi: 1900, laporanPerQuarter: { Q1: 1150, Q2: 3050, Q3: 3500 }, rataRata3Bulan: 2600, tier: 'TIER 3' },
      { kodeAtm: 'A051', kodeCabang: '0005', kodeCabangInduk: '0005', kanwil: 'Kanwil 3', frekuensiTransaksi: 4050, laporanPerQuarter: { Q1: 7800, Q2: 5700, Q3: 4900 }, rataRata3Bulan: 6150, tier: 'TIER 2' },
      { kodeAtm: 'A052', kodeCabang: '0017', kodeCabangInduk: '0017', kanwil: 'Kanwil 3', frekuensiTransaksi: 7200, laporanPerQuarter: { Q1: 11500, Q2: 8450, Q3: 9750 }, rataRata3Bulan: 9900, tier: 'TIER 1' },
      { kodeAtm: 'A053', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 5400, laporanPerQuarter: { Q1: 8350, Q2: 7450, Q3: 6750 }, rataRata3Bulan: 7500, tier: 'TIER 1' },
      { kodeAtm: 'A054', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 185, laporanPerQuarter: { Q1: 11050, Q2: 10700, Q3: 3300 }, rataRata3Bulan: 8350, tier: 'TIDAK DIHITUNG' },
      { kodeAtm: 'A055', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 2650, laporanPerQuarter: { Q1: 2350, Q2: 4050, Q3: 2200 }, rataRata3Bulan: 2850, tier: 'TIER 3' },
      { kodeAtm: 'A056', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 2050, laporanPerQuarter: { Q1: 210, Q2: 1400, Q3: 2300 }, rataRata3Bulan: 1300, tier: 'TIER 4' },
      { kodeAtm: 'A057', kodeCabang: '0001', kodeCabangInduk: '0001', kanwil: 'Kanwil 1', frekuensiTransaksi: 270, laporanPerQuarter: { Q1: 2500, Q2: 3350, Q3: 3000 }, rataRata3Bulan: 2950, tier: 'TIDAK DIHITUNG' },
    ],
    'Juli - September, 2025': [
      { kodeAtm: 'A032', kodeCabang: '0404', kodeCabangInduk: '0404', kanwil: 'Kanwil 2', frekuensiTransaksi: 110, laporanPerQuarter: { Q1: 9600, Q2: 9400, Q3: 10700 }, rataRata3Bulan: 9900, tier: 'TIER 1' },
      { kodeAtm: 'A033', kodeCabang: '0025', kodeCabangInduk: '0025', kanwil: 'Kanwil 2', frekuensiTransaksi: 3400, laporanPerQuarter: { Q1: 3500, Q2: 5150, Q3: 2900 }, rataRata3Bulan: 3850, tier: 'TIER 2' },
      { kodeAtm: 'A034', kodeCabang: '0048', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 4100, laporanPerQuarter: { Q1: 10400, Q2: 12000, Q3: 7500 }, rataRata3Bulan: 10000, tier: 'TIER 1' },
      { kodeAtm: 'A035', kodeCabang: '0134', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 1250, laporanPerQuarter: { Q1: 1850, Q2: 3900, Q3: 250 }, rataRata3Bulan: 2000, tier: 'TIER 3' },
      { kodeAtm: 'A036', kodeCabang: '0263', kodeCabangInduk: '0010', kanwil: 'Kanwil 2', frekuensiTransaksi: 2150, laporanPerQuarter: { Q1: 4950, Q2: 3950, Q3: 4850 }, rataRata3Bulan: 4600, tier: 'TIER 2' },
      { kodeAtm: 'A037', kodeCabang: '0003', kodeCabangInduk: '0003', kanwil: 'Kanwil 1', frekuensiTransaksi: 860, laporanPerQuarter: { Q1: 4850, Q2: 7050, Q3: 1100 }, rataRata3Bulan: 4350, tier: 'TIER 3' },
      { kodeAtm: 'A038', kodeCabang: '0018', kodeCabangInduk: '0018', kanwil: 'Kanwil 1', frekuensiTransaksi: 7500, laporanPerQuarter: { Q1: 7600, Q2: 8750, Q3: 7800 }, rataRata3Bulan: 8050, tier: 'TIER 1' },
      { kodeAtm: 'A039', kodeCabang: '0026', kodeCabangInduk: '0026', kanwil: 'Kanwil 2', frekuensiTransaksi: 4650, laporanPerQuarter: { Q1: 5250, Q2: 6750, Q3: 6450 }, rataRata3Bulan: 6150, tier: 'TIER 2' },
      { kodeAtm: 'A040', kodeCabang: '0021', kodeCabangInduk: '0021', kanwil: 'Kanwil 4', frekuensiTransaksi: 4750, laporanPerQuarter: { Q1: 8250, Q2: 5550, Q3: 4000 }, rataRata3Bulan: 5950, tier: 'TIER 2' },
      { kodeAtm: 'A041', kodeCabang: '0020', kodeCabangInduk: '0020', kanwil: 'Kanwil 4', frekuensiTransaksi: 3650, laporanPerQuarter: { Q1: 5850, Q2: 4050, Q3: 3000 }, rataRata3Bulan: 4300, tier: 'TIER 3' },
      { kodeAtm: 'A042', kodeCabang: '0019', kodeCabangInduk: '0019', kanwil: 'Kanwil 4', frekuensiTransaksi: 6250, laporanPerQuarter: { Q1: 20000, Q2: 12100, Q3: 13700 }, rataRata3Bulan: 15300, tier: 'TIER 1' },
      { kodeAtm: 'A043', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 2700, laporanPerQuarter: { Q1: 3600, Q2: 3250, Q3: 2900 }, rataRata3Bulan: 3250, tier: 'TIER 3' },
      { kodeAtm: 'A044', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 3050, laporanPerQuarter: { Q1: 3700, Q2: 4400, Q3: 3950 }, rataRata3Bulan: 4000, tier: 'TIER 3' },
      { kodeAtm: 'A045', kodeCabang: '0016', kodeCabangInduk: '0016', kanwil: 'Kanwil 3', frekuensiTransaksi: 3800, laporanPerQuarter: { Q1: 9200, Q2: 9150, Q3: 9100 }, rataRata3Bulan: 9150, tier: 'TIER 1' },
      { kodeAtm: 'A046', kodeCabang: '0009', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 3400, laporanPerQuarter: { Q1: 8350, Q2: 6500, Q3: 5550 }, rataRata3Bulan: 6800, tier: 'TIER 2' },
      { kodeAtm: 'A047', kodeCabang: '0038', kodeCabangInduk: '0038', kanwil: 'Kanwil 3', frekuensiTransaksi: 3600, laporanPerQuarter: { Q1: 4600, Q2: 6550, Q3: 4200 }, rataRata3Bulan: 5100, tier: 'TIER 2' },
      { kodeAtm: 'A048', kodeCabang: '0327', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 470, laporanPerQuarter: { Q1: 4050, Q2: 4250, Q3: 3350 }, rataRata3Bulan: 3900, tier: 'TIER 4' },
      { kodeAtm: 'A049', kodeCabang: '0011', kodeCabangInduk: '0011', kanwil: 'Kanwil 3', frekuensiTransaksi: 8400, laporanPerQuarter: { Q1: 11600, Q2: 9250, Q3: 8500 }, rataRata3Bulan: 9800, tier: 'TIER 1' },
      { kodeAtm: 'A050', kodeCabang: '0403', kodeCabangInduk: '0403', kanwil: 'Kanwil 1', frekuensiTransaksi: 1950, laporanPerQuarter: { Q1: 1200, Q2: 3100, Q3: 3550 }, rataRata3Bulan: 2650, tier: 'TIER 3' },
      { kodeAtm: 'A051', kodeCabang: '0005', kodeCabangInduk: '0005', kanwil: 'Kanwil 3', frekuensiTransaksi: 4100, laporanPerQuarter: { Q1: 7850, Q2: 5750, Q3: 4950 }, rataRata3Bulan: 6200, tier: 'TIER 2' },
      { kodeAtm: 'A052', kodeCabang: '0017', kodeCabangInduk: '0017', kanwil: 'Kanwil 3', frekuensiTransaksi: 7250, laporanPerQuarter: { Q1: 11550, Q2: 8500, Q3: 9800 }, rataRata3Bulan: 9950, tier: 'TIER 1' },
      { kodeAtm: 'A053', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 5450, laporanPerQuarter: { Q1: 8400, Q2: 7500, Q3: 6800 }, rataRata3Bulan: 7550, tier: 'TIER 1' },
      { kodeAtm: 'A054', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 190, laporanPerQuarter: { Q1: 11100, Q2: 10750, Q3: 3350 }, rataRata3Bulan: 8400, tier: 'TIDAK DIHITUNG' },
      { kodeAtm: 'A055', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 2700, laporanPerQuarter: { Q1: 2400, Q2: 4100, Q3: 2250 }, rataRata3Bulan: 2900, tier: 'TIER 3' },
      { kodeAtm: 'A056', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 2100, laporanPerQuarter: { Q1: 220, Q2: 1450, Q3: 2350 }, rataRata3Bulan: 1350, tier: 'TIER 4' },
      { kodeAtm: 'A057', kodeCabang: '0001', kodeCabangInduk: '0001', kanwil: 'Kanwil 1', frekuensiTransaksi: 275, laporanPerQuarter: { Q1: 2550, Q2: 3400, Q3: 3100 }, rataRata3Bulan: 3050, tier: 'TIDAK DIHITUNG' },
    ],
    'Oktober - Desember, 2025': [
      { kodeAtm: 'A032', kodeCabang: '0404', kodeCabangInduk: '0404', kanwil: 'Kanwil 2', frekuensiTransaksi: 115, laporanPerQuarter: { Q1: 9700, Q2: 9500, Q3: 10800 }, rataRata3Bulan: 10000, tier: 'TIER 1' },
      { kodeAtm: 'A033', kodeCabang: '0025', kodeCabangInduk: '0025', kanwil: 'Kanwil 2', frekuensiTransaksi: 3450, laporanPerQuarter: { Q1: 3550, Q2: 5200, Q3: 2950 }, rataRata3Bulan: 3900, tier: 'TIER 2' },
      { kodeAtm: 'A034', kodeCabang: '0048', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 4200, laporanPerQuarter: { Q1: 10500, Q2: 12100, Q3: 7600 }, rataRata3Bulan: 10100, tier: 'TIER 1' },
      { kodeAtm: 'A035', kodeCabang: '0134', kodeCabangInduk: '0048', kanwil: 'Kanwil 2', frekuensiTransaksi: 1300, laporanPerQuarter: { Q1: 1900, Q2: 3950, Q3: 300 }, rataRata3Bulan: 2050, tier: 'TIER 3' },
      { kodeAtm: 'A036', kodeCabang: '0263', kodeCabangInduk: '0010', kanwil: 'Kanwil 2', frekuensiTransaksi: 2200, laporanPerQuarter: { Q1: 5000, Q2: 4000, Q3: 4900 }, rataRata3Bulan: 4650, tier: 'TIER 2' },
      { kodeAtm: 'A037', kodeCabang: '0003', kodeCabangInduk: '0003', kanwil: 'Kanwil 1', frekuensiTransaksi: 870, laporanPerQuarter: { Q1: 4900, Q2: 7100, Q3: 1150 }, rataRata3Bulan: 4400, tier: 'TIER 3' },
      { kodeAtm: 'A038', kodeCabang: '0018', kodeCabangInduk: '0018', kanwil: 'Kanwil 1', frekuensiTransaksi: 7600, laporanPerQuarter: { Q1: 7650, Q2: 8800, Q3: 7850 }, rataRata3Bulan: 8100, tier: 'TIER 1' },
      { kodeAtm: 'A039', kodeCabang: '0026', kodeCabangInduk: '0026', kanwil: 'Kanwil 2', frekuensiTransaksi: 4700, laporanPerQuarter: { Q1: 5300, Q2: 6800, Q3: 6500 }, rataRata3Bulan: 6200, tier: 'TIER 2' },
      { kodeAtm: 'A040', kodeCabang: '0021', kodeCabangInduk: '0021', kanwil: 'Kanwil 4', frekuensiTransaksi: 4800, laporanPerQuarter: { Q1: 8300, Q2: 5600, Q3: 4050 }, rataRata3Bulan: 6000, tier: 'TIER 2' },
      { kodeAtm: 'A041', kodeCabang: '0020', kodeCabangInduk: '0020', kanwil: 'Kanwil 4', frekuensiTransaksi: 3700, laporanPerQuarter: { Q1: 5900, Q2: 4100, Q3: 3050 }, rataRata3Bulan: 4350, tier: 'TIER 3' },
      { kodeAtm: 'A042', kodeCabang: '0019', kodeCabangInduk: '0019', kanwil: 'Kanwil 4', frekuensiTransaksi: 6300, laporanPerQuarter: { Q1: 20100, Q2: 12200, Q3: 13750 }, rataRata3Bulan: 15400, tier: 'TIER 1' },
      { kodeAtm: 'A043', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 2750, laporanPerQuarter: { Q1: 3650, Q2: 3300, Q3: 2950 }, rataRata3Bulan: 3300, tier: 'TIER 3' },
      { kodeAtm: 'A044', kodeCabang: '0028', kodeCabangInduk: '0028', kanwil: 'Kanwil 4', frekuensiTransaksi: 3100, laporanPerQuarter: { Q1: 3750, Q2: 4450, Q3: 4000 }, rataRata3Bulan: 4050, tier: 'TIER 3' },
      { kodeAtm: 'A045', kodeCabang: '0016', kodeCabangInduk: '0016', kanwil: 'Kanwil 3', frekuensiTransaksi: 3850, laporanPerQuarter: { Q1: 9250, Q2: 9200, Q3: 9150 }, rataRata3Bulan: 9200, tier: 'TIER 1' },
      { kodeAtm: 'A046', kodeCabang: '0009', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 3450, laporanPerQuarter: { Q1: 8400, Q2: 6550, Q3: 5600 }, rataRata3Bulan: 6850, tier: 'TIER 2' },
      { kodeAtm: 'A047', kodeCabang: '0038', kodeCabangInduk: '0038', kanwil: 'Kanwil 3', frekuensiTransaksi: 3650, laporanPerQuarter: { Q1: 4650, Q2: 6600, Q3: 4250 }, rataRata3Bulan: 5150, tier: 'TIER 2' },
      { kodeAtm: 'A048', kodeCabang: '0327', kodeCabangInduk: '0009', kanwil: 'Kanwil 3', frekuensiTransaksi: 480, laporanPerQuarter: { Q1: 4100, Q2: 4300, Q3: 3400 }, rataRata3Bulan: 3950, tier: 'TIER 4' },
      { kodeAtm: 'A049', kodeCabang: '0011', kodeCabangInduk: '0011', kanwil: 'Kanwil 3', frekuensiTransaksi: 8450, laporanPerQuarter: { Q1: 11650, Q2: 9300, Q3: 8550 }, rataRata3Bulan: 9850, tier: 'TIER 1' },
      { kodeAtm: 'A050', kodeCabang: '0403', kodeCabangInduk: '0403', kanwil: 'Kanwil 1', frekuensiTransaksi: 2000, laporanPerQuarter: { Q1: 1250, Q2: 3150, Q3: 3600 }, rataRata3Bulan: 2700, tier: 'TIER 3' },
      { kodeAtm: 'A051', kodeCabang: '0005', kodeCabangInduk: '0005', kanwil: 'Kanwil 3', frekuensiTransaksi: 4150, laporanPerQuarter: { Q1: 7900, Q2: 5800, Q3: 5000 }, rataRata3Bulan: 6250, tier: 'TIER 2' },
      { kodeAtm: 'A052', kodeCabang: '0017', kodeCabangInduk: '0017', kanwil: 'Kanwil 3', frekuensiTransaksi: 7300, laporanPerQuarter: { Q1: 11600, Q2: 8550, Q3: 9850 }, rataRata3Bulan: 10000, tier: 'TIER 1' },
      { kodeAtm: 'A053', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 5500, laporanPerQuarter: { Q1: 8450, Q2: 7550, Q3: 6850 }, rataRata3Bulan: 7600, tier: 'TIER 1' },
      { kodeAtm: 'A054', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 195, laporanPerQuarter: { Q1: 11150, Q2: 10800, Q3: 3400 }, rataRata3Bulan: 8450, tier: 'TIDAK DIHITUNG' },
      { kodeAtm: 'A055', kodeCabang: '0007', kodeCabangInduk: '0007', kanwil: 'Kanwil 4', frekuensiTransaksi: 2750, laporanPerQuarter: { Q1: 2450, Q2: 4150, Q3: 2300 }, rataRata3Bulan: 2950, tier: 'TIER 3' },
      { kodeAtm: 'A056', kodeCabang: '0012', kodeCabangInduk: '0012', kanwil: 'Kanwil 4', frekuensiTransaksi: 2150, laporanPerQuarter: { Q1: 230, Q2: 1500, Q3: 2400 }, rataRata3Bulan: 1400, tier: 'TIER 4' },
      { kodeAtm: 'A057', kodeCabang: '0001', kodeCabangInduk: '0001', kanwil: 'Kanwil 1', frekuensiTransaksi: 280, laporanPerQuarter: { Q1: 2600, Q2: 3450, Q3: 3100 }, rataRata3Bulan: 3050, tier: 'TIDAK DIHITUNG' },
    ],
  }), []);

  // Dapatkan data ATM untuk periode yang dipilih
  const currentPeriodAtmDetails = useMemo(() => {
    return allAtmDetailsByPeriod[selectedPeriod] || [];
  }, [allAtmDetailsByPeriod, selectedPeriod]);

  // Dapatkan data ATM untuk periode sebelumnya
  const previousPeriodAtmDetails = useMemo(() => {
    return getPreviousPeriodData(selectedPeriod, allAtmDetailsByPeriod) || [];
  }, [selectedPeriod, allAtmDetailsByPeriod]);

  // Filter data berdasarkan kanwil yang dipilih dan tambahkan perubahan
  const filteredAtmDetailsWithChanges = useMemo(() => {
    return currentPeriodAtmDetails
      .filter(atm => selectedKanwil === 'All' || atm.kanwil === selectedKanwil) // Logika filter Kanwil
      .map(atm => {
        const prevAtm = previousPeriodAtmDetails.find(pAtm => pAtm.kodeAtm === atm.kodeAtm);

        const frekuensiTransaksiChange = formatChange(atm.frekuensiTransaksi, prevAtm?.frekuensiTransaksi);
        const q1Change = formatChange(atm.laporanPerQuarter.Q1, prevAtm?.laporanPerQuarter.Q1);
        const q2Change = formatChange(atm.laporanPerQuarter.Q2, prevAtm?.laporanPerQuarter.Q2);
        const q3Change = formatChange(atm.laporanPerQuarter.Q3, prevAtm?.laporanPerQuarter.Q3);
        const rataRata3BulanChange = formatChange(atm.rataRata3Bulan, prevAtm?.rataRata3Bulan);

        return {
          ...atm,
          frekuensiTransaksiChange,
          q1Change,
          q2Change,
          q3Change,
          rataRata3BulanChange,
        };
      });
  }, [currentPeriodAtmDetails, previousPeriodAtmDetails, selectedKanwil]);

  const getTierColor = (tier) => {
    switch(tier) {
      case 'TIER 1': return 'blue';
      case 'TIER 2': return 'green';
      case 'TIER 3': return 'yellow';
      case 'TIER 4': return 'red';
      default: return 'gray';
    }
  };

  // Tentukan header untuk kolom laporan berdasarkan kuartal yang dipilih
  const getReportColumnHeader = () => {
    if (selectedQuarter === 'All') {
      return (
        <>
          <Th textAlign="center">Q1</Th>
          <Th textAlign="center">Q2</Th>
          <Th textAlign="center">Q3</Th>
        </>
      );
    }
    return <Th textAlign="center">LAPORAN {selectedQuarter}</Th>;
  };

  // Helper untuk merender nilai dengan perubahan
  const renderValueWithChange = (value, change) => (
    <Flex direction="column" align="center">
      <Text>{value.toLocaleString('id-ID')}</Text>
      {change && change.value !== '-' && change.value !== '0' && ( // Hanya tampilkan jika ada perubahan
        <Text fontSize="xs" color={change.color} fontWeight="bold">
          {change.value}
        </Text>
      )}
    </Flex>
  );

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Card Jumlah Transaksi */}
        <Card bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Jumlah Transaksi</Text>
            <HStack>
              <Text fontSize="md">Kanwil</Text>
              <Select
                value={selectedKanwil}
                onChange={(e) => setSelectedKanwil(e.target.value)}
                size="sm"
                width="120px"
                borderRadius="md"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _focus={{ borderColor: "blue.700" }}
              >
                <option value="All" style={{ backgroundColor: 'white', color: 'black' }}>Semua Kanwil</option> {/* Opsi baru */}
                <option value="Kanwil 1" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 1</option>
                <option value="Kanwil 2" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 2</option>
                <option value="Kanwil 3" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 3</option>
                <option value="Kanwil 4" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 4</option>
              </Select>

              <Text fontSize="md" ml={4}>Periode</Text>
              <Select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                size="sm"
                width="120px"
                borderRadius="md"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _focus={{ borderColor: "blue.700" }}
              >
                <option value="All" style={{ backgroundColor: 'white', color: 'black' }}>Semua Bulan</option>
                <option value="Q1" style={{ backgroundColor: 'white', color: 'black' }}>Q1</option>
                <option value="Q2" style={{ backgroundColor: 'white', color: 'black' }}>Q2</option>
                <option value="Q3" style={{ backgroundColor: 'white', color: 'black' }}>Q3</option>
              </Select>
            </HStack>
          </Flex>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg="gray.100">
                  <Th>KODE ATM</Th>
                  <Th>KODE CABANG</Th>
                  <Th>KODE CABANG INDUK</Th>
                  {getReportColumnHeader()} {/* Header dinamis */}
                  <Th textAlign="center">RATA-RATA PER 3 BULAN</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAtmDetailsWithChanges.map((atm) => (
                  <Tr key={atm.kodeAtm}>
                    <Td>
                      <Badge
                        colorScheme={getTierColor(atm.tier)}
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        {atm.kodeAtm}
                      </Badge>
                    </Td>
                    <Td>{atm.kodeCabang}</Td>
                    <Td>{atm.kodeCabangInduk}</Td>
                    {/* Render laporan per kuartal secara dinamis */}
                    {selectedQuarter === 'All' ? (
                      <>
                        <Td textAlign="center">{renderValueWithChange(atm.laporanPerQuarter.Q1, atm.q1Change)}</Td>
                        <Td textAlign="center">{renderValueWithChange(atm.laporanPerQuarter.Q2, atm.q2Change)}</Td>
                        <Td textAlign="center">{renderValueWithChange(atm.laporanPerQuarter.Q3, atm.q3Change)}</Td>
                      </>
                    ) : (
                      <Td textAlign="center">
                        {renderValueWithChange(atm.laporanPerQuarter[selectedQuarter], atm[`q${selectedQuarter.toLowerCase()}Change`])}
                      </Td>
                    )}
                    <Td textAlign="center">{renderValueWithChange(atm.rataRata3Bulan, atm.rataRata3BulanChange)}</Td>
                  </Tr>
                ))}
                {filteredAtmDetailsWithChanges.length === 0 && (
                  <Tr>
                    <Td colSpan={selectedQuarter === 'All' ? 7 : 5} textAlign="center">Tidak ada data ATM untuk Kanwil ini.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>

        {/* Card Fee Transaksi (yang sudah ada) */}
        <Card bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Fee Transaksi</Text>
            <HStack>
              <Text fontSize="md">Kanwil</Text>
              <Select
                value={selectedKanwil}
                onChange={(e) => setSelectedKanwil(e.target.value)}
                size="sm"
                width="120px"
                borderRadius="md"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _focus={{ borderColor: "blue.700" }}
              >
                <option value="All" style={{ backgroundColor: 'white', color: 'black' }}>Semua Kanwil</option> {/* Opsi baru */}
                <option value="Kanwil 1" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 1</option>
                <option value="Kanwil 2" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 2</option>
                <option value="Kanwil 3" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 3</option>
                <option value="Kanwil 4" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 4</option>
              </Select>

              <Text fontSize="md" ml={4}>Periode</Text>
              <Select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                size="sm"
                width="120px"
                borderRadius="md"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _focus={{ borderColor: "blue.700" }}
              >
                <option value="All" style={{ backgroundColor: 'white', color: 'black' }}>Semua Bulan</option>
                <option value="Q1" style={{ backgroundColor: 'white', color: 'black' }}>Q1</option>
                <option value="Q2" style={{ backgroundColor: 'white', color: 'black' }}>Q2</option>
                <option value="Q3" style={{ backgroundColor: 'white', color: 'black' }}>Q3</option>
              </Select>
            </HStack>
          </Flex>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg="gray.100">
                  <Th>KODE ATM</Th>
                  <Th>KODE CABANG</Th>
                  <Th>KODE CABANG INDUK</Th>
                  <Th textAlign="center">FREKUENSI TRANSAKSI</Th>
                  {getReportColumnHeader()} {/* Header dinamis */}
                  <Th textAlign="center">RATA-RATA PER 3 BULAN</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAtmDetailsWithChanges.map((atm) => (
                  <Tr key={atm.kodeAtm}>
                    <Td>
                      <Badge
                        colorScheme={getTierColor(atm.tier)}
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        {atm.kodeAtm}
                      </Badge>
                    </Td>
                    <Td>{atm.kodeCabang}</Td>
                    <Td>{atm.kodeCabangInduk}</Td>
                    <Td textAlign="center">{renderValueWithChange(atm.frekuensiTransaksi, atm.frekuensiTransaksiChange)}</Td>
                    {/* Render laporan per kuartal secara dinamis */}
                    {selectedQuarter === 'All' ? (
                      <>
                        <Td textAlign="center">{renderValueWithChange(atm.laporanPerQuarter.Q1, atm.q1Change)}</Td>
                        <Td textAlign="center">{renderValueWithChange(atm.laporanPerQuarter.Q2, atm.q2Change)}</Td>
                        <Td textAlign="center">{renderValueWithChange(atm.laporanPerQuarter.Q3, atm.q3Change)}</Td>
                      </>
                    ) : (
                      <Td textAlign="center">
                        {renderValueWithChange(atm.laporanPerQuarter[selectedQuarter], atm[`q${selectedQuarter.toLowerCase()}Change`])}
                      </Td>
                    )}
                    <Td textAlign="center">{renderValueWithChange(atm.rataRata3Bulan, atm.rataRata3BulanChange)}</Td>
                  </Tr>
                ))}
                {filteredAtmDetailsWithChanges.length === 0 && (
                  <Tr>
                    <Td colSpan={selectedQuarter === 'All' ? 8 : 6} textAlign="center">Tidak ada data ATM untuk Kanwil ini.</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </VStack>
    </Box>
  );
};

export default TRXFeeComponent;
