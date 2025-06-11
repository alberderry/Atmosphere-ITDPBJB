"use client"

import { useState } from "react"
import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Image,
  Text,
  useToast,
  Center,
} from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from './AuthContext'; // Import useAuth untuk mendapatkan fungsi login

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const { login } = useAuth(); // Dapatkan fungsi login dari AuthContext

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulasi proses login
    return new Promise((resolve) => {
      setTimeout(() => {
        // Menggunakan email dan password default yang diminta
        const success = login(email, password); // Gunakan fungsi login dari context
        if (success) {
          toast({
            title: "Login Berhasil",
            description: "Selamat datang di ATMosphere!",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          console.log("Login successful, redirecting to dashboard...")
          navigate('/'); // Arahkan pengguna ke halaman utama (Dashboard) setelah login berhasil
          resolve(true)
        } else {
          toast({
            title: "Login Gagal",
            description: "Email atau password salah. Silakan coba lagi.",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
          resolve(false)
        }
        setIsLoading(false)
      }, 1500) // Simulasi waktu loading
    })
  }

  return (
    <Center bg="blue.50" minH="100vh" p={4}>
      <Box
        bg="white"
        p={8}
        borderRadius="25px"
        boxShadow="xl"
        maxW="md"
        w="full"
        textAlign="center"
      >
        <VStack spacing={6}>
          {/* Logo ATMosphere */}
          <Image
            src=".\src\assets\img\Atmos-logo.png" // Ganti dengan path logo Anda
            alt="ATMosphere Logo"
            boxSize={{ base: "120px", md: "250px" }}
            objectFit="contain"
            mb={-10}
          />
          
          <FormControl id="email" textAlign="left"> {/* Tambahkan textAlign="left" */}
            <FormLabel color={"grey"} mb={0} >Email</FormLabel> {/* Hapus srOnly dan tambahkan teks "Email" */}
            <Input
              type="email"
              placeholder="Enter your Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              variant="filled"
              borderRadius="120px"
            />
          </FormControl>

          <FormControl id="password" textAlign="left"> {/* Tambahkan textAlign="left" */}
            <FormLabel color={"grey"} mb={0}>Password</FormLabel> {/* Hapus srOnly dan tambahkan teks "Password" */}
            <Input
              type="password"
              placeholder="Enter your Password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
              variant="filled"
              borderRadius="120px"
              mb={8}
            />
          </FormControl>

          <Button
            colorScheme="blue"
            size="lg"
            width="150px"
            isLoading={isLoading}
            onClick={handleLogin}
            borderRadius="120px"
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Center>
  )
}

export default Login
