const { createApp, setup, ref, onMounted } = Vue;

const encryptedData = (text, key, iv) => {
  const keyAES = forge.util.hexToBytes(key);

  // ENCRYPT the text
  let cipher = forge.cipher.createCipher('AES-GCM', keyAES);

  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(text));
  cipher.finish();

  let tag = cipher.mode.tag;

  let encrypted = forge.util.encode64(cipher.output.data);

  return { encrypted, tag };
};

createApp({
  setup() {
    const login = ref({ email: 'kevin@test.io', password: 'password' });
    const asimetricKey = ref({
      iv: '',
      aes: ''
    });

    onMounted(async () => {
      let keypair;
      await forge.pki.rsa.generateKeyPair(
        { bits: 256, workers: 2 },
        (err, k) => {
          keypair = k;
        }
      );
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
      const { aes, iv } = await public.json();
      asimetricKey.value.aes = aes;
      asimetricKey.value.iv = iv;
    });

    const sendDataEncripted = async () => {
      // ENCRYPT the text

      const base64StringCodec = encryptedData(
        JSON.stringify({
          email: login.value.email,
          password: login.value.password
        }),
        asimetricKey.value.aes,
        asimetricKey.value.iv,
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

    return { login, sendDataEncripted };
  }
}).mount('#app');
