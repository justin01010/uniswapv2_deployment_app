import Head from "next/head";
import { useState, useEffect } from "react";
import { ethers, getAddress } from "ethers";

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
  Image,
  Spacer,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

const OverviewPage = () => {

  return (
    <VStack spacing={4} alignItems="flex-start">
      <Box>
        <Text as='b' size='6xl'>System Architecture</Text>
        <Image src='contract.png' alt='contract structure'/>
      </Box>

      <Box>
        <Text size="xl" as="b">Core</Text>
        <UnorderedList>
          <ListItem>
            Comprises a single factory and multiple pairs. These minimalistic contracts ensure safety and efficiency. (Note: direct interaction is not recommended.)
          </ListItem>
          <ListItem>
            <Text as="b">Factory:</Text> Factory contract to allow users to deploy their own pool token pair (uses create2 to deploy Pair contract).
          </ListItem>
          <ListItem>
            <Text as="b">Pairs:</Text> Serve as automated market makers, deal with pool status and interactions such as tracking pool token balances, exposing data for decentralized price oracles, etc.
          </ListItem>
        </UnorderedList>
      </Box>

      <Box>
        <Text size="xl" as="b">Periphery</Text>
        <UnorderedList>
          <ListItem>
            A set of contracts supporting specific interactions with the core, providing examples of safe and efficient interactions.
          </ListItem>
          <ListItem>
            <Text as="b">Library:</Text> Serve as library for router or other user-defined contracts that offers convenience for data fetching and pricing.
          </ListItem>
          <ListItem>
            <Text as="b">Router:</Text> Supports trading and liquidity management, enabling multi-pair trades, ETH integration, and meta-transactions.
          </ListItem>
        </UnorderedList>
      </Box>
    </VStack>
  )
}

export default OverviewPage;
