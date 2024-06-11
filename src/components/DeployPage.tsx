import Head from "next/head";
import { useWeb3React } from "@web3-react/core";
import { useSDK } from "@metamask/sdk-react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers, getAddress } from "ethers";
import { Formik, Field, Form, FieldProps, FormikProps, ErrorMessage, FormikHelpers } from 'formik';

import UniswapV2Factory from '@uniswap/v2-core/build/UniswapV2Factory.json';
import UniswapV2Pair from '@uniswap/v2-core/build/UniswapV2Pair.json';
import UniswapV2Router02 from '@uniswap/v2-periphery/build/UniswapV2Router02.json';
import { formatAddress } from "../../lib/utils";


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
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { create } from "domain";

export interface IUser {
	_id: string,
	username: string,
	password: string, //timestamp
	factoryAddress: string | null, //timestamp
	routerAddress: string | null,
}

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

const DeployPage = () => {
  const [deploying, setDeploying] = useState(false);
  const [factoryAddress, setFactoryAddress] = useState('');
  const [routerAddress, setRouterAddress] = useState('');
  const [pairs, setPairs] = useState<{
    pairAddr: string,
    token0Addr: string,
    token0Name: string,
    token0Symbol: string,
    token1Addr: string,
    token1Name: string,
    token1Symbol: string
  }[]>([]);

  // const { sdk, connected, connecting, provider, chainId } = useSDK();

  useEffect(() => {
    setFactoryAddress(localStorage.getItem("factoryAddress") || "");
  },[])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPairList = async () => {
    if (!factoryAddress) return;

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

    const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);


    try {
      const length = await factory.allPairsLength();
      const pairsList = [];
      for (let i = 0; i < length; i++) {
        const pairAddr = await factory.allPairs(i);
        const pairContract = new ethers.Contract(pairAddr, pairAbi, signer);
        const token0Addr = await pairContract.token0();
        const token1Addr = await pairContract.token1();

        // Get token0 name and symbol
        const token0Contract = new ethers.Contract(token0Addr, ERC20_ABI, signer);
        const token0Name = await token0Contract.name();
        const token0Symbol = await token0Contract.symbol();

        // Get token1 name and symbol
        const token1Contract = new ethers.Contract(token1Addr, ERC20_ABI, signer);
        const token1Name = await token1Contract.name();
        const token1Symbol = await token1Contract.symbol();

        pairsList.push({
          pairAddr,
          token0Addr,
          token0Name,
          token0Symbol,
          token1Addr,
          token1Name,
          token1Symbol
        });
      }
      setPairs(pairsList);
    } catch (error) {
      console.error('Error fetching pairs:', error);
    }

  }

  useEffect(() => {
    getPairList();
  }, [pairs, getPairList]);


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

      
      // Uniswap V2 Factory ABI and Bytecode
      const factoryAbi = UniswapV2Factory.abi;
      const factoryBytecode = UniswapV2Factory.bytecode;

      // Create a ContractFactory and deploy
      const Factory = new ethers.ContractFactory(factoryAbi, factoryBytecode, signer);
      const factory = await Factory.deploy(signer.getAddress());

      
      // Uniswap V2 Factory ABI and Bytecode
      const routerAbi = UniswapV2Router02.abi;
      const routerBytecode = UniswapV2Router02.bytecode;

      // Create a ContractFactory and deploy
      const routerFactory = new ethers.ContractFactory(routerAbi, routerBytecode, signer);
      const routerfactory = await routerFactory.deploy(factory.getAddress(),'0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9');

      // Wait for the contract to be mined
      //await factory.deployed();

      // Set the factory address state
      setFactoryAddress(factory.target as string);
      localStorage.setItem("factoryAddress", factory.target as string);
      setRouterAddress(routerfactory.target as string);
      localStorage.setItem("routerAddress", routerfactory.target as string);

      //setRouterAddress(routerfactory.target as string);
      console.log('UniswapV2Factory deployed to:', factoryAddress, routerAddress);
    } catch (error) {
      console.error('Error deploying contract:', error);
    } finally {
      setDeploying(false);
    }
  };

  const createPair = async (token1: string, token2: string) => {
    
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

    const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);

    try {
      const tx = await factory.createPair(token1, token2);
      await tx.wait();
      const pairAddress = await factory.getPair(token1, token2);
    } catch (error) {
      console.error('Error creating pair:', error);
      alert('Error creating pair');
    }
  }

  function isValidEthereumAddress(value: string) {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(value);
  }

  async function validateAddress(value: string) {
    let error;
    if (!value) {
      error = 'Address is required';
    } else if (!isValidEthereumAddress(value)) {
      error = 'Invalid address format';
    } else {
      // check if its ERC20
      /*
      try {
        const contract = new ethers.Contract(value, ERC20_ABI, provider);
        await contract.balanceOf('0x0000000000000000000000000000000000000000');
      } catch (e) {
        error = 'Address is not a valid ERC20 contract';
      }
      */
    }
    return error;
  }
  

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
            <TableCaption>All Pairs of factoryContract listed here</TableCaption>
            <Thead>
              <Tr>
                <Th>Index</Th>
                <Th>Token1</Th>
                <Th>Token2</Th>
                <Th>Pair Address</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pairs.map((pair, index) => (
                  <Tr key={index}>
                    <Td>{index}</Td>
                    <Td>{`${pair.token0Name} (${pair.token0Symbol}) at ${formatAddress(pair.token0Addr)}`}</Td>
                    <Td>{`${pair.token1Name} (${pair.token1Symbol}) at ${formatAddress(pair.token1Addr)}`}</Td>
                    <Td>{pair.pairAddr}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box alignItems="flex-start" justifyContent="flex-start" width='100%' p={4} background="white" borderRadius='md'>
        <Text size='6xl' as='b'>Create new Pair</Text>
        <HStack spacing={4}>
          <Formik
            initialValues={{ token1Address: '', token2Address: '' }}
            onSubmit={(values, actions) => {
              // add pair with factory
              setTimeout(async() => {
                await createPair(values.token1Address, values.token2Address);
                actions.setSubmitting(false);
                window.location.reload();
              }, 1000);
            }}
          >
            {(props) => (
              <Form>
                <HStack spacing={4} alignItems="left" justifyContent="flex-start">
                  <Field name='token1Address' validate={validateAddress}>
                    {({ field, form }: FieldProps) => (
                      <FormControl isInvalid={!!(form.errors.token1Address && form.touched.token1Address)}>
                        <FormLabel>Token 1 Address</FormLabel>
                        <Input {...field} placeholder='0x.....' />
                        <ErrorMessage name="token1Address" component={FormErrorMessage} />
                      </FormControl>
                    )}
                  </Field>
                  <Field name='token2Address' validate={validateAddress}>
                    {({ field, form }: FieldProps) => (
                      <FormControl isInvalid={!!(form.errors.token2Address && form.touched.token2Address)}>
                        <FormLabel>Token 2 Address</FormLabel>
                        <Input {...field} placeholder='0x.....' />
                        <ErrorMessage name="token2Address" component={FormErrorMessage} />
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <Button
                  mt={4}
                  colorScheme='teal'
                  isLoading={props.isSubmitting}
                  type='submit'
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </HStack>
       
    </Box>


    </VStack>
  )
}

export default DeployPage;