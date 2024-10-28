// create an express server with /health, /balance get endpoints, and /claim post endpoints
import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import { getAccount, publicClient, walletClient } from "./utils"
import { Address, isAddress } from "viem"
dotenv.config()

const account = getAccount()
// 0.001 ETH
const amount = BigInt(1e15)
const app = express()
const port = 8000

app.use(cors()) // Enable CORS
app.use(express.json())

app.get("/health", (req: express.Request, res: express.Response) => {
  res.status(200).send("Server is healthy")
})

app.get("/account", (req: express.Request, res: express.Response) => {
  res.status(200).json({ account: account.address })
})

app.get("/balance", async (req: express.Request, res: express.Response) => {
  // Placeholder for balance logic

  // get balance from the base sepolia
  const balance = await publicClient.getBalance({
    address: account.address,
  })

  res.status(200).json({ balance: balance.toString() })
})

app.post("/claim", async (req: express.Request, res: express.Response) => {
  // Placeholder for claim logic
  const { account: externalAddress } = req.body
  // check 0x address

  if (isAddress(externalAddress)) {
    // validate eth address
    // send amount to the account
    console.log(`sending ${amount} to ${externalAddress}`)
    let tx = await walletClient.sendTransaction({
      account,
      to: externalAddress as Address,
      value: amount,
    })
    res.status(200).json({ tx })
  } else {
    res.status(400).json({ message: "Invalid claim request" })
  }
})

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port} with account: ${account.address}`
  )
})
