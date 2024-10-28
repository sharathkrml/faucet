import * as crypto from 'crypto';
import * as fs from 'fs';
import { privateKeyToAccount } from 'viem/accounts'

export const generatePkey = () => {
 return crypto.randomBytes(32).toString('hex');
};

const main = () => {
 // save the generated private key to a file
 const pkey = generatePkey();
 fs.writeFileSync('.env', "PRIVATE_KEY=" + pkey);
 console.log('Private key generated and saved to .env');
 const account = privateKeyToAccount(`0x${pkey}`);
 console.log('account:', account.address);
}

main();