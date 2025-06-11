  import {
    Box,
    Flex,
    Text,
    HStack,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Badge,
    VStack,
    Select,
    Card,
    CardBody
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import MapComponent from '../../components/MapComponent'

  const MapView = () => {
    const [activeView, ] = useState('Tier')
    const [selectedKanwil, setSelectedKanwil] = useState('Kanwil 1');

    // Dummy data untuk lokasi ATM
    // Menambahkan informasi yang diminta: jenis ATM/CRM, kode mesin, transaction metrics, avg fee, kantor induk, kanwil
    const atmLocations = [
      {
        id: 'ATM001',
        type: 'ATM',
        name: 'ATM KCP PRIORITAS 8908',
        address: 'Jl. Markoni No.45, Malabar, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40116',
        position: { lat: -6.9174, lng: 107.6191 }, // Dekat Jl. Markoni
        tier: 'TIER 1',
        machineCode: 'MCH-001',
        transactionMetrics: {
          avgTransaction: '2.245',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.170.803',
        },
        details: {
          kantorInduk: '001 - Utama Bandung',
          kanwil: 'Kanwil 1',
        },
      },
      {
        id: 'ATM002',
        type: 'CRM',
        name: 'CRM KCP BRAGA',
        address: 'Jl. Braga No.123, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111',
        position: { lat: -6.9147, lng: 107.6098 }, // Dekat Jl. Braga
        tier: 'TIER 2',
        machineCode: 'MCH-002',
        transactionMetrics: {
          avgTransaction: '1.800',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.120.000',
        },
        details: {
          kantorInduk: '001 - Utama Bandung',
          kanwil: 'Kanwil 1',
        },
      },
      {
        id: 'ATM003',
        type: 'ATM',
        name: 'ATM KCP NARIPAN',
        address: 'Jl. Naripan No.10, Kb. Pisang, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40112',
        position: { lat: -6.9180, lng: 107.6105 }, // Dekat Jl. Naripan
        tier: 'TIER 3',
        machineCode: 'MCH-003',
        transactionMetrics: {
          avgTransaction: '1.500',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.90.000',
        },
        details: {
          kantorInduk: '002 - Asia Afrika',
          kanwil: 'Kanwil 1',
        },
      },
      {
        id: 'ATM004',
        type: 'CRM',
        name: 'CRM KCP TAMBLONG',
        address: 'Jl. Tamblong No.50, Sumur Bandung, Kota Bandung, Jawa Barat 40112',
        position: { lat: -6.9189, lng: 107.6130 }, // Dekat Jl. Tamblong
        tier: 'TIER 4',
        machineCode: 'MCH-004',
        transactionMetrics: {
          avgTransaction: '800',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.40.000',
        },
        details: {
          kantorInduk: '002 - Asia Afrika',
          kanwil: 'Kanwil 1',
        },
      },
      {
        id: 'ATM005',
        type: 'ATM',
        name: 'ATM KCP BUAHBATU',
        address: 'Jl. Buah Batu No.275, Turangga, Kec. Lengkong, Kota Bandung, Jawa Barat 40264',
        position: { lat: -6.9400, lng: 107.6300 }, // Contoh lokasi lain
        tier: 'TIER 1',
        machineCode: 'MCH-005',
        transactionMetrics: {
          avgTransaction: '2.500',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.180.000',
        },
        details: {
          kantorInduk: '003 - Buah Batu',
          kanwil: 'Kanwil 2',
        },
      },
      {
        id: 'ATM006',
        type: 'ATM',
        name: 'ATM KCP CIMAHI',
        address: 'Jl. Jend. Sudirman No.123, Baros, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40521',
        position: { lat: -6.8800, lng: 107.5400 }, // Contoh lokasi lain
        tier: 'TIER 2',
        machineCode: 'MCH-006',
        transactionMetrics: {
          avgTransaction: '1.900',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.130.000',
        },
        details: {
          kantorInduk: '004 - Cimahi',
          kanwil: 'Kanwil 2',
        },
      },
      {
        id: 'ATM007',
        type: 'CRM',
        name: 'CRM KCP CIBIRU',
        address: 'Jl. Raya Cinunuk No.123, Cileunyi, Bandung, Jawa Barat 40623',
        position: { lat: -6.9300, lng: 107.7400 }, // Contoh lokasi lain
        tier: 'TIER 3',
        machineCode: 'MCH-007',
        transactionMetrics: {
          avgTransaction: '1.000',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.60.000',
        },
        details: {
          kantorInduk: '005 - Cileunyi',
          kanwil: 'Kanwil 3',
        },
      },
      {
        id: 'ATM008',
        type: 'ATM',
        name: 'ATM KCP PADALARANG',
        address: 'Jl. Raya Padalarang No.45, Padalarang, Bandung Barat, Jawa Barat 40553',
        position: { lat: -6.8500, lng: 107.4500 }, // Contoh lokasi lain
        tier: 'TIER 4',
        machineCode: 'MCH-008',
        transactionMetrics: {
          avgTransaction: '500',
          feeStructure: 'Avg Fee',
          avgFeeValue: 'Rp.25.000',
        },
        details: {
          kantorInduk: '006 - Padalarang',
          kanwil: 'Kanwil 3',
        },
      },
    ];

    const tableData = [
      {
        tier: 'TIDAK DIHITUNG',
        kelompokTier: 21,
        jumlahMesin: '-',
        persentase: '3.67%',
        rataTransaksi: '-',
        rataFee: '-',
        color: 'gray'
      },
      {
        tier: 'TIER 1',
        kelompokTier: 124,
        jumlahMesin: '21.68%',
        persentase: '21.68%',
        rataTransaksi: '580.441',
        rataFee: '91.005.852',
        color: 'blue'
      },
      {
        tier: 'TIER 2',
        kelompokTier: 170,
        persentase: '29.72%',
        rataTransaksi: '463.236',
        rataFee: '77.024.195',
        color: 'green'
      },
      {
        tier: 'TIER 3',
        kelompokTier: 145,
        persentase: '25.35%',
        rataTransaksi: '311.836',
        rataFee: '43.375.170',
        color: 'yellow'
      },
      {
        tier: 'TIER 4',
        kelompokTier: 112,
        persentase: '19.58%',
        rataTransaksi: '62.667',
        rataFee: '16.940.605',
        color: 'red'
      }
    ]

    const totalRow = {
      kelompokTier: 572,
      persentase: '100%',
      rataTransaksi: '1.318.170',
      rataFee: '227.445.822'
    }

    const getTierColor = (tier) => {
      switch(tier) {
        case 'TIER 1': return 'blue'
        case 'TIER 2': return 'green'
        case 'TIER 3': return 'yellow'
        case 'TIER 4': return 'red'
        default: return 'gray'
      }
    }

    return (
      <Box p={6} bg="blue.50" minH="calc(100vh - 60px)"> {/* Latar belakang biru muda untuk seluruh halaman */}
        <VStack spacing={6} align="stretch">
          {/* ATM & CRM Positioning Section - Dibungkus dalam Card putih */}
          <Card borderRadius="lg" boxShadow="md">
            <CardBody>
              <Flex justify="space-between" align="center" mb={4}> {/* Menambahkan margin-bottom untuk spasi */}
                <Text fontSize="lg" fontWeight="semibold">ATM & CRM Positioning</Text>
                <HStack
                  bg="white"
                  p={1}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  
                  
                </HStack>
              </Flex>

              {/* Map */}
              <Box
                h="400px"
                bg="gray.100"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                mb={4}
              >
                {/* Meneruskan atmLocations dan getTierColor ke MapComponent */}
                <MapComponent atmLocations={atmLocations} getTierColor={getTierColor} activeView={activeView} />
              </Box>

              {/* Legend */}
              <HStack spacing={6} justify="center" pt={2} pb={4}>
                <HStack>
                  <Box w={3} h={3} bg="gray.500" borderRadius="full" />
                  <Text fontSize="sm">TIDAK DIHITUNG</Text>
                </HStack>
                <HStack>
                  <Box w={3} h={3} bg="blue.500" borderRadius="full" />
                  <Text fontSize="sm">TIER 1</Text>
                </HStack>
                <HStack>
                  <Box w={3} h={3} bg="green.500" borderRadius="full" />
                  <Text fontSize="sm">TIER 2</Text>
                </HStack>
                <HStack>
                  <Box w={3} h={3} bg="yellow.500" borderRadius="full" />
                  <Text fontSize="sm">TIER 3</Text>
                </HStack>
                <HStack>
                  <Box w={3} h={3} bg="red.500" borderRadius="full" />
                  <Text fontSize="sm">TIER 4</Text>
                </HStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Table Utilitas Mesin - Dibungkus dalam Card putih */}
          <Card bg="white" p={4} borderRadius="lg" boxShadow="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="lg" fontWeight="semibold">Utilitas Mesin</Text>
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
                  <option value="Kanwil 1" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 1</option>
                  <option value="Kanwil 2" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 2</option>
                  <option value="Kanwil 3" style={{ backgroundColor: 'white', color: 'black' }}>Kanwil 3</option>
                </Select>
              </HStack>
            </Flex>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Kelompok Tier</Th>
                    <Th textAlign="center">Jumlah Mesin</Th>
                    <Th textAlign="center">Persentase</Th>
                    <Th textAlign="center">Rata-rata Transaksi</Th>
                    <Th textAlign="center">Rata-rata Fee (Rp.)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableData.map((row, index) => (
                    <Tr key={index}>
                      <Td>
                        <Badge
                          colorScheme={getTierColor(row.tier)}
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          {row.tier}
                        </Badge>
                      </Td>
                      <Td textAlign="center" fontWeight="semibold">{row.kelompokTier}</Td>
                      <Td textAlign="center">{row.persentase}</Td>
                      <Td textAlign="center">{row.rataTransaksi}</Td>
                      <Td textAlign="center">{row.rataFee}</Td>
                    </Tr>
                  ))}
                  <Tr bg="blue.50" fontWeight="bold">
                    <Td>TOTAL</Td>
                    <Td textAlign="center">{totalRow.kelompokTier}</Td>
                    <Td textAlign="center">{totalRow.persentase}</Td>
                    <Td textAlign="center">{totalRow.rataTransaksi}</Td>
                    <Td textAlign="center">{totalRow.rataFee}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Card>
        </VStack>
      </Box>
    )
  }

  export default MapView
