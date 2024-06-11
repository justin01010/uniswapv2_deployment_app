'use client'
import { Link } from '@chakra-ui/next-js'
import { Text } from '@chakra-ui/react';
import NavBar from "@/components/Navbar";
import MyApp from '@/components/MyApp';

export default function Page() {
  return (
    // eslint-disable-next-line react/no-children-prop
    <MyApp>
      <Text>Welcome to deploy your own uniswapV2 pool!</Text>
    </MyApp>
  )
}
