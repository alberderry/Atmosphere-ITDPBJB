// src/pages/RelocationComponent.jsx (File Utama)

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Box,
  Container,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"

// Import komponen-komponen yang telah dipisahkan
import RelocationHeader from "../relocation/RelocationHeader"
import LocationSearchCard from "../relocation/LocationSearchCard"
import InteractiveMapCard from "../relocation/InteractiveMapCard" // Jalur import yang benar
import NearbyBranchesCard from "../relocation/NearbyBranchesCard"
import NearbyCommonPlacesCard from "../relocation/NearbyCommonPlacesCard"
import CBAAnalysisResultCards from "../relocation/CBAAnalysisResultCards"
import RelocationInstructions from "../relocation/RelocationInstructions"
import CostInputCard from "../relocation/CostInputCard";
import NearbyOtherBanksCard from "../relocation/NearbyOtherBankCards"

// Import fungsi-fungsi utilitas
import { calculateDistance } from "../../utils/relocationUtils"

// Google Maps API Key untuk penggunaan di frontend (memuat script peta dan Autocomplete)
const Maps_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// URL dasar untuk backend proxy Anda
const BACKEND_BASE_URL = "http://localhost:5000"

// Mock data untuk simulasi (tetap di sini karena digunakan di CBAAnalysisResultCards)
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


const RelocationComponent = () => { // Nama komponen diubah menjadi RelocationComponent
  const [locationName, setLocationName] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [nearbyBJBBranches, setNearbyBJBBranches] = useState([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)

  const [nearbyOtherBanks, setNearbyOtherBanks] = useState([]); // <--- State baru untuk ATM lain
  const [isLoadingOtherBanks, setIsLoadingOtherBanks] = useState(false); // <--- Loading state baru

  const [nearbyCommonPlaces, setNearbyCommonPlaces] = useState({
    schools: [],
    supermarkets: [],
    markets: [],
    universities: [],
    hotels: [],
    healthFacilities: [], // <--- Kategori baru
    housingComplexes: [], // <--- Kategori baru
  });
  const [isLoadingCommonPlaces, setIsLoadingCommonPlaces] = useState(false);

  // Refs untuk Google Maps
  const autocompleteService = useRef(null)
  const placesService = useRef(null);
  const mapRef = useRef(null); // Ref untuk instance peta Google
  const markerRef = useRef(null); // Ref untuk instance marker peta (digunakan untuk selectedLocation)
  const mapContainerRef = useRef(null); // Ref untuk div container peta

  const toast = useToast()
  const bgColor = useColorModeValue("blue.50", "gray.900")
  const cardBg = useColorModeValue("white", "gray.800")

  // State untuk melacak apakah Google Maps API sudah dimuat
  // (Dihapus karena tidak digunakan)

  // Muat Google Maps API dan inisialisasi layanan Autocomplete dan PlacesService
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        if (!autocompleteService.current) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService()
        }
        if (!placesService.current) {
          const dummyDiv = document.createElement('div');
          document.body.appendChild(dummyDiv);
          placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        }
        return;
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        const dummyDiv = document.createElement('div');
        document.body.appendChild(dummyDiv);
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
      }
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
  }, [toast])


  // Callback untuk memperbarui selectedLocation dari interaksi peta
  const updateSelectedLocationFromMap = useCallback(async (lat, lng) => {
    // Reset analysis result saat lokasi baru dipilih dari peta
    setAnalysisResult(null);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/reverse-geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const address = data.results[0]?.formatted_address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      const name = data.results[0]?.address_components?.find(comp => comp.types.includes('establishment') || comp.types.includes('point_of_interest'))?.long_name || address;

      const newLocation = {
        name: name,
        formatted_address: address,
        lat: lat,
        lng: lng,
        place_id: data.results[0]?.place_id || null,
      };
      setSelectedLocation(newLocation);
      setLocationName(newLocation.formatted_address);
      
      toast({
        title: "Lokasi Peta Diperbarui",
        description: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        status: "info",
        duration: 2000,
        isClosable: true,
      });

      // searchNearbyBJBBranches, searchNearbyOtherBanks, dan searchNearbyCommonPlaces
      // akan dipanggil setelah analisis dilakukan (jika user menekan tombol analisis)

    } catch (error) {
      console.error("Error reverse geocoding:", error);
      toast({
        title: "Error Reverse Geocoding",
        description: `Gagal mendapatkan nama lokasi dari koordinat: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSelectedLocation({
        name: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        formatted_address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        lat: lat,
        lng: lng,
        place_id: null,
      });
      setLocationName(`Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      // searchNearbyBJBBranches, searchNearbyOtherBanks, dan searchNearbyCommonPlaces
      // akan dipanggil setelah analisis dilakukan (jika user menekan tombol analisis)
    }
  }, [toast]);

  // Cari saran lokasi menggunakan Google Maps AutocompleteService
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
    // Reset analysis result saat lokasi baru dipilih dari autocomplete
    setAnalysisResult(null);
    setNearbyCommonPlaces({
      schools: [],
      supermarkets: [],
      markets: [],
      universities: [],
      hotels: [],
      healthFacilities: [], 
      housingComplexes: [], 
    });
    setNearbyBJBBranches([]);
    setNearbyOtherBanks([]); // <--- Reset ATM lain

    try {
      console.log(`Fetching place details for placeId: ${placeId} from backend: ${BACKEND_BASE_URL}/api/place-details/${placeId}`);
      const response = await fetch(`${BACKEND_BASE_URL}/api/place-details/${placeId}`)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend responded with an error for place details:", response.status, errorData);
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
  const searchNearbyBJBBranches = useCallback(async (lat, lng) => {
    setIsLoadingBranches(true)
    let timeoutId = null;
    let apiCallCompleted = false;

    timeoutId = setTimeout(() => {
      if (!apiCallCompleted) {
        console.warn("Pencarian KCP BJB terdekat melebihi batas waktu (5 detik). Backend mungkin tidak merespons.");
        setIsLoadingBranches(false);
        toast({
          title: "Pencarian Timeout",
          description: "Pencarian KCP BJB terdekat memakan waktu terlalu lama. Backend mungkin tidak merespons.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    }, 5000);

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
      console.log("Respons dari backend proxy (Nearby Search BJB):", data);

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
            url: `https://www.google.com/maps/search/?api=1&query=${branch.geometry.location.lat},${branch.geometry.location.lng}&query_place_id=${branch.place_id}` 
          }
        })

        const sortedBranches = branchesWithDistance
          .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
          .slice(0, 10)

        setNearbyBJBBranches(sortedBranches)
        return sortedBranches; // Return the data
      } else {
        setNearbyBJBBranches([]);
        return []; // Return empty array
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
      return []; // Return empty array on error
    } finally {
      setIsLoadingBranches(false)
    }
  }, [toast]);

  // Fungsi untuk mencari ATM lain terdekat (selain BJB)
  const searchNearbyOtherBanks = useCallback(async (lat, lng) => {
    setIsLoadingOtherBanks(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/places-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: { lat, lng },
          radius: 5000,
          keyword: 'atm', // Mengubah keyword menjadi 'atm'
          type: 'point_of_interest', // Menggunakan type yang lebih umum untuk ATM
          exclude_keyword: ['bank bjb', 'bjb'], 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching nearby other ATMs:", errorData);
        setNearbyOtherBanks([]);
        toast({
          title: "Error Pencarian ATM Lain",
          description: `Gagal mengambil data ATM lain terdekat: ${errorData.details || response.status}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return [];
      }

      const data = await response.json();
      console.log("Respons dari backend proxy (Nearby Other ATMs):", data);

      if (data.results && data.results.length > 0) {
        const atmsWithDistance = data.results
          .filter(atm => 
            // Pastikan bukan BJB dan mengandung kata 'atm' atau memang bertipe 'atm'
            !atm.name.toLowerCase().includes('bank bjb') && 
            !atm.name.toLowerCase().includes('bjb') &&
            (atm.name.toLowerCase().includes('atm') || atm.types.includes('atm') || atm.types.includes('finance') || atm.types.includes('bank')) // Perbaiki filter
          ) 
          .map(atm => {
            const distance = calculateDistance(lat, lng, atm.geometry.location.lat, atm.geometry.location.lng);
            return {
              id: atm.place_id,
              name: atm.name,
              address: atm.vicinity || atm.formatted_address,
              rating: atm.rating || 0,
              distance: distance.toFixed(1),
              isOpen: atm.opening_hours?.open_now,
              types: atm.types,
              lat: atm.geometry.location.lat,
              lng: atm.geometry.location.lng,
              photo: atm.photos?.[0]?.photo_reference,
              url: `https://www.google.com/maps/search/?api=1&query=${atm.geometry.location.lat},${atm.geometry.location.lng}&query_place_id=${atm.place_id}` 
            };
          });
        
        const sortedAtms = atmsWithDistance
          .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
          .slice(0, 10);

        setNearbyOtherBanks(sortedAtms);
        return sortedAtms;
      } else {
        setNearbyOtherBanks([]);
        return [];
      }
    } catch (error) {
      console.error("Error in searchNearbyOtherBanks:", error);
      toast({
        title: "Error Umum",
        description: `Terjadi kesalahan saat mencari ATM lain: ${error.message}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return [];
    } finally {
      setIsLoadingOtherBanks(false);
    }
  }, [toast]);


  // Fungsi untuk mencari lokasi umum terdekat (Sekolah, Supermarket, dll.)
  const searchNearbyCommonPlaces = useCallback(async (lat, lng) => {
    setIsLoadingCommonPlaces(true);
    try {
      const commonPlaceTypes = {
        schools: { keyword: 'sekolah', type: 'school' },
        supermarkets: { keyword: 'supermarket', type: 'supermarket' },
        markets: { keyword: 'pasar', type: 'market' },
        universities: { keyword: 'universitas', type: 'university' },
        hotels: { keyword: 'hotel', type: 'lodging' },
        healthFacilities: { keyword: 'rumah sakit|klinik|puskesmas', type: 'hospital|health|doctor' }, 
        housingComplexes: { keyword: 'perumahan|komplek|apartemen', type: 'establishment|point_of_interest' }, 
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
          results[key] = [];
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
            url: `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}&query_place_id=${place.place_id}` 
          })) : [];
        }
      }
      setNearbyCommonPlaces(results);
      return results; // Return the aggregated results
    } catch (error) {
      console.error("Error in searchNearbyCommonPlaces:", error);
      toast({
        title: "Error Umum",
        description: `Terjadi kesalahan saat mencari lokasi umum: ${error.message}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return {}; // Return empty object on error
    } finally {
      setIsLoadingCommonPlaces(false);
    }
  }, [toast]);


  // Tangani perubahan input lokasi
  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocationName(value)
    if (value.length >= 3) {
      searchLocations(value)
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Tangani pemilihan lokasi dari saran autocomplete
  const handleLocationSelect = async (suggestion) => {
    setAnalysisResult(null);
    setNearbyCommonPlaces({
      schools: [],
      supermarkets: [], 
      markets: [],
      universities: [],
      hotels: [],
      healthFacilities: [], 
      housingComplexes: [], 
    });
    setNearbyBJBBranches([]);
    setNearbyOtherBanks([]); // <--- Reset ATM lain saat lokasi dipilih

    const location = await getLocationDetails(suggestion.place_id, suggestion.description)
    if (location) {
      // Peta akan diupdate secara otomatis melalui useEffect karena selectedLocation berubah
      // searchNearbyBJBBranches dan searchNearbyCommonPlaces akan dipanggil setelah analisis dilakukan
    }
  }

  // Simulasi analisis CBA berdasarkan historical data
  const performCBAAnalysis = async (location) => {
    setIsAnalyzing(true)

    // Panggil pencarian KCP BJB, ATM lain, dan lokasi umum terdekat di sini,
    // dan tunggu hingga selesai sebelum melanjutkan analisis.
    const branchesData = await searchNearbyBJBBranches(location.lat, location.lng);
    const otherBanksData = await searchNearbyOtherBanks(location.lat, location.lng); // <--- Panggil fungsi baru
    const commonPlacesData = await searchNearbyCommonPlaces(location.lat, location.lng);

    // Hitung total lokasi umum terdekat dari data yang dikembalikan
    const totalCommonPlaces = Object.values(commonPlacesData).reduce((sum, arr) => sum + arr.length, 0);

    setTimeout(() => {
      const proximityScore = Math.random() * 30 + 20 // 20-50
      const demographicScore = Math.random() * 25 + 15 // 15-40
      const competitionScore = Math.random() * 20 + 10 // 10-30
      const accessibilityScore = Math.random() * 25 + 15 // 15-40

      // Gunakan branchesData.length untuk branchProximityBonus
      const branchProximityBonus = branchesData.length > 0 ? Math.min(branchesData.length * 2, 10) : 0

      // Tambahkan bonus berdasarkan jumlah ATM lain terdekat (misal: lebih banyak kompetitor, skor kompetisi lebih rendah)
      const otherBankImpact = otherBanksData.length > 0 ? Math.min(otherBanksData.length * -0.5, -5) : 0; // Mengurangi skor

      const totalScore =
        proximityScore + demographicScore + competitionScore + accessibilityScore + branchProximityBonus + otherBankImpact

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
        otherBankImpact: otherBankImpact.toFixed(1), // <--- Tambahkan ini
        estimatedCost: (500 + Math.random() * 1000).toFixed(0),
        breakEvenMonths: Math.floor(8 + Math.random() * 16),
        location: location,
        nearbyBranchCount: branchesData.length, // Gunakan data yang dikembalikan
        nearbyOtherBanksCount: otherBanksData.length, // <--- Tambahkan ini
        nearbyCommonPlacesCount: totalCommonPlaces, // Gunakan data yang dihitung
      })

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

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <RelocationHeader cardBg={cardBg} />

          {/* Location Search Section */}
          <LocationSearchCard
            cardBg={cardBg}
            locationName={locationName}
            handleLocationChange={handleLocationChange}
            isLoadingSuggestions={isLoadingSuggestions}
            showSuggestions={showSuggestions}
            locationSuggestions={locationSuggestions}
            handleLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            handleAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          {/* Input Biaya Relokasi - Kartu Baru */}
          <CostInputCard cardBg={cardBg} />

          {/* Google Maps Interactive Map */}
          {selectedLocation && (
            <InteractiveMapCard
              cardBg={cardBg}
              selectedLocation={selectedLocation}
              mapRef={mapRef}
              markerRef={markerRef}
              mapContainerRef={mapContainerRef}
              updateSelectedLocationFromMap={updateSelectedLocationFromMap}
              // --- Meneruskan data lokasi terdekat ke peta ---
              nearbyBJBBranches={nearbyBJBBranches}
              nearbyOtherBanks={nearbyOtherBanks}
              nearbyCommonPlaces={nearbyCommonPlaces}
            />
          )}

          {/* Nearby BJB Branches - KCP BJB Terdekat (pindah ke atas kartu status) */}
          {selectedLocation && analysisResult && (
            <NearbyBranchesCard
              cardBg={cardBg}
              selectedLocation={selectedLocation}
              isLoadingBranches={isLoadingBranches}
              nearbyBJBBranches={nearbyBJBBranches}
            />
          )}

          {/* Nearby Other Banks/ATMs - Bank/ATM Lain Terdekat (kartu baru) */}
          {selectedLocation && analysisResult && (
            <NearbyOtherBanksCard
              cardBg={cardBg}
              selectedLocation={selectedLocation}
              isLoadingOtherBanks={isLoadingOtherBanks}
              nearbyOtherBanks={nearbyOtherBanks}
              mapsApiKey={Maps_API_KEY} // <--- Pass Maps_API_KEY ke komponen baru
            />
          )}

          {/* Lokasi Umum Terdekat - Lokasi Umum Terdekat (pindah ke atas kartu status) */}
          {selectedLocation && analysisResult && (
            <NearbyCommonPlacesCard
              cardBg={cardBg}
              selectedLocation={selectedLocation}
              isLoadingCommonPlaces={isLoadingCommonPlaces}
              nearbyCommonPlaces={nearbyCommonPlaces}
            />
          )}

          {/* CBA Analysis Result - Ini adalah kartu status yang menampilkan "Berpotensi", "Perlu Diperhitungkan", dll. */}
          {analysisResult && (
            <CBAAnalysisResultCards
              cardBg={cardBg}
              analysisResult={analysisResult}
              mockHistoricalData={mockHistoricalData}
              nearbyCommonPlacesCount={analysisResult.nearbyCommonPlacesCount} 
            />
          )}

          {/* Instructions - Hanya muncul jika belum ada hasil analisis */}
          {!analysisResult && <RelocationInstructions cardBg={cardBg} />}
        </VStack>
      </Container>
    </Box>
  )
}

export default RelocationComponent
