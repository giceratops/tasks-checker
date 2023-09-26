import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import type { ReactNode, Ref } from 'react';
import { TaskProvider } from '~/providers/TaskProvider';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export type LayoutProps = {
  children: ReactNode
  toastRef: Ref<HTMLElement>
}

export const Layout = (props: LayoutProps) => {
  
  return (<>
  <TaskProvider>
      <Head>
        <title>Tasks Checker</title>
        <meta name="description" content="Tasks checker" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Flex direction="column" flex="1"> 
        <Navbar />
        <Flex as="main" role="main" direction="column" flex="1" ref={props.toastRef}>
          { props.children }
        </Flex>
        <Footer />
      </Flex>
  </TaskProvider>
  </>)
}