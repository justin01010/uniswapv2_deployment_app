import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { ethers, getAddress } from "ethers";
import StatsCard from "./StatsCard";

import { MetaMaskSDK } from "@metamask/sdk";
import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json';
import UniswapV2Pair from '@uniswap/v2-core/build/UniswapV2Pair.json';
import UniswapV2Router02 from '@uniswap/v2-periphery/build/UniswapV2Router02.json';
import { formatAddress } from "../../lib/utils";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Grid,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  chakra,
  SimpleGrid,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface PoolStatus {
  pairAddr?: string;
  token0Addr?: string;
  token0Name?: string;
  token0Symbol?: string;
  token0Amount?: string;
  token1Addr?: string;
  token1Name?: string;
  token1Symbol?: string;
  token1Amount?: string;
}

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const InteractPage = () => {

  const [factoryAddress, setFactoryAddress] = useState("");
  const [routerAddress, setRouterAddress] = useState("");
  const [poolStatus, setPoolStatus] = useState<PoolStatus>({});
  const [PL_amountADesired, setPL_amountADesired] = useState(0);
  const [PL_amountBDesired, setPL_amountBDesired] = useState(0);
  const [PL_amountAMin, setPL_amountAMin] = useState(0);
  const [PL_amountBMin, setPL_amountBMin] = useState(0);


  useEffect(() => {
    setRouterAddress(localStorage.getItem("routerAddress") || "");
    setFactoryAddress(localStorage.getItem("factoryAddress") || "");
  },[])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPoolStatus = useCallback(async () => {
    if (!routerAddress) return;

    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    // Request access to the user's MetaMask account
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create an ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
     
    const factoryAbi = UniswapV2Factory.abi;
    const pairAbi = UniswapV2Pair.abi;
    const routerAbi = UniswapV2Router02.abi;

    const router = new ethers.Contract(routerAddress, routerAbi, signer);
    const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);

    try {
        const pairAddr = await factory.allPairs(0);
        console.log(pairAddr);
        const pairContract = new ethers.Contract(pairAddr, pairAbi, signer);
        const token0Addr = await pairContract.token0();
        const token1Addr = await pairContract.token1();
        const [reserve0, reserve1, blockTimestampLast] = await pairContract.getReserves();
        console.log(reserve0, reserve1);

        // Get token0 name and symbol
        const token0Contract = new ethers.Contract(token0Addr, ERC20_ABI, signer);
        const token0Name = await token0Contract.name();
        const token0Symbol = await token0Contract.symbol();

        // Get token1 name and symbol
        const token1Contract = new ethers.Contract(token1Addr, ERC20_ABI, signer);
        const token1Name = await token1Contract.name();
        const token1Symbol = await token1Contract.symbol();

        setPoolStatus({
          pairAddr,
          token0Addr,
          token0Name,
          token0Symbol,
          token0Amount: reserve0,
          token1Addr,
          token1Name,
          token1Symbol,
          token1Amount: reserve1,
        });
      
    } catch (error) {
      console.error('Error fetching pairs:', error);
    }
  },[factoryAddress, routerAddress]);

  const pl_handleSubmit = async(e: any) => {
    e.preventDefault();

    if (!routerAddress) return;

    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    // Request access to the user's MetaMask account
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create an ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
     
    const factoryAbi = UniswapV2Factory.abi;
    const pairAbi = UniswapV2Pair.abi;
    const routerAbi = UniswapV2Router02.abi;

    const pair = new ethers.Contract(poolStatus.pairAddr as string, pairAbi, signer);
    const router = new ethers.Contract(routerAddress, routerAbi, signer);
    const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);

    // Get token0 name and symbol
    const token0Contract = new ethers.Contract(poolStatus.token0Addr as string, ERC20_ABI, signer);
    const token1Contract = new ethers.Contract(poolStatus.token1Addr as string, ERC20_ABI, signer);

  
    const _token0Amount = BigInt(`${String(PL_amountADesired)}000000000000000000`);
    const _token1Amount = BigInt(`${String(PL_amountBDesired)}000000000000000000`);
    const _token0Min = BigInt(`${String(PL_amountAMin)}000000000000000000`);
    const _token1Min = BigInt(`${String(PL_amountBMin)}000000000000000000`);
    
    try {
      const txA = await token0Contract.approve(router.target, _token0Amount);
      await txA.wait();
      console.log('Token A approved:', txA);

      const txB = await token1Contract.approve(router.target, _token1Amount);
      await txB.wait();
      console.log('Token B approved:', txB);
    } catch (error) {
      console.error('Approval failed:', error);
    }

    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      const tx = await router.addLiquidity(
        poolStatus.token0Addr,
        poolStatus.token1Addr,
        _token0Amount,
        _token1Amount,
        _token0Min,
        _token1Min,
        await signer.getAddress(),
        deadline
      );
      await tx.wait();
      console.log('Transaction successful', tx);
      window.location.reload();
    } catch (error) {
      console.error('Error adding liquidity:', error);
    }


  };

  useEffect(() => {
    getPoolStatus()
  },[getPoolStatus])

  return (
      <div>
      {factoryAddress ? (
      <Grid templateColumns="4fr 6fr" height="100vh">
        <Box bg="white" p={5} borderRightWidth="1px" borderRadius='10px'>
          <VStack spacing={{ base: 5, lg: 8 }} align="flex-start">
            <chakra.h1
              textAlign={'center'}
              fontSize={'4xl'}
              fontWeight={'bold'}>
              Pool Status
            </chakra.h1>
            <HStack spacing={4} mt={4} justifyContent="center">
              <Text>{`Pair Address: ${poolStatus.pairAddr}`}</Text>
              <Link href={`https://sepolia.etherscan.io/address/${poolStatus.pairAddr}`} isExternal>
                <IconButton
                  icon={<ExternalLinkIcon />}
                  aria-label="External link"
                  variant="outline"
                  colorScheme="teal"
                />
              </Link>
            </HStack>
            <HStack>
            </HStack>
            <Box width="100%">
              <StatsCard
                name={poolStatus.token0Name}
                symbol={poolStatus.token0Symbol}
                link={`https://sepolia.etherscan.io/address/${poolStatus.token0Addr}`}
                stat={poolStatus.token0Amount ? String(BigInt(poolStatus.token0Amount)/BigInt(1000000000000000000)):"0"}
              />
            </Box>
            <Box width="100%">
              <StatsCard
                name={poolStatus.token1Name}
                symbol={poolStatus.token1Symbol}
                link={`https://sepolia.etherscan.io/address/${poolStatus.token1Addr}`}
                stat={poolStatus.token1Amount ? String(BigInt(poolStatus.token1Amount)/BigInt(1000000000000000000)):"0"}
              />
            </Box>
          </VStack>
        </Box>
        <Box bg="white" p={5} alignItems="flex-start" justifyContent="flex-start" marginLeft="20px" borderRadius='10px'>
          <Tabs variant="enclosed" isFitted>
            <TabList mb="1em">
              <Tab>Provide Liquidity</Tab>
              <Tab>Withdraw Liquidity</Tab>
              <Tab>Swap</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <VStack spacing={4} align="stretch" as='form' onSubmit={(e) => {pl_handleSubmit(e)}}>
                    <Box>
                      <Text fontSize="2xl" fontWeight="bold">Provide Liquidity</Text>
                      <Text>Receive the 0.3% transaction fee split by liquidity providers</Text>
                    </Box>
                    <FormControl>
                      <FormLabel>{`${poolStatus.token0Name} (${poolStatus.token0Symbol}) Desired Amount`}</FormLabel>
                      <Input 
                        onChange={(e) => setPL_amountADesired(Number(e.target.value))}
                        placeholder="number" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>{`${poolStatus.token1Name} (${poolStatus.token1Symbol}) Desired Amount`}</FormLabel>
                      <Input 
                        onChange={(e) => setPL_amountBDesired(Number(e.target.value))}
                        placeholder="number" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>{`${poolStatus.token0Name} (${poolStatus.token0Symbol}) Minimum Amount`}</FormLabel>
                      <Input 
                        onChange={(e) => setPL_amountAMin(Number(e.target.value))}
                        placeholder="number" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>{`${poolStatus.token1Name} (${poolStatus.token1Symbol}) Minimum Amount`}</FormLabel>
                      <Input 
                        onChange={(e) => setPL_amountBMin(Number(e.target.value))}
                        placeholder="number" />
                    </FormControl>
                    <Button colorScheme="blackAlpha" variant="solid" width="full" onClick={pl_handleSubmit}>
                      Make Transactions
                    </Button>
                  </VStack>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <VStack spacing={4} align="stretch">
                    <Text>Developing...</Text>
                  </VStack>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <VStack spacing={4} align="stretch">
                    <Text>Developing...</Text>
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>
      ) : (
        <Text>Deploy Factory Contract and Add Pair first</Text>
      )}     
      </div>
    )
}

export default InteractPage;