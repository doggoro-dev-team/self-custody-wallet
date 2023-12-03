import React, { useState, useCallback, useEffect } from "react";

import walletInstance from "../instance/wallet";

export function useAccount() {
  const [account, setAccount] = useState<string | null>(null);

  const createWallet = useCallback(async (mnemonic: string) => {
    await walletInstance.setupWallet(mnemonic, "created");
    setAccount(walletInstance.getAccounts()[0]);
  }, []);

  const recoverWallet = useCallback(async (mnemonic: string) => {
    await walletInstance.setupWallet(mnemonic, "imported");
    setAccount(walletInstance.getAccounts()[0]);
  }, []);

  const deleteWallet = useCallback(async () => {
    await walletInstance.deleteWallet();
    setAccount(null);
  }, []);

  useEffect(() => {
    if (walletInstance.getAccounts()[0]) {
      setAccount(walletInstance.getAccounts()[0]);
    }
  }, []);

  return {
    account,
    createWallet,
    recoverWallet,
    deleteWallet,
  };
}
