"use client";

import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../../lib/utils";
import { useState } from "react";

import {
  Button,
  IconButton,
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
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import React from "react";


const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();
  const [showPopover, setShowPopover] = useState(false);

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  return (
    <div>
    { connected ? (
      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton
            as={Button}
            py={2}
            transition="all 0.3s"
            colorScheme="black"
            variant="outline"
            _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Image
                boxSize='18px'
                objectFit='cover'
                src='metamask-icon.svg'
                alt='metamask'
              /> 
              <Text>{formatAddress(account)}</Text>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={disconnect}>Disconnect</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    ) : (
      <Button colorScheme="black" variant="outline" onClick={connect}>
        Connect Wallet
      </Button>
    )}
  </div>
  );
};


export default ConnectWalletButton;