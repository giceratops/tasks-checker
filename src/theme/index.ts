import { theme as _proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/theme';
import '@fontsource/poppins/400.css';

const proTheme = extendTheme(_proTheme)
const extenstion = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  colors: { ...proTheme.colors, ...theme.colors, brand: '#ff000' },
  fonts : {
    heading: 'Poppins',
    body: 'Poppins'
  },
}
const customTheme = extendTheme(extenstion, proTheme)

export default customTheme