// src/components/NearbyBranchesCard.jsx

import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  Spacer,
  Badge,
  Spinner,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { getBranchTypeIcon } from "../../utils/relocationUtils" // Import helper

const NearbyBranchesCard = ({
  cardBg,
  selectedLocation,
  isLoadingBranches,
  nearbyBJBBranches,
}) => {
  if (!selectedLocation) return null // Jangan render jika tidak ada lokasi yang dipilih

  return (
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
  )
}

export default NearbyBranchesCard
