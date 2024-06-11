import Head from "next/head";
import { useWeb3React } from "@web3-react/core";
import { useSDK } from "@metamask/sdk-react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers, getAddress } from "ethers";
import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json';
import UniswapV2Router02 from '@uniswap/v2-periphery/build/UniswapV2Router02.json';


import { MetaMaskSDK } from "@metamask/sdk";
import {
  IconButton,
  Button,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
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
} from '@chakra-ui/react';

export interface IUser {
	_id: string,
	username: string,
	password: string, //timestamp
	factoryAddress: string | null, //timestamp
	routerAddress: string | null,
}

const DeployPage = () => {
  const [deploying, setDeploying] = useState(false);
  const [factoryAddress, setFactoryAddress] = useState('');
  const [routerAddress, setRouterAddress] = useState('');
  // const { sdk, connected, connecting, provider, chainId } = useSDK();



  const deployContract = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }
    setDeploying(true);
    try {

      // Request access to the user's MetaMask account
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create an ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log(signer);

      // Uniswap V2 Factory ABI and Bytecode
      const factoryAbi = UniswapV2Factory.abi;
      const factoryBytecode = UniswapV2Factory.bytecode;

      console.log(factoryAbi);

      // Create a ContractFactory and deploy
      const Factory = new ethers.ContractFactory(factoryAbi, factoryBytecode, signer);
      const factory = await Factory.deploy(signer.getAddress());

      /*
      // Uniswap V2 Factory ABI and Bytecode
      const routerAbi = UniswapV2Router02.abi;
      const routerBytecode = UniswapV2Router02.bytecode;

      console.log(factoryAbi);

      // Create a ContractFactory and deploy
      const routerFactory = new ethers.ContractFactory(routerAbi, routerBytecode, signer);
      const routerfactory = await routerFactory.deploy(factory.getAddress(),'0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9');
      */

      // Wait for the contract to be mined
      //await factory.deployed();

      // Set the factory address state
      setFactoryAddress(factory.target as string);
      //setRouterAddress(routerfactory.target as string);
      console.log('UniswapV2Factory deployed to:', factoryAddress, routerAddress);
    } catch (error) {
      console.error('Error deploying contract:', error);
    } finally {
      setDeploying(false);
    }
  };
  

  return (
    <VStack spacing={4}>
      <Box bg="wheat" w='100%' py={2} px={4} borderRadius='md'>
        {factoryAddress ? (
          <Text>UniswapV2 Factory Contract At: {factoryAddress}</Text>
        ) : (
          <HStack justifyContent="flex-start" alignItems="center" spacing={8}>
            <Text>No UniswapV2 Factory Contract Deployed</Text>
            <Button 
              onClick={deployContract} 
              disabled={deploying} 
              colorScheme="black" 
              background='whitesmoke'
              variant="outline"
              _focus={{ boxShadow: 'none' }}>
              Create UniswapV2 factory
            </Button>
          </HStack>
        )}
      </Box>
      <Box display="flex" justifyContent="center" width="100%" background="white" borderRadius='md'>
        <TableContainer width="100%">
          <Table variant="simple">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
              <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td isNumeric>30.48</Td>
              </Tr>
              <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td isNumeric>0.91444</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>

    </VStack>
  )
}

export default DeployPage;