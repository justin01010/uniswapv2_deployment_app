"use client";

import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../../lib/utils";
import { useState } from "react";


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

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  return (
    <div className="relative">
      {connected ? (
        <div className="relative">
          <button onClick={togglePopover} className="btn">
            {formatAddress(account)}
          </button>
          {showPopover && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-100 border rounded-md shadow-lg z-10">
              <button
                onClick={disconnect}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <button disabled={connecting} onClick={connect} className="btn">
          Connect Wallet
        </button>
      )}
    </div>
  );
};


export default ConnectWalletButton;
