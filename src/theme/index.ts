import { theme } from '@chakra-ui/pro-theme'
import { extendTheme } from '@chakra-ui/react';
import '@fontsource/poppins/400.css';

const proTheme = extendTheme(theme)
const extenstion = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  colors: { ...proTheme.colors, brand: proTheme.colors.white },
  fonts : {
    heading: 'Poppins',
    body: 'Poppins'
  },
}
const customTheme = extendTheme(extenstion, proTheme)

export default customTheme