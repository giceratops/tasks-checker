import { HStack, Icon, Text } from '@chakra-ui/react'
import { FiUploadCloud } from 'react-icons/fi'

export const Dropzone = () => (
  <>
    <HStack>
      <Icon as={FiUploadCloud} boxSize="6"/>
      <Text>
        Upload
      </Text>
    </HStack>
  </>
)