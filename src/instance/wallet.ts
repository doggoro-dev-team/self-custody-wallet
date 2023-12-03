import {
  getRandomMnemonic,
  getPrivateKeysFromMnemonic,
  buildAddressFromKey,
} from "../core/utils";
import {
  generateKey,
  encryptData,
  decryptData,
  EncryptedData,
} from "../core/crypto";
import { signMessage, signTransaction, TransactionRequest } from "../core/sign";
import { saveStorage, loadStorage, resetStorage } from "../core/store";

type WalletType = "created" | "imported";

interface IAccount {
  name: string;
  account: string;
  encryptedPrivateKey: EncryptedData;
}

interface IWallet {
  key: string;
  encryptedMnemonic: EncryptedData;
  type: WalletType;
  generatedIndex: number;
  accounts: IAccount[];
}

class Wallet {
  private currentAccountIndex = 0;

  wallet: IWallet | null = null;

  constructor() {
    this.init();
  }

  static getRandomMnemonic(): string {
    return getRandomMnemonic();
  }

  public async setupWallet(mnemonic: string, type: WalletType) {
    // 1. get address from mnemonic
    const privateKey = getPrivateKeysFromMnemonic({ mnemonic, index: 0 });
    // 2. generate address
    const address = buildAddressFromKey({ privateKey });
    // 3. generate random secrect key
    const key = await generateKey({ salt: String(Date.now()) });
    // 4. encrypt private key with secrect key
    const encryptedPrivateKey = await encryptData(privateKey, key);
    // 5. encrypt mnemonic with secrect key
    const encryptedMnemonic = await encryptData(mnemonic, key);
    const wallet = {
      key,
      encryptedMnemonic,
      type,
      generatedIndex: 0,
      accounts: [
        {
          name: "Account 1",
          account: address,
          encryptedPrivateKey,
        },
      ],
    };
    // 6. save to storage
    await saveStorage("wallet", JSON.stringify(wallet));

    this.wallet = wallet;
    this.currentAccountIndex = 0;
  }

  public async deleteWallet() {
    await resetStorage();
    this.wallet = null;
  }

  public getAccounts(): string[] {
    if (!this.wallet) return [];

    return this.wallet.accounts.map((account) => account.account);
  }

  public async sendTransaction(txData: TransactionRequest) {
    if (!this.wallet) throw new Error("Please init wallet first");

    // sign transaction with current account
    const encryptedPrivateKey =
      this.wallet.accounts[this.currentAccountIndex].encryptedPrivateKey;
    const privateKey = await decryptData({
      ...encryptedPrivateKey,
      key: this.wallet.key,
    });

    return signTransaction({ txData, privateKey });
  }

  public async signMessage(message: string) {
    if (!this.wallet) throw new Error("Please init wallet first");

    // sign message with current account
    const encryptedPrivateKey =
      this.wallet.accounts[this.currentAccountIndex].encryptedPrivateKey;
    const privateKey = await decryptData({
      ...encryptedPrivateKey,
      key: this.wallet.key,
    });

    return signMessage({ message, privateKey });
  }

  private async init() {
    // get wallet from storage
    const storage = await loadStorage();
    if (!storage) return;

    this.wallet = JSON.parse(storage.password);
  }
}

export default new Wallet();
