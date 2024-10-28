import * as dotenv from 'dotenv';
import { PrivateKeyAccount, privateKeyToAccount } from 'viem/accounts'
import { http, createPublicClient, createWalletClient } from 'viem'
import { baseSepolia } from 'viem/chains'
dotenv.config();

export const getAccount = (): PrivateKeyAccount => {
 // read PRIVATE_KEY from .env
 const privateKey = process.env.PRIVATE_KEY;
 console.log('privateKey:', privateKey);
 return privateKeyToAccount(`0x${privateKey}`);
}


export const publicClient = createPublicClient({
 chain: baseSepolia,
 transport: http(),
})


export const walletClient = createWalletClient({
 chain: baseSepolia,
 transport: http(),
})