const { createApp, setup, ref, onMounted } = Vue;

const encryptedData = (text, key, iv) => {
  const keyAES = forge.util.hexToBytes(key);

  // ENCRYPT the text
  let cipher = forge.cipher.createCipher('AES-GCM', keyAES);

  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(text));
  cipher.finish();

  let tag = forge.util.bytesToHex(cipher.mode.tag);
  let encrypted = forge.util.encode64(cipher.output.data);

  return { encrypted, tag };
};

const generateKeyPair = async () => {
  let keypair;
  await forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, k) => {
    keypair = k;
  });
  return keypair;
};

const decryptKeys = (keypair, text) => {
  // DECRYPT String
  let decrypted = keypair.privateKey.decrypt(
    forge.util.decode64(text),
    'RSAES-PKCS1-V1_5'
  );
  return JSON.parse(decrypted);
};

createApp({
  setup() {
    const login = ref({ email: 'kevin@test.io', password: 'password' });
    const asimetricKey = ref({
      iv: '',
      aes: ''
    });

    onMounted(async () => {
      const keypair = await generateKeyPair();

      // convert public key to PEM format
      const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);

      const public = await fetch('http://localhost:3000/api/v1/public-key', {
        method: 'POST',
        body: JSON.stringify({ public: publicKey }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const { encrypt } = await public.json();

      const { iv, key } = decryptKeys(keypair, encrypt);
      console.log('🚀 ~ onMounted ~ iv, key', iv, key)

      asimetricKey.value.aes = key;
      asimetricKey.value.iv = iv;
    });

    const sendDataEncrypted = async () => {
      // ENCRYPT the text

      const base64StringCodec = encryptedData(
        JSON.stringify({
          email: login.value.email,
          password: login.value.password
        }),
        asimetricKey.value.aes,
        asimetricKey.value.iv
      );

      const public = await fetch('http://localhost:3000/api/v1/decode', {
        method: 'POST',
        body: JSON.stringify({ data: base64StringCodec }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log(await public.json());
    };

    return { login, sendDataEncrypted };
  }
}).mount('#app');
