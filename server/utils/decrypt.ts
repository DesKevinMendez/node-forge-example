
import { cipher, util, } from 'node-forge';

export const decryptData = async (encrypted: string, tag: any, iv: string) => {
  let decipher = cipher.createDecipher("AES-GCM", util.hexToBytes((process.env.BASE_64_KEY_ENCRYPT as string)));

  decipher.start({
    iv, tag
  });
  decipher.update(util.createBuffer(util.decode64(encrypted)));
  decipher.finish();

  return decipher.output;
}
