export const encriptedAESkey = async () => {
  return await generateAESkey()
}

export const generateAESkey = async () => {
  // const key = random.getBytesSync(32);
  // console.log(key, util.hexToBytes(util.bytesToHex(key)));
  return process.env.BASE_64_KEY_ENCRIPT;
}
