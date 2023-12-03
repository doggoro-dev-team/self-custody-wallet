import * as bip39 from 'bip39';

import ethers from './ethers'

import { DerivationPath } from './types';

export const buildAddressFromKey = ({
  privateKey,
}: {
  privateKey: string;
}): string => {
  const address = new ethers.Wallet(privateKey).address
  
  return address;
};

export const getPrivateKeysFromMnemonic = ({
  mnemonic,
  index = 0,
}: {
  mnemonic: string;
  index?: number;
}) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  return ethers.Wallet.fromMnemonic(mnemonic, DerivationPath.BSC + index).privateKey
};

 export const getRandomMnemonic = () => {
  const randomWallet = ethers.Wallet.createRandom()
  if (randomWallet.mnemonic) {
    return randomWallet.mnemonic.phrase
  }

  return ''
}