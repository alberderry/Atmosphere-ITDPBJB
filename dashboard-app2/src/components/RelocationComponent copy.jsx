"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Container,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Input,
  Button,
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Spacer,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  List,
  ListItem,
  useToast,
  Spinner,
  Tabs, // Ditambahkan untuk navigasi kategori lokasi umum
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react"
import { SearchIcon, InfoIcon, CheckIcon } from "@chakra-ui/icons"

// Google Maps API Key untuk penggunaan di frontend (memuat script peta dan Autocomplete)
// PENTING: API Key ini hanya digunakan untuk memuat script Google Maps JavaScript API (untuk peta dan Autocomplete)
// dan untuk menampilkan foto tempat. Panggilan Places API (Nearby Search, Place Details) akan melalui backend proxy.
const Maps_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// URL dasar untuk backend proxy Anda
// Pastikan ini sesuai dengan port tempat backend Anda berjalan (misal: http://localhost:5000)
const BACKEND_BASE_URL = "http://localhost:5000"

// Mock data untuk simulasi
const mockHistoricalData = [
  {
    id: 1,
    location: "Jakarta Pusat",
    lat: -6.2088,
    lng: 106.8456,
    success_rate: 85,
    roi: 120,
    customers: 1250,
    tier: "TIER 1",
  },
  {
    id: 2,
    location: "Bandung",
    lat: -6.9175,
    lng: 107.6191,
    success_rate: 78,
    roi: 95,
    customers: 890,
    tier: "TIER 2",
  },
  {
    id: 3,
    location: "Surabaya",
    lat: -7.2575,
    lng: 112.7521,
    success_rate: 82,
    roi: 110,
    customers: 1100,
    tier: "TIER 1",
  },
  {
    id: 4,
    location: "Medan",
    lat: 3.5952,
    lng: 98.6722,
    success_rate: 65,
    roi: 75,
    customers: 650,
    tier: "TIER 3",
  },
]

// const mockCustomerData = [
//   {
//     id: 1,
//     name: "PT. Maju Jaya",
//     type: "Corporate",
//     distance: 0.5,
//     value: "High",
//     transactions: 1250,
//     revenue: "2.5M",
//   },
//   {
//     id: 2,
//     name: "CV. Berkah Sentosa",
//     type: "SME",
//     distance: 0.8,
//     value: "Medium",
//     transactions: 890,
//     revenue: "1.2M",
//   },
//   {
//     id: 3,
//     name: "Toko Sari Raya",
//     type: "Retail",
//     distance: 1.2,
//     value: "Low",
//     transactions: 450,
//     revenue: "650K",
//   },
//   {
//     id: 4,
//     name: "PT. Global Tech Indonesia",
//     type: "Corporate",
//     distance: 1.5,
//     value: "High",
//     transactions: 2100,
//     revenue: "4.2M",
//   },
//   {
//     id: 5,
//     name: "UD. Makmur Sejahtera",
//     type: "SME",
//     distance: 1.8,
//     value: "Medium",
//     transactions: 720,
//     revenue: "980K",
//   },
// ]

const RelocationComponent = () => {
  const [locationName, setLocationName] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  // const [nearbyCustomers, setNearbyCustomers] = useState([])
  const [nearbyBJBBranches, setNearbyBJBBranches] = useState([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)

  // State baru untuk lokasi umum
  const [nearbyCommonPlaces, setNearbyCommonPlaces] = useState({
    schools: [],
    supermarkets: [],
    markets: [],
    universities: [],
    hotels: [],
  });
  const [isLoadingCommonPlaces, setIsLoadingCommonPlaces] = useState(false);


  // AutocompleteService diinisialisasi di frontend untuk saran input teks
  const autocompleteService = useRef(null)
  // PlacesService juga diinisialisasi di frontend untuk Nearby Search (seperti untuk KCP BJB dan lokasi umum lainnya)
  const placesService = useRef(null);

  const inputRef = useRef(null)
  const toast = useToast()
  const bgColor = useColorModeValue("blue.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")

  // Muat Google Maps API dan inisialisasi layanan Autocomplete dan PlacesService
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      // Periksa apakah Google Maps API sudah dimuat
      if (window.google && window.google.maps && window.google.maps.places) {
        if (!autocompleteService.current) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService()
        }
        if (!placesService.current) {
          // PlacesService memerlukan elemen DOM untuk diinisialisasi.
          // Pastikan dummy div terpasang ke DOM agar PlacesService berfungsi dengan benar.
          const dummyDiv = document.createElement('div');
          document.body.appendChild(dummyDiv); // Tambahkan ke body
          placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        }
        return;
      }

      // Buat elemen script untuk memuat Google Maps API
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        // Inisialisasi layanan setelah script dimuat
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        const dummyDiv = document.createElement('div');
        document.body.appendChild(dummyDiv); // Tambahkan ke body
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
      }
      script.onerror = () => {
        toast({
          title: "Error",
          description: "Gagal memuat Google Maps API. Periksa koneksi internet atau kunci API.",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
      document.head.appendChild(script)
    }

    loadGoogleMapsAPI()
  }, [toast]) // Tambahkan toast ke dependency array

  // Cari saran lokasi menggunakan Google Maps AutocompleteService (tetap di frontend)
  const searchLocations = (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!autocompleteService.current) {
      console.warn("Google Maps AutocompleteService belum dimuat. Tidak dapat mencari lokasi.")
      toast({
        title: "Peringatan",
        description: "Layanan pencarian lokasi belum siap. Coba lagi sebentar.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsLoadingSuggestions(true)
    autocompleteService.current.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: 'id' },
        types: ['establishment', 'geocode'],
      },
      (predictions, status) => {
        setIsLoadingSuggestions(false)
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setLocationSuggestions(predictions.slice(0, 5))
          setShowSuggestions(true)
        } else {
          console.error("Error fetching location suggestions:", status)
          setLocationSuggestions([])
          setShowSuggestions(false)
          toast({
            title: "Error",
            description: `Gagal mengambil saran lokasi: ${status}. Pastikan 'Places API' diaktifkan dan API Key Anda memiliki izin yang benar.`,
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        }
      },
    )
  }

  // Dapatkan detail lokasi dari place_id melalui backend proxy
  const getLocationDetails = async (placeId, description) => {
    try {
      console.log(`Fetching place details for placeId: ${placeId} from backend: ${BACKEND_BASE_URL}/api/place-details/${placeId}`);
      const response = await fetch(`${BACKEND_BASE_URL}/api/place-details/${placeId}`)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend responded with an error for place details:", response.status, errorData);
        // Stringify errorData.details if it's an object
        const errorMessage = errorData.details ? (typeof errorData.details === 'object' ? JSON.stringify(errorData.details) : errorData.details) : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const data = await response.json()
      console.log("Response data for place details from backend:", data);

      if (data.result && data.result.geometry) {
        const location = {
          name: data.result.name || description,
          formatted_address: data.result.formatted_address,
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng,
          place_id: placeId,
        }

        setSelectedLocation(location)
        setLocationName(description)
        setShowSuggestions(false)

        toast({
          title: "Lokasi Dipilih",
          description: `${location.name} berhasil dipilih`,
          status: "success",
          duration: 2000,
          isClosable: true,
        })
        return location
      } else {
        console.error("Backend response for place details did not contain 'result' or 'geometry':", data);
        throw new Error("No place details found or invalid response from backend.")
      }
    } catch (error) {
      console.error("Error in getLocationDetails (frontend catch block):", error);
      toast({
        title: "Error Detail Lokasi",
        description: `Gagal mengambil detail lokasi: ${error.message}. Pastikan backend proxy berjalan dan API Key Google Maps Anda valid di backend.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
      return null
    }
  }

  // Cari KCP BJB terdekat melalui backend proxy
  const searchNearbyBJBBranches = async (lat, lng) => {
    setIsLoadingBranches(true)
    let timeoutId = null;
    let apiCallCompleted = false;

    // Set timeout untuk 5 detik
    timeoutId = setTimeout(() => {
      if (!apiCallCompleted) {
        console.warn("Pencarian KCP BJB terdekat melebihi batas waktu (5 detik). Backend mungkin tidak merespons.");
        setIsLoadingBranches(false); // Hentikan loading spinner
        toast({
          title: "Pencarian Timeout",
          description: "Pencarian KCP BJB terdekat memakan waktu terlalu lama. Backend mungkin tidak merespons.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    }, 5000); // 5 detik

    console.log(`Memulai pencarian KCP BJB terdekat untuk Lat: ${lat}, Lng: ${lng} melalui backend proxy.`);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/places-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: { lat, lng },
          radius: 5000,
          keyword: 'bank bjb',
          type: 'bank'
        }),
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      apiCallCompleted = true;

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details ? (typeof errorData.details === 'object' ? JSON.stringify(errorData.details) : errorData.details) : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Respons dari backend proxy (Nearby Search):", data);

      if (data.results && data.results.length > 0) {
        const branchesWithDistance = data.results.map((branch) => {
          const distance = calculateDistance(lat, lng, branch.geometry.location.lat, branch.geometry.location.lng);
          return {
            id: branch.place_id,
            name: branch.name,
            address: branch.vicinity || branch.formatted_address,
            rating: branch.rating || 0,
            distance: distance.toFixed(1),
            isOpen: branch.opening_hours?.open_now,
            types: branch.types,
            lat: branch.geometry.location.lat,
            lng: branch.geometry.location.lng,
            photo: branch.photos?.[0]?.photo_reference,
          }
        })

        const sortedBranches = branchesWithDistance
          .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
          .slice(0, 10)

        setNearbyBJBBranches(sortedBranches)
      } else {
        setNearbyBJBBranches([]);
        toast({
          title: "Informasi",
          description: "Tidak ada KCP BJB ditemukan dalam radius 5km dari lokasi ini.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching nearby BJB branches from backend:", error)
      toast({
        title: "Error Pencarian KCP BJB",
        description: `Gagal mengambil data KCP BJB terdekat: ${error.message}. Pastikan backend proxy berjalan dan API Key Google Maps Anda valid di backend.`,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setIsLoadingBranches(false)
    }
  }

  // Fungsi untuk mencari lokasi umum terdekat (Sekolah, Supermarket, dll.)
  const searchNearbyCommonPlaces = async (lat, lng) => {
    setIsLoadingCommonPlaces(true);
    try {
      const commonPlaceTypes = {
        schools: { keyword: 'sekolah', type: 'school' },
        supermarkets: { keyword: 'supermarket', type: 'supermarket' },
        markets: { keyword: 'pasar', type: 'market' },
        universities: { keyword: 'universitas', type: 'university' },
        hotels: { keyword: 'hotel', type: 'lodging' },
      };

      const results = {};
      for (const key in commonPlaceTypes) {
        const { keyword, type } = commonPlaceTypes[key];
        const response = await fetch(`${BACKEND_BASE_URL}/api/places-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: { lat, lng },
            radius: 5000,
            keyword: keyword,
            type: type,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error fetching ${keyword} places:`, errorData);
          results[key] = []; // Set array kosong jika ada error
          toast({
            title: "Error Pencarian Lokasi Umum",
            description: `Gagal mengambil data ${keyword} terdekat: ${errorData.details || response.status}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          const data = await response.json();
          results[key] = data.results ? data.results.slice(0, 5).map(place => ({
              id: place.place_id,
              name: place.name,
              address: place.vicinity || place.formatted_address,
              rating: place.rating || 0,
              types: place.types,
              isOpen: place.opening_hours?.open_now,
              // Jika Anda ingin menampilkan jarak, Anda bisa menghitungnya di sini
              // distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng).toFixed(1),
          })) : [];
        }
      }
      setNearbyCommonPlaces(results);
    } catch (error) {
      console.error("Error in searchNearbyCommonPlaces:", error);
      toast({
        title: "Error Umum",
        description: `Terjadi kesalahan saat mencari lokasi umum: ${error.message}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingCommonPlaces(false);
    }
  };


  // Hitung jarak antara dua koordinat (rumus Haversine)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Radius Bumi dalam kilometer
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Tangani perubahan input lokasi
  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocationName(value)
    // Hanya cari jika nilai input tidak kosong dan memiliki setidaknya 3 karakter
    if (value.length >= 3) {
      searchLocations(value)
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Tangani pemilihan lokasi
  const handleLocationSelect = async (suggestion) => {
    // Reset analysis result saat lokasi baru dipilih
    setAnalysisResult(null);
    setNearbyCommonPlaces({ schools: [], supermarkets: [], markets: [], universities: [], hotels: [] }); // Reset lokasi umum

    const location = await getLocationDetails(suggestion.place_id, suggestion.description)
    if (location) {
      // Cari KCP BJB terdekat setelah mendapatkan detail lokasi
      await searchNearbyBJBBranches(location.lat, location.lng)
      // Cari lokasi umum terdekat setelah mendapatkan detail lokasi
      await searchNearbyCommonPlaces(location.lat, location.lng);
    }
  }

  // Simulasi analisis CBA berdasarkan historical data
  const performCBAAnalysis = (location) => {
    setIsAnalyzing(true)

    setTimeout(() => {
      // Simulasi scoring berdasarkan berbagai faktor
      // Anda bisa menggunakan location.lat dan location.lng di sini untuk simulasi yang lebih realistis
      const proximityScore = Math.random() * 30 + 20 // 20-50
      const demographicScore = Math.random() * 25 + 15 // 15-40
      const competitionScore = Math.random() * 20 + 10 // 10-30
      const accessibilityScore = Math.random() * 25 + 15 // 15-40

      // Skor bonus berdasarkan cabang BJB terdekat
      const branchProximityBonus = nearbyBJBBranches.length > 0 ? Math.min(nearbyBJBBranches.length * 2, 10) : 0

      const totalScore =
        proximityScore + demographicScore + competitionScore + accessibilityScore + branchProximityBonus

      let potential, color, recommendation, tier

      if (totalScore >= 75) {
        potential = "Berpotensi"
        color = "green"
        recommendation = "Lokasi sangat direkomendasikan untuk relokasi. ROI tinggi dan risiko rendah."
        
      } else if (totalScore >= 50) {
        potential = "Perlu Diperhitungkan"
        color = "yellow"
        recommendation = "Lokasi memerlukan analisis lebih mendalam. Potensi sedang dengan beberapa risiko."
        
      } else {
        potential = "Rentan"
        color = "red"
        recommendation = "Lokasi tidak direkomendasikan untuk relokasi. Risiko tinggi dan ROI rendah."
        
      }

      setAnalysisResult({
        score: totalScore.toFixed(1),
        potential,
        color,
        recommendation,
        tier,
        estimatedROI: (60 + Math.random() * 60).toFixed(1),
        customerDensity: Math.floor(300 + Math.random() * 1200),
        competitorCount: Math.floor(1 + Math.random() * 8),
        accessibilityScore: accessibilityScore.toFixed(1),
        proximityScore: proximityScore.toFixed(1),
        demographicScore: demographicScore.toFixed(1),
        competitionScore: competitionScore.toFixed(1),
        branchProximityBonus: branchProximityBonus.toFixed(1),
        estimatedCost: (500 + Math.random() * 1000).toFixed(0),
        breakEvenMonths: Math.floor(8 + Math.random() * 16),
        location: location,
        nearbyBranchCount: nearbyBJBBranches.length,
      })

      // // Simulasi data nasabah terdekat dengan variasi jarak
      // const shuffledCustomers = [...mockCustomerData]
      //   .sort(() => 0.5 - Math.random())
      //   .slice(0, 4)
      //   .map((customer) => ({
      //     ...customer,
      //     distance: (Math.random() * 2.5 + 0.3).toFixed(1),
      //   }))
      //   .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))

      // setNearbyCustomers(shuffledCustomers)
      setIsAnalyzing(false)
    }, 2500)
  }

  const handleAnalyze = () => {
    if (selectedLocation) {
      performCBAAnalysis(selectedLocation)
    } else {
      toast({
        title: "Lokasi Belum Dipilih",
        description: "Silakan pilih lokasi terlebih dahulu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getColorScheme = (potential) => {
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

  const getTierColor = (tier) => {
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

  const getBranchTypeIcon = (types) => {
    if (types.includes("atm")) return "🏧"
    if (types.includes("bank")) return "🏦"
    return "🏢"
  }

  const getCommonPlaceIcon = (types) => {
    if (types.includes("school")) return "🏫";
    if (types.includes("supermarket")) return "🛒";
    if (types.includes("market")) return "🍎"; // Menggunakan apel sebagai ikon pasar generik
    if (types.includes("university")) return "🎓";
    if (types.includes("lodging")) return "🏨";
    return "📍";
  }

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Card bg={cardBg} shadow="sm">
            <CardHeader pb={3}>
              <Heading size="lg" color="blue.600" mb={2}>
                Analisis Relokasi ATM/CRM BJB
              </Heading>
              <Text color="gray.600">
                Simulasi Cost-Benefit Analysis berdasarkan data historis relokasi dan analisis nasabah terdekat
              </Text>
            </CardHeader>
          </Card>

          {/* Location Search Section */}
          <Card bg={cardBg} shadow="sm">
            <CardHeader>
              <Heading size="md" color="gray.700">
                Pencarian Lokasi Target
              </Heading>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Cari dan pilih lokasi yang akan dianalisis untuk relokasi ATM/CRM
              </Text>
            </CardHeader>
            <CardBody pt={0}>
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4} alignItems="end">
                <GridItem>
                  <FormControl position="relative">
                    <FormLabel fontSize="sm" fontWeight="medium">
                      Nama Lokasi
                    </FormLabel>
                    <Input
                      ref={inputRef}
                      placeholder="Contoh: Mall Taman Anggrek Jakarta"
                      value={locationName}
                      onChange={handleLocationChange}
                      size="md"
                      autoComplete="off"
                    />
                    {isLoadingSuggestions && (
                      <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
                        <Spinner size="sm" color="blue.500" />
                      </Box>
                    )}

                    {/* Location Suggestions */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        zIndex={10}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="lg"
                        mt={1}
                        maxH="200px"
                        overflowY="auto"
                      >
                        <List spacing={0}>
                          {locationSuggestions.map((suggestion, index) => (
                            <ListItem
                              key={suggestion.place_id}
                              p={3}
                              cursor="pointer"
                              _hover={{ bg: "gray.50" }}
                              borderBottom={index < locationSuggestions.length - 1 ? "1px solid" : "none"}
                              borderBottomColor="gray.100"
                              onClick={() => handleLocationSelect(suggestion)}
                            >
                              <Text fontSize="sm" fontWeight="medium">
                                {suggestion.structured_formatting?.main_text || suggestion.description}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {suggestion.structured_formatting?.secondary_text || ""}
                              </Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </FormControl>
                </GridItem>
                <GridItem>
                  <Button
                    colorScheme="blue"
                    leftIcon={<SearchIcon />}
                    onClick={handleAnalyze}
                    isLoading={isAnalyzing}
                    loadingText="Menganalisis..."
                    isDisabled={!selectedLocation}
                    w="full"
                    size="md"
                  >
                    Analisis Lokasi
                  </Button>
                </GridItem>
              </Grid>

              {/* Selected Location Info */}
              {selectedLocation && (
                <Alert status="success" mt={4} borderRadius="md">
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle fontSize="sm">Lokasi Terpilih:</AlertTitle>
                    <AlertDescription fontSize="sm">
                      {selectedLocation.name} - {selectedLocation.formatted_address}
                    </AlertDescription>
                  </Box>
                  <Badge colorScheme="green" variant="subtle">
                    <CheckIcon mr={1} />
                    Siap Analisis
                  </Badge>
                </Alert>
              )}
            </CardBody>
          </Card>

          {/* Google Maps Embed */}
          {selectedLocation && (
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Heading size="md" color="gray.700">
                  Peta Lokasi
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Visualisasi lokasi target pada Google Maps
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <Box borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
                  <iframe
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    // URL yang benar untuk Google Maps Embed API
                    src={`https://www.google.com/maps/embed/v1/place?key=${Maps_API_KEY}&q=${encodeURIComponent(
                      selectedLocation.formatted_address,
                    )}&zoom=16`}
                    title="Location Map"
                  />
                </Box>
                <HStack mt={3} spacing={4} fontSize="sm" color="gray.600">
                  <Text>
                    <strong>Koordinat:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          )}

          {/* Nearby BJB Branches */}
          {selectedLocation && (
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Flex>
                  <Box>
                    <Heading size="md" color="gray.700">
                      KCP BJB Terdekat
                    </Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Kantor Cabang Pembantu dalam radius 5km
                    </Text>
                  </Box>
                  <Spacer />
                  {isLoadingBranches ? (
                    <Spinner size="sm" color="blue.500" />
                  ) : (
                    <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={3} py={1}>
                      {nearbyBJBBranches.length} KCP
                    </Badge>
                  )}
                </Flex>
              </CardHeader>
              <CardBody pt={0}>
                {isLoadingBranches ? (
                  <VStack spacing={3}>
                    <Spinner size="lg" color="blue.500" />
                    <Text fontSize="sm" color="gray.500">
                      Mencari KCP BJB terdekat...
                    </Text>
                  </VStack>
                ) : nearbyBJBBranches.length > 0 ? (
                  <VStack spacing={3} align="stretch" maxH="350px" overflowY="auto">
                    {nearbyBJBBranches.map((branch) => (
                      <Box
                        key={branch.id}
                        p={3}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Text fontSize="lg">{getBranchTypeIcon(branch.types)}</Text>
                          <Box flex="1">
                            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                              {branch.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600" noOfLines={2}>
                              {branch.address}
                            </Text>
                            <HStack spacing={2} mt={1}>
                              <Badge colorScheme="blue" variant="outline" fontSize="xs">
                                {branch.distance} km
                              </Badge>
                              {branch.rating > 0 && (
                                <Badge colorScheme="yellow" variant="outline" fontSize="xs">
                                  ⭐ {branch.rating}
                                </Badge>
                              )}
                              {branch.isOpen !== undefined && (
                                <Badge colorScheme={branch.isOpen ? "green" : "red"} variant="subtle" fontSize="xs">
                                  {branch.isOpen ? "Buka" : "Tutup"}
                                </Badge>
                              )}
                            </HStack>
                          </Box>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <VStack spacing={3} py={6}>
                    <Text fontSize="2xl">🏦</Text>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Tidak ada KCP BJB ditemukan dalam radius 5km
                    </Text>
                  </VStack>
                )}
              </CardBody>
            </Card>
          )}

          {/* BAGIAN BARU: Lokasi Umum Terdekat */}
          {selectedLocation && (
            <Card bg={cardBg} shadow="sm">
              <CardHeader>
                <Flex>
                  <Box>
                    <Heading size="md" color="gray.700">
                      Lokasi Umum Terdekat
                    </Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Sekolah, Supermarket, Pasar, Universitas, Hotel dalam radius 5km
                    </Text>
                  </Box>
                  <Spacer />
                  {isLoadingCommonPlaces && <Spinner size="sm" color="blue.500" />}
                </Flex>
              </CardHeader>
              <CardBody pt={0}>
                {isLoadingCommonPlaces ? (
                  <VStack spacing={3}>
                    <Spinner size="lg" color="blue.500" />
                    <Text fontSize="sm" color="gray.500">
                      Mencari lokasi umum terdekat...
                    </Text>
                  </VStack>
                ) : (
                  <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                      {Object.keys(nearbyCommonPlaces).map(key => {
                        const label = {
                          schools: 'Sekolah',
                          supermarkets: 'Supermarket',
                          markets: 'Pasar',
                          universities: 'Universitas',
                          hotels: 'Hotel',
                        }[key];
                        const count = nearbyCommonPlaces[key].length;
                        return (
                          <Tab key={key}>
                            <HStack spacing={1}>
                              <Text fontSize="lg">{getCommonPlaceIcon(key)}</Text>
                              <Text>{label} ({count})</Text>
                            </HStack>
                          </Tab>
                        );
                      })}
                    </TabList>
                    <TabPanels>
                      {Object.keys(nearbyCommonPlaces).map(key => (
                        <TabPanel key={key} p={4} maxH="300px" overflowY="auto">
                          {nearbyCommonPlaces[key].length > 0 ? (
                            <VStack spacing={3} align="stretch">
                              {nearbyCommonPlaces[key].map((place) => (
                                <Box
                                  key={place.id}
                                  p={3}
                                  border="1px solid"
                                  borderColor="gray.100"
                                  borderRadius="md"
                                  _hover={{ bg: "gray.50" }}
                                  transition="all 0.1s"
                                >
                                  <HStack spacing={2}>
                                    <Text fontSize="lg">{getCommonPlaceIcon(place.types)}</Text>
                                    <Box>
                                      <Text fontSize="sm" fontWeight="bold">{place.name}</Text>
                                      <Text fontSize="xs" color="gray.600">{place.address}</Text>
                                      <HStack spacing={2} mt={1}>
                                        {place.rating > 0 && (
                                          <Badge colorScheme="yellow" variant="outline" fontSize="xs">
                                            ⭐ {place.rating}
                                          </Badge>
                                        )}
                                        {place.isOpen !== undefined && (
                                          <Badge colorScheme={place.isOpen ? "green" : "red"} variant="subtle" fontSize="xs">
                                            {place.isOpen ? "Buka" : "Tutup"}
                                          </Badge>
                                        )}
                                      </HStack>
                                    </Box>
                                  </HStack>
                                </Box>
                              ))}
                            </VStack>
                          ) : (
                            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                              Tidak ada {({
                                schools: 'sekolah',
                                supermarkets: 'supermarket',
                                markets: 'pasar',
                                universities: 'universitas',
                                hotels: 'hotel',
                              }[key])} ditemukan dalam radius 5km.
                            </Text>
                          )}
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                )}
              </CardBody>
            </Card>
          )}


          {/* Analysis Results */}
          {analysisResult && (
            <>
              {/* Main Result Alert */}
              <Alert
                status={
                  analysisResult.color === "green" ? "success" : analysisResult.color === "yellow" ? "warning" : "error"
                }
                borderRadius="lg"
                p={4}
              >
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle fontSize="lg">
                    Status: {analysisResult.potential} ({analysisResult.tier})
                  </AlertTitle>
                  <AlertDescription fontSize="sm" mt={1}>
                    {analysisResult.recommendation}
                    {analysisResult.nearbyBranchCount > 0 && (
                      <Text as="span" fontWeight="medium" ml={2}>
                        • {analysisResult.nearbyBranchCount} KCP BJB terdekat ditemukan
                      </Text>
                    )}
                  </AlertDescription>
                </Box>
                <Badge colorScheme={getTierColor(analysisResult.tier)} variant="solid" fontSize="sm" px={3} py={1}>
                  {analysisResult.tier}
                </Badge>
              </Alert>

              {/* Detailed Metrics */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
                <Card bg={cardBg} shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="sm">Skor Total Potensi</StatLabel>
                      <StatNumber color={`${analysisResult.color}.500`} fontSize="2xl">
                        {analysisResult.score}%
                      </StatNumber>
                      <Progress
                        value={analysisResult.score}
                        colorScheme={getColorScheme(analysisResult.potential)}
                        size="sm"
                        mt={2}
                        borderRadius="full"
                      />
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="sm">Estimasi ROI</StatLabel>
                      <StatNumber fontSize="2xl">{analysisResult.estimatedROI}%</StatNumber>
                      <StatHelpText fontSize="xs">dalam 12 bulan</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="sm">Kepadatan Nasabah</StatLabel>
                      <StatNumber fontSize="2xl">{analysisResult.customerDensity}</StatNumber>
                      <StatHelpText fontSize="xs">dalam radius 2km</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="sm">KCP BJB Terdekat</StatLabel>
                      <StatNumber fontSize="2xl" color="blue.500">
                        {analysisResult.nearbyBranchCount}
                      </StatNumber>
                      <StatHelpText fontSize="xs">dalam radius 5km</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} shadow="sm">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="sm">Break Even Point</StatLabel>
                      <StatNumber fontSize="2xl">{analysisResult.breakEvenMonths}</StatNumber>
                      <StatHelpText fontSize="xs">bulan</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Detailed Analysis Breakdown */}
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md" color="gray.700">
                    Breakdown Analisis
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Skor Kedekatan Nasabah
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {analysisResult.proximityScore}%
                          </Text>
                        </Flex>
                        <Progress
                          value={analysisResult.proximityScore}
                          colorScheme="blue"
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>

                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Skor Demografis
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {analysisResult.demographicScore}%
                          </Text>
                        </Flex>
                        <Progress
                          value={analysisResult.demographicScore}
                          colorScheme="green"
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>

                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Bonus Kedekatan KCP BJB
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            +{analysisResult.branchProximityBonus}%
                          </Text>
                        </Flex>
                        <Progress
                          value={analysisResult.branchProximityBonus}
                          colorScheme="cyan"
                          size="sm"
                          borderRadius="full"
                          max={10}
                        />
                      </Box>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Skor Kompetisi
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {analysisResult.competitionScore}%
                          </Text>
                        </Flex>
                        <Progress
                          value={analysisResult.competitionScore}
                          colorScheme="orange"
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>

                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Skor Aksesibilitas
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {analysisResult.accessibilityScore}%
                          </Text>
                        </Flex>
                        <Progress
                          value={analysisResult.accessibilityScore}
                          colorScheme="purple"
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>
                    </VStack>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={6}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="sm">Estimasi Biaya Setup</StatLabel>
                      <StatNumber fontSize="lg">Rp {analysisResult.estimatedCost}M</StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel fontSize="sm">Jumlah Kompetitor</StatLabel>
                      <StatNumber fontSize="lg">{analysisResult.competitorCount}</StatNumber>
                    </Stat>
                    <Stat textAlign="center">
                      <StatLabel fontSize="sm">Skor Aksesibilitas</StatLabel>
                      <StatNumber fontSize="lg">{analysisResult.accessibilityScore}%</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Nearby Customers */}
              {/* <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Flex>
                    <Box>
                      <Heading size="md" color="gray.700">
                        Nasabah BJB Terdekat
                      </Heading>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Daftar nasabah dalam radius 2km dari lokasi target
                      </Text>
                    </Box>
                    <Spacer />
                    <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={3} py={1}>
                      {nearbyCustomers.length} Nasabah
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th fontSize="xs">Nama Nasabah</Th>
                          <Th fontSize="xs">Tipe</Th>
                          <Th fontSize="xs">Jarak (km)</Th>
                          <Th fontSize="xs">Nilai Nasabah</Th>
                          <Th fontSize="xs">Transaksi/Bulan</Th>
                          <Th fontSize="xs">Revenue</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {nearbyCustomers.map((customer) => (
                          <Tr key={customer.id}>
                            <Td fontWeight="medium" fontSize="sm">
                              {customer.name}
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  customer.type === "Corporate" ? "purple" : customer.type === "SME" ? "blue" : "green"
                                }
                                variant="subtle"
                                fontSize="xs"
                              >
                                {customer.type}
                              </Badge>
                            </Td>
                            <Td fontSize="sm">{customer.distance}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  customer.value === "High" ? "green" : customer.value === "Medium" ? "yellow" : "red"
                                }
                                variant="subtle"
                                fontSize="xs"
                              >
                                {customer.value}
                              </Badge>
                            </Td>
                            <Td fontSize="sm">{customer.transactions.toLocaleString()}</Td>
                            <Td fontSize="sm" fontWeight="medium">
                              Rp {customer.revenue}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card> */}

              {/* Historical Comparison */}
              <Card bg={cardBg} shadow="sm">
                <CardHeader>
                  <Heading size="md" color="gray.700">
                    Perbandingan dengan Data Historis
                  </Heading>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Referensi performa relokasi sebelumnya untuk benchmarking
                  </Text>
                </CardHeader>
                <CardBody pt={0}>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th fontSize="xs">Lokasi Referensi</Th>
                          <Th fontSize="xs">Tier</Th>
                          <Th fontSize="xs">Success Rate</Th>
                          <Th fontSize="xs">ROI (%)</Th>
                          <Th fontSize="xs">Jumlah Nasabah</Th>
                          <Th fontSize="xs">Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {mockHistoricalData.map((data) => (
                          <Tr key={data.id}>
                            <Td fontWeight="medium" fontSize="sm">
                              {data.location}
                            </Td>
                            <Td>
                              <Badge colorScheme={getTierColor(data.tier)} variant="solid" fontSize="xs">
                                {data.tier}
                              </Badge>
                            </Td>
                            <Td fontSize="sm">{data.success_rate}%</Td>
                            <Td fontSize="sm" fontWeight="medium">
                              {data.roi}%
                            </Td>
                            <Td fontSize="sm">{data.customers.toLocaleString()}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  data.success_rate >= 80 ? "green" : data.success_rate >= 60 ? "yellow" : "red"
                                }
                                variant="subtle"
                                fontSize="xs"
                              >
                                {data.success_rate >= 80 ? "Sukses" : data.success_rate >= 60 ? "Moderat" : "Kurang"}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </>
          )}

          {/* Instructions */}
          {!analysisResult && (
            <Card bg={cardBg} shadow="sm" borderLeft="4px solid" borderLeftColor="blue.400">
              <CardBody>
                <HStack align="start">
                  <InfoIcon color="blue.500" mt={1} />
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="medium" color="gray.700">
                      Panduan Penggunaan Analisis Relokasi:
                    </Text>
                    <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                      <Text>• Masukkan nama lokasi dan koordinat latitude/longitude lokasi target</Text>
                      <Text>• Klik "Analisis Lokasi" untuk memulai simulasi Cost-Benefit Analysis</Text>
                      <Text>
                        • Sistem akan mengevaluasi potensi berdasarkan kedekatan nasabah, demografi, kompetisi, dan
                        aksesibilitas
                      </Text>
                      <Text>• Review hasil analisis, nasabah terdekat, dan perbandingan dengan data historis</Text>
                      <Text>• Gunakan rekomendasi untuk pengambilan keputusan relokasi</Text>
                    </VStack>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default RelocationComponent
