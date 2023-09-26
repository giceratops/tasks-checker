import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { Layout } from "~/components/layout/Layout";
import "~/styles/globals.css";
import theme from "~/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  const ref = React.createRef<HTMLElement>();

  return (
    <ChakraProvider theme={theme} toastOptions={{portalProps: {containerRef: ref}}}>
        <Layout toastRef={ref}>
          <Component {...pageProps}/>
        </Layout>
    </ChakraProvider>
  )
};

export default api.withTRPC(MyApp);
