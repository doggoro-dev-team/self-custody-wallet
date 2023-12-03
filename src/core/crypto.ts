import Aes from "react-native-aes-crypto";

interface IKeyParam {
  salt: string;
  cost?: number;
  length?: number;
}
export const generateKey = async (param: IKeyParam) =>
  Aes.pbkdf2("Gang", param.salt, param.cost || 5000, param.length || 256);

export interface EncryptedData {
  iv: string;
  cipher: string;
}

export const encryptData = async (
  text: string,
  key: string
): Promise<EncryptedData> => {
  return Aes.randomKey(16).then((iv) => {
    return Aes.encrypt(text, key, iv, "aes-256-cbc").then((cipher) => ({
      cipher,
      iv,
    }));
  });
};

interface IDecryptParam {
  iv: string;
  cipher: string;
  key: string;
}
export const decryptData = async ({ iv, cipher, key }: IDecryptParam) =>
  Aes.decrypt(cipher, key, iv, "aes-256-cbc");
