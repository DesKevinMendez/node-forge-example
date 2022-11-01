import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import forge from 'node-forge'
import { encriptedAESkey } from '../utils/encripted'

export default (fastify: FastifyInstance, _: any, done: Function) => {
  fastify.get('/public-key', async (_: FastifyRequest, reply: FastifyReply) => {
    return { data: 'hola' }
  })
  fastify.post('/public-key', async (request: FastifyRequest<{ Body: { public: string } }>, reply: FastifyReply) => {
    const pl = request.body.public
      .replace("-----BEGIN PUBLIC KEY-----\r\n", '')
      .replace("\r\n-----END PUBLIC KEY-----\r\n", '')

    return reply.send({
      data: pl,
      aes: await encriptedAESkey()
    })
  })
  done()
}

const demonstrateKeyBasedSymmetricEncryption = () => {
  try {
    // replace with yout actual String
    let exampleString =
      "Text that is going to be sent over an insecure channel and must be encrypted at all costs!";
    // the key used for encryption and decryption, assign your key here
    // if none is assigned a random one is generated
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    const key = forge.random.getBytesSync(32);
    console.log('key', key);
    //create random initialization vector
    let iv = forge.random.getBytesSync(16);

    // ENCRYPT the text
    let cipher = forge.cipher.createCipher("AES-GCM", key);
    console.log(cipher.output);

    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(exampleString));
    cipher.finish();
    let tag = cipher.mode.tag;
    let encrypted = forge.util.encode64(cipher.output.data);

    // DECRYPT the text
    let decipher = forge.cipher.createDecipher("AES-GCM", key);
    decipher.start({
      iv,
      tag
    });
    decipher.update(forge.util.createBuffer(forge.util.decode64(encrypted)));
    decipher.finish();
    let decrypted = decipher.output;
    console.log('line-47', decrypted.toString());

  } catch (error: unknown) {
    console.error((error as any).message);
  }
};