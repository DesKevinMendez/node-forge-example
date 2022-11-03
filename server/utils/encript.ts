import forge from 'node-forge'
export const encriptAESkey = (publicKey: string): string => {

  const print = forge.pki.publicKeyFromPem(publicKey)

  const keys = {
    iv: process.env.IV_ENCRIPT,
    key: process.env.BASE_64_KEY_ENCRIPT
  }

  let toEncrypt = Buffer.from(JSON.stringify(keys));

  let encrypted = forge.util.encode64(
    print.encrypt(toEncrypt.toString(), "RSAES-PKCS1-V1_5")
  );

  return encrypted;
}
