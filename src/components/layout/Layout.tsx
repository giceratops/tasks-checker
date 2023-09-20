import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export type LayoutProps = {
  children: ReactNode
}

export const Layout = (props: LayoutProps) => {
  
  return (<>
      <Head>
        <title>Tasks Checker</title>
        <meta name="description" content="Tasks checker" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Flex direction="column" flex="1"> 
        <Navbar />
        <Flex as="main" role="main" direction="column" flex="1">
          { props.children }
        </Flex>
        <Footer />
      </Flex>
  </>)
}