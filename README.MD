## Init project

Run the next scripts for install package dependencies

```
yarn install
```

Run the next scripts for development
```
yarn dev:watch 
```
and in another terminal run:
```
yarn dev
```

dev:watch for compile files of ts with --watch flag and dev for nodemon.


## ENV file

How generate values for .env file:

```BASE_64_KEY_ENCRIPT```
```
import { random, util } from 'forge-node'

const key = random.getBytesSync(32);
console.log(util.bytesToHex(key));
```
<br/>

```IV_ENCRIPT```
```
import { random, util } from 'forge-node';
let iv = random.getBytesSync(16);
console.log(util.bytesToHex(iv))
```