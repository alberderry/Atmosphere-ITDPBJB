// src/pages/TRXFee.jsx

import { Box } from "@chakra-ui/react"
import TRXFeeComponent from "../components/TRXFeeComponent.jsx"
// Hapus import useState karena state ini sekarang dikelola di App.jsx
// import { useState } from "react"; 

// TRXFee kini menerima currentPeriod sebagai prop dari App.jsx
const TRXFee = ({ currentPeriod }) => { 
  // Hapus deklarasi useState di sini karena currentPeriod diterima sebagai prop
  // const [currentPeriod, setCurrentPeriod] = useState('Januari - Maret, 2025');

  return (
    <Box>
      {/* Meneruskan currentPeriod yang diterima dari prop ke TRXFeeComponent */}
      <TRXFeeComponent selectedPeriod={currentPeriod} />
    </Box>
  )
}

export default TRXFee
