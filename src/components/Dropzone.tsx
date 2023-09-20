import { Button, Center, HStack, Icon, Square, Text, VStack, type CenterProps } from '@chakra-ui/react'
import { FiUploadCloud } from 'react-icons/fi'

export const Dropzone = (props: CenterProps) => (
  <Center borderWidth="1px" borderRadius="lg" px="6" py="4" {...props}>
    <VStack spacing="3">
      <Square size="10" bg="bg.subtle" borderRadius="lg">
        <Icon as={FiUploadCloud} boxSize="5" color="fg.muted" />
      </Square>
      <VStack spacing="1">
        <HStack spacing="1" whiteSpace="nowrap">
          <Button variant="text" colorScheme="blue" size="sm" pointerEvents="none">
            Click to upload
          </Button>
          <Text textStyle="sm" color="fg.muted">
            or drag and drop
          </Text>
        </HStack>
        <Text textStyle="xs" color="fg.muted">
          Taks.xlsx
        </Text>
      </VStack>
    </VStack>
  </Center>
)