import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Layout } from "~/components/layout/Layout";
import "~/styles/globals.css";
import theme from "~/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider options={{
        initialColorMode: 'dark',
        useSystemColorMode: true,
      }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ColorModeProvider>
    </ChakraProvider>
  )
};

export default api.withTRPC(MyApp);
