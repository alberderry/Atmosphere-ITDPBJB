import { Box, Flex, Text, HStack, Select, VStack } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
// Tidak perlu lagi import useState di sini karena state akan dikelola oleh parent
// import { useState } from 'react'; 

// Header kini menerima selectedPeriod dan setSelectedPeriod sebagai props
const Header = ({ selectedPeriod, setSelectedPeriod }) => {
  const location = useLocation()
  // State untuk periode yang dipilih kini dikelola oleh komponen induk
  // const [selectedPeriod, setSelectedPeriod] = useState('Januari - Maret, 2025');

  const getPageTitle = () => {
    if (location.pathname.includes('map-view')) return 'Map View'
    if (location.pathname.includes('analytics')) return 'Analystics'
    if (location.pathname.includes('master')) return 'Master'
    if (location.pathname.includes('atm-crm')) return 'ATM/CRM'
    return 'Dashboard'
  }

  return (
    <Box bg="blue.50" color="black" px={6} py={3} h="60px"> 
      <Flex justify="space-between" align="center" h="full">
        {/* Judul halaman di sebelah kiri */}
        <VStack align="flex-start" spacing={0}>
          <Text mt="55px" fontSize="25px" fontWeight="extrabold" color="black">
            {getPageTitle()}
          </Text>
          {/* Dropdown Periode dengan tampilan yang diperbarui */}
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)} // Menggunakan setSelectedPeriod dari props
            size="md"
            variant="flushed" // Menggunakan varian 'flushed'
            color="black"
            fontWeight="medium"
            width="200px" // Pastikan memiliki lebar yang cukup
            _hover={{ cursor: 'pointer' }} // Efek hover sederhana
            _focus={{ boxShadow: 'none' }} // Menghilangkan outline fokus bawaan
            // Opsi-opsi dropdown
            sx={{
              '& option': {
                backgroundColor: 'white',
                color: 'black',
              },
            }}
          >
            <option value="Januari - Maret, 2025">Januari - Maret, 2025</option>
            <option value="April - Juni, 2025">April - Juni, 2025</option>
            <option value="Juli - September, 2025">Juli - September, 2025</option>
            <option value="Oktober - Desember, 2025">Oktober - Desember, 2025</option>
          </Select>
        </VStack>
        
        {/* Bagian informasi ATM dan CRM */}
        <HStack spacing={6}>
          {/* Informasi ATM dan CRM */}
          <Box textAlign="center">
            <HStack spacing={1} align="baseline">
              <Text fontSize="2xl" mt="20px" fontWeight="bold" color="black">1.750</Text>
              <Box bg="yellow.400" fontcolot="white" color="white" px={2} py={1} borderRadius="xl" fontSize="xs" fontWeight="semibold">
                Unit
              </Box>
            </HStack>
            <Text fontSize="sm" color="gray.700">ATM</Text>
          </Box>
          
          <Box textAlign="center">
            <HStack spacing={1} align="baseline">
              <Text mt="20px" fontSize="2xl" fontWeight="bold" color="black">202</Text>
              <Box bg="yellow.400" color="white" px={2} py={1} borderRadius="xl" fontSize="xs" fontWeight="semibold">
                Unit
              </Box>
            </HStack>
            <Text fontSize="sm" color="gray.700">CRM</Text>
          </Box>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
