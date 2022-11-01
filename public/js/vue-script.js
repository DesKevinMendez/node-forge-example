const { createApp, setup, ref, onMounted } = Vue;

const encryptedData = (text, key) => {
  let iv = forge.random.getBytesSync(16);
  let cipher = forge.cipher.createCipher('AES-GCM', forge.util.hexToBytes(key));

  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(text));
  cipher.finish();
  return forge.util.encode64(cipher.output.data);
};
createApp({
  setup() {
    const login = ref({ email: '', password: '' });
    const aesKey = ref('');

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
      const { aes } = await public.json();
      aesKey.value = aes;
    });

    const sendDataEncripted = async () => {
      // ENCRYPT the text
      const base64StringCodec = encryptedData(
        JSON.stringify(login),
        aesKey.value
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
