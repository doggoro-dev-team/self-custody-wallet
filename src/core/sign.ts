import { TransactionRequest } from "@ethersproject/abstract-provider";

import ethers from "./ethers";

export interface IRequestSignMessage {
  privateKey: string;
  message: string;
}
export const signMessage = (data: IRequestSignMessage) => {
  const signature = new ethers.Wallet(data.privateKey).signMessage(
    data.message
  );

  return signature;
};

export interface IRequestSignTransaction {
  privateKey: string;
  txData: TransactionRequest;
}
export const signTransaction = (data: IRequestSignTransaction) => {
  const signature = new ethers.Wallet(data.privateKey).signTransaction(
    data.txData
  );

  return signature;
};

export { TransactionRequest } from "@ethersproject/abstract-provider";