import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardHeader,
  CardBody,
  Text,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Flex,
  SimpleGrid,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import * as d3 from 'd3'; // Import d3 untuk menggambar SVG kustom

// Custom Tooltip untuk Pie Chart
const CustomPieTooltip = ({ active, payload }) => {
  // Memastikan tooltip hanya aktif dan memiliki payload
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Mengambil data dari payload pertama
    return (
      <Box
        bg="white"
        p={3}
        borderRadius="md"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text fontWeight="bold" color={data.color}>{data.name}</Text>
        <Text fontSize="sm">Persentase: {data.value.toFixed(2)}%</Text>
        <Text fontSize="sm">Jumlah ATM: {data.atmCount}</Text>
        <Text fontSize="sm">Jumlah CRM: {data.crmCount}</Text>
      </Box>
    );
  }
  return null;
};

// Custom Label untuk CustomDonutChart
const CustomLabel = ({ arc }) => {
  // Mengurangi offset untuk mendekatkan label ke irisan
  const labelOffset = 45; // Jarak label dari tepi luar dinamis donut (ditingkatkan)
  const dotOffset = 30;  // Jarak titik warna dari tepi luar dinamis donut (ditingkatkan)

  // Menggunakan d3.arc() untuk menghitung posisi centroid pada busur imajiner
  // Ini membantu label "mengikuti" bentuk melengkung irisan
  const labelArcGenerator = d3.arc()
    .innerRadius(arc.dynamicOuterRadius + labelOffset)
    .outerRadius(arc.dynamicOuterRadius + labelOffset);

  const dotArcGenerator = d3.arc()
    .innerRadius(arc.dynamicOuterRadius + dotOffset)
    .outerRadius(arc.dynamicOuterRadius + dotOffset);

  const [x, y] = labelArcGenerator.centroid(arc);
  const [dotX, dotY] = dotArcGenerator.centroid(arc);

  // Menentukan posisi anchor teks (start atau end) berdasarkan posisi sudut
  // Ini memastikan teks menjauh dari pusat chart
  const midAngle = (arc.startAngle + arc.endAngle) / 2;
  const textAnchor = (midAngle > Math.PI / 2 && midAngle < 3 * Math.PI / 2) ? 'end' : 'start';

  return (
    <g>
      {/* Titik warna (SVG circle) */}
      <circle cx={dotX} cy={dotY} r={4} fill={arc.data.color} />

      {/* Teks label (SVG text) */}
      <text x={x} y={y} fill={arc.data.color} textAnchor={textAnchor} dominantBaseline="central">
        <tspan x={x} dy="-0.5em" style={{ fontWeight: 'bold', fontSize: '12px' }}>{arc.data.name}</tspan>
        <tspan x={x} dy="1em" style={{ fontSize: '11px' }}>{`${(arc.data.value).toFixed(2)}%`}</tspan>
      </text>
    </g>
  );
};

// Komponen Donut Chart Kustom
const CustomDonutChart = ({ data, width = 300, height = 300 }) => {
  const centerX = width / 2; // Pusat X chart
  const centerY = height / 2; // Pusat Y chart
  const baseInnerRadius = 60; // Radius dalam dasar
  const baseOuterRadius = 90; // Radius luar dasar
  const maxThicknessIncrease = 40; // Peningkatan ketebalan maksimum untuk irisan terbesar

  // Mengatur d3.pie untuk menghitung sudut awal dan akhir setiap irisan
  const pie = d3.pie()
    .value(d => d.value) // Menggunakan 'value' (persentase) untuk menentukan ukuran irisan
    .sort(null); // Mempertahankan urutan data asli

  // Menghitung data untuk setiap irisan (arc)
  const arcs = pie(data).map(p => {
    // Menghitung radius luar dinamis berdasarkan persentase
    // Semakin besar persentase, semakin tebal irisan
    const dynamicOuterRadius = baseOuterRadius + (p.data.value / 100) * maxThicknessIncrease;

    // Membuat generator arc untuk setiap irisan dengan radius dinamis
    const arcGenerator = d3.arc()
      .innerRadius(baseInnerRadius)
      .outerRadius(dynamicOuterRadius);

    return {
      ...p, // Menyalin semua properti dari objek pie asli
      path: arcGenerator(p), // Data path SVG untuk irisan
      centroid: arcGenerator.centroid(p), // Titik tengah irisan untuk penempatan label
      dynamicOuterRadius: dynamicOuterRadius, // Radius luar yang dihitung
    };
  });

  const [hoveredSlice, setHoveredSlice] = useState(null); // State untuk melacak irisan yang di-hover
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 }); // Posisi tooltip

  // Handler saat mouse bergerak di atas irisan
  const handleMouseMove = (event, sliceData) => {
    setHoveredSlice(sliceData);
    // Menggunakan clientX/Y untuk posisi tooltip yang akurat di layar
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  // Handler saat mouse meninggalkan irisan
  const handleMouseLeave = () => {
    setHoveredSlice(null);
  };

  return (
    <Box position="relative" width={width} height={height}>
      {/* SVG Container untuk menggambar donut chart */}
      <svg width={width} height={height}>
        {/* Grup untuk menempatkan semua irisan di tengah SVG */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {arcs.map((arc, index) => (
            <path
              key={index}
              d={arc.path} // Data path SVG
              fill={arc.data.color} // Warna irisan
              onMouseMove={(e) => handleMouseMove(e, arc.data)} // Event hover
              onMouseLeave={handleMouseLeave} // Event mouse leave
              style={{ transition: 'fill 0.3s ease' }} // Transisi warna saat hover
            />
          ))}
          {/* Render Custom Labels untuk setiap irisan */}
          {arcs.map((arc, index) => (
            <CustomLabel
              key={`label-${index}`}
              arc={arc} // Meneruskan data arc lengkap ke komponen label
            />
          ))}
        </g>
      </svg>
      {/* Teks di tengah chart (Total Unit, ATM, CRM) - DIHILANGKAN */}
      {/* <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1}
        color="gray.800"
        spacing={0}
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        textAlign="center"
      >
        <Text fontSize="md" fontWeight="bold">
          {totalUnits.total} Unit
        </Text>
        <Text fontSize="xs" color="gray.600">ATM: {totalUnits.atm}</Text>
        <Text fontSize="xs" color="gray.600">CRM: {totalUnits.crm}</Text>
      </VStack> */}

      {/* Tooltip yang muncul saat hover */}
      {hoveredSlice && (
        <Box
          position="fixed" // Menggunakan fixed agar tooltip tidak terpotong oleh overflow container
          left={tooltipPos.x + 10} // Offset posisi tooltip dari kursor
          top={tooltipPos.y + 10}
          zIndex={999} // Memastikan tooltip berada di atas elemen lain
        >
          <CustomPieTooltip active={true} payload={[{ payload: hoveredSlice }]} />
        </Box>
      )}
    </Box>
  );
};


const DashboardComponent = ({
  totalUnits, // Digunakan untuk menampilkan total ATM/CRM di tengah chart
  summaryStats,
  tierDistributionData, // Data ini datang dari props dengan atmCount/crmCount
  performanceTrendsData,
  roiTrendsData,
  leaderboardData,
  leaderboardTab,
  setLeaderboardTab,
  leaderboardMetric,
  setLeaderboardMetric,
}) => {
  // Mengambil nilai untuk mode terang/gelap dari Chakra UI
  const bgColor = useColorModeValue("blue.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
      
        {/* Bagian Statistik Ringkasan */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {summaryStats.map((stat, index) => (
            <Card key={index} bg={cardBg} shadow="sm">
              <CardBody>
                <VStack align="start" spacing={1}>
                  <Text fontSize="md" color="gray.600">{stat.label}</Text>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="1xl" fontWeight="bold" color="gray.800">{stat.value}</Text>
                    <Badge colorScheme={stat.color} variant="subtle" px={1} py={1} borderRadius="md">
                      {stat.growth}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">from last period</Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Bagian Chart - Dimodifikasi untuk menyelaraskan ketiga chart */}
        <Grid templateColumns={{ base: '1fr', md: '1fr', lg: 'repeat(3, 1fr)' }} gap={6}>
          {/* Chart Distribusi Tier (Donut Chart) - Menggunakan komponen kustom */}
          <GridItem>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="md" color="gray.700">Tier Distribution</Heading>
              </CardHeader>
              <CardBody>
                <Box position="relative" w="full" h="300px"> {/* Ukuran chart lebih besar untuk mengakomodasi label */}
                  <CustomDonutChart
                    data={tierDistributionData}
                    totalUnits={totalUnits}
                    width={300} // Sesuaikan lebar chart
                    height={300} // Sesuaikan tinggi chart
                  />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Chart Tren Kinerja (Bar Chart dengan Garis) */}
          <GridItem>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="md" color="gray.700">Performance Trends</Heading>
              </CardHeader>
              <CardBody>
                <Box w="full" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#8884d8" name="Amount" />
                      <Bar dataKey="fee" fill="#82ca9d" name="Fee" />
                      <Line type="monotone" dataKey="transaction" stroke="#ffc658" name="Transaction" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Chart Tren ROI (Line Chart dengan Bar) */}
          <GridItem>
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="md" color="gray.700">ROI Trends</Heading>
              </CardHeader>
              <CardBody>
                <Box w="full" h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roiTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="roi" stroke="#8884d8" activeDot={{ r: 8 }} name="ROI" />
                      <Bar dataKey="cost" fill="#82ca9d" name="Cost" /> {/* Menggunakan Bar untuk Cost sesuai gambar */}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Bagian Leaderboard Kinerja */}
        <Card bg={cardBg} shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="lg" fontWeight="semibold">Performance Leaderboard</Text>

              <Tabs variant="enclosed" index={leaderboardTab} onChange={(index) => setLeaderboardTab(index)}>
                <HStack justify="space-between">
                  <TabList>
                    <Tab _selected={{ bg: "blue.500", color: "white" }}>ATM</Tab>
                    <Tab _selected={{ bg: "blue.500", color: "white" }}>KC</Tab>
                    <Tab _selected={{ bg: "blue.500", color: "white" }}>KANWIL</Tab>
                  </TabList>

                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="blue.500" color="white" size="sm">
                      {leaderboardMetric}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setLeaderboardMetric('Revenue')}>Fee</MenuItem>
                      <MenuItem onClick={() => setLeaderboardMetric('Transactions')}>Transactions</MenuItem>
                      <MenuItem onClick={() => setLeaderboardMetric('Growth')}>Revenue</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>

                <TabPanels>
                  {/* Panel Tab untuk ATM, KC, KANWIL (menggunakan struktur tabel yang sama) */}
                  {[0, 1, 2].map(tabIndex => (
                    <TabPanel key={tabIndex} p={0} pt={4}>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th></Th> {/* Kolom kosong untuk Avatar/Nama */}
                              <Th>Revenue</Th>
                              <Th>Transactions Fee</Th>
                              <Th>Transactions</Th>
                              <Th>Growth</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {leaderboardData.map((item) => (
                              <Tr key={item.id}>
                                <Td>
                                  <HStack spacing={3}>
                                    <Avatar size="sm" bg={item.avatarBg} />
                                    <VStack align="start" spacing={0}>
                                      <HStack>
                                        <Text fontSize="sm" fontWeight="medium">{item.name}</Text>
                                        {item.code && <Badge colorScheme="blue" size="sm">{item.code}</Badge>}
                                      </HStack>
                                      <HStack spacing={4}>
                                        {item.kc && <Text fontSize="xs" color="gray.600">{item.kc}</Text>}
                                        {item.kanwil && <Text fontSize="xs" color="gray.600">{item.kanwil}</Text>}
                                      </HStack>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" fontWeight="medium">Rp.{item.revenue}</Text>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" fontWeight="medium">Rp.{item.fee || '-'}</Text>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" fontWeight="medium">{item.transactions}</Text>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" fontWeight="medium" color={item.growth.startsWith('+') ? 'green.500' : 'red.500'}>
                                    {item.growth}
                                  </Text>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default DashboardComponent;
